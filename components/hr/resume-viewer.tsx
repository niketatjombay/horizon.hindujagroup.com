'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Download, ExternalLink, FileX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeViewerProps {
  resumeUrl?: string
  fileName?: string
  fileSize?: string
  className?: string
}

export function ResumeViewer({
  resumeUrl,
  fileName,
  fileSize,
  className,
}: ResumeViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // No resume state
  if (!resumeUrl) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileX className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Resume Uploaded
          </h3>
          <p className="text-sm text-gray-500">
            The applicant has not uploaded a resume
          </p>
        </div>
      </Card>
    )
  }

  // Check if it's a PDF (can be displayed inline)
  const isPDF = resumeUrl.toLowerCase().endsWith('.pdf')
  const displayName = fileName || resumeUrl.split('/').pop() || 'Resume'

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-red-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {displayName}
            </p>
            {fileSize && (
              <p className="text-xs text-gray-500">{fileSize}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => window.open(resumeUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Open</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={resumeUrl} download={displayName}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Preview */}
      {isPDF ? (
        <div className="relative">
          {/* Toggle for expanding/collapsing preview */}
          <div
            className={cn(
              'transition-all duration-300 overflow-hidden',
              isExpanded ? 'h-[600px]' : 'h-[300px]'
            )}
          >
            <iframe
              src={`${resumeUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title="Resume Preview"
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-sm text-primary hover:bg-gray-50 transition-colors border-t border-gray-200"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      ) : (
        /* Non-PDF file message */
        <div className="p-6 text-center">
          <p className="text-gray-600">
            Preview not available for this file type.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Please download the file to view it.
          </p>
        </div>
      )}
    </Card>
  )
}
