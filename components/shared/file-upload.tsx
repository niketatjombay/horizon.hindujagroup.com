'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  accept?: Record<string, string[]>
  maxSize?: number
  error?: string
  value?: File | null
  disabled?: boolean
  className?: string
}

const DEFAULT_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = DEFAULT_ACCEPT,
  maxSize = MAX_FILE_SIZE,
  error,
  value,
  disabled = false,
  className,
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  // Handle file selection after upload completes
  useEffect(() => {
    if (pendingFile && !isUploading && uploadProgress === 100) {
      onFileSelect(pendingFile)
      setPendingFile(null)
    }
  }, [pendingFile, isUploading, uploadProgress, onFileSelect])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        // Simulate upload progress
        setIsUploading(true)
        setUploadProgress(0)
        setPendingFile(file)

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              setIsUploading(false)
              return 100
            }
            return prev + 10
          })
        }, 100)
      }
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
      disabled: disabled || isUploading,
    })

  const handleRemove = () => {
    setUploadProgress(0)
    setIsUploading(false)
    if (onFileRemove) {
      onFileRemove()
    }
  }

  // Get file extension icon
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return <File className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get validation error from react-dropzone
  const dropzoneError =
    fileRejections.length > 0 ? fileRejections[0].errors[0].message : null

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Zone (when no file) */}
      {!value && !isUploading && (
        <div
          {...getRootProps()}
          className={cn(
            'flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 p-8 transition-all duration-200',
            isDragActive
              ? 'border-primary border-solid bg-primary/5 shadow-[0_0_0_4px_rgba(0,102,255,0.1)]'
              : 'border-gray-400 hover:scale-[1.02] hover:border-primary hover:bg-primary/5',
            error && 'border-destructive bg-destructive/5',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} aria-label="Upload resume" />

          {/* Upload Icon */}
          <Upload className="mb-3 h-12 w-12 text-gray-600" />

          {/* Text */}
          <p className="mb-1 text-base font-medium text-gray-900">
            {isDragActive ? 'Drop file here' : 'Drag & drop your resume'}
          </p>
          <p className="mb-3 text-center text-sm text-gray-600">
            or click to browse
          </p>

          {/* Browse Button */}
          <Button variant="ghost" size="sm" type="button">
            Browse Files
          </Button>

          {/* File Requirements */}
          <p
            id="file-requirements"
            className="mt-4 text-xs text-gray-500"
          >
            PDF, DOC, DOCX - Max 5MB
          </p>
        </div>
      )}

      {/* File Preview (when file selected) */}
      {value && !isUploading && (
        <div className="rounded-lg border border-gray-300 bg-white p-3">
          <div className="flex items-center gap-3">
            {/* File Icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              {getFileIcon(value.name)}
            </div>

            {/* File Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {value.name}
              </p>
              <p className="text-xs text-gray-600">
                {formatFileSize(value.size)}
              </p>
            </div>

            {/* Success Icon */}
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="rounded-lg border border-gray-300 bg-white p-3">
          <div className="flex items-center gap-3">
            {/* File Icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Upload className="h-5 w-5 animate-pulse" />
            </div>

            {/* File Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Uploading...
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>

            {/* Progress Percentage */}
            <span className="text-sm font-medium text-gray-600">
              {uploadProgress}%
            </span>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {(error || dropzoneError) && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error || dropzoneError}</p>
        </div>
      )}
    </div>
  )
}
