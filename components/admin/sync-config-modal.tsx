'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { Settings2, Loader2, CheckCircle, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/shared/form-field'
import type {
  SyncConfig,
  SyncFrequency,
  SyncStrategy,
} from '@/lib/hooks/use-sync-admin'
import { SYNC_DATA_SOURCES, SYNC_FREQUENCIES } from '@/mock/services/sync-admin'

interface SyncConfigModalProps {
  config: SyncConfig | null
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<SyncConfig>) => Promise<void>
  onTestConnection: () => Promise<{ success: boolean; message: string; latency?: number }>
  isSubmitting?: boolean
}

const syncConfigSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(['manual', 'hourly', '6hours', '12hours', 'daily']),
  scheduledTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Invalid time format')
    .optional(),
  dataSources: z.array(z.string()).min(1, 'Select at least one data source'),
  strategy: z.enum(['full', 'incremental']),
  apiEndpoint: z.string().url('Invalid endpoint URL'),
  timeout: z.number().min(30, 'Minimum 30 seconds').max(300, 'Maximum 300 seconds'),
})

type FormErrors = Partial<Record<keyof SyncConfig, string>>

export function SyncConfigModal({
  config,
  open,
  onClose,
  onSubmit,
  onTestConnection,
  isSubmitting = false,
}: SyncConfigModalProps) {
  const [formData, setFormData] = useState<Partial<SyncConfig>>({
    enabled: true,
    frequency: 'daily',
    scheduledTime: '02:00',
    dataSources: ['Employees', 'Jobs', 'Applications'],
    strategy: 'incremental',
    apiEndpoint: '',
    timeout: 120,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    latency?: number
  } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  // Reset form when opening or config changes
  useEffect(() => {
    if (open && config) {
      setFormData({
        enabled: config.enabled,
        frequency: config.frequency,
        scheduledTime: config.scheduledTime || '02:00',
        dataSources: config.dataSources,
        strategy: config.strategy,
        apiEndpoint: config.apiEndpoint,
        timeout: config.timeout,
      })
      setErrors({})
      setTestResult(null)
    }
  }, [open, config])

  const handleChange = (field: keyof SyncConfig, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts editing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    // Clear test result when endpoint changes
    if (field === 'apiEndpoint') {
      setTestResult(null)
    }
  }

  const handleDataSourceToggle = (source: string, checked: boolean) => {
    const current = formData.dataSources || []
    const updated = checked
      ? [...current, source]
      : current.filter((s) => s !== source)
    handleChange('dataSources', updated)
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      const result = await onTestConnection()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed',
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const result = syncConfigSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SyncConfig
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    await onSubmit(formData)
  }

  const showScheduledTime = formData.frequency === 'daily'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-gray-400" />
            Sync Configuration - {config?.companyName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Enabled Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <Label htmlFor="enabled" className="text-sm font-medium">
                Enable Sync
              </Label>
              <p className="text-xs text-gray-600 mt-0.5">
                When disabled, no automatic syncs will run
              </p>
            </div>
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => handleChange('enabled', checked)}
            />
          </div>

          {/* Schedule Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Schedule</h3>

            <FormField label="Frequency" htmlFor="frequency" error={errors.frequency}>
              <Select
                value={formData.frequency}
                onValueChange={(value) => handleChange('frequency', value as SyncFrequency)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {SYNC_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {showScheduledTime && (
              <FormField
                label="Scheduled Time"
                htmlFor="scheduledTime"
                error={errors.scheduledTime}
                description="Time is in server timezone (IST)"
              >
                <Input
                  type="time"
                  value={formData.scheduledTime || '02:00'}
                  onChange={(e) => handleChange('scheduledTime', e.target.value)}
                />
              </FormField>
            )}
          </div>

          {/* Data Sources Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Data Sources</h3>
            {errors.dataSources && (
              <p className="text-xs text-destructive">{errors.dataSources}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {SYNC_DATA_SOURCES.map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={formData.dataSources?.includes(source)}
                    onCheckedChange={(checked) =>
                      handleDataSourceToggle(source, checked as boolean)
                    }
                  />
                  {source}
                </label>
              ))}
            </div>
          </div>

          {/* Strategy Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Sync Strategy</h3>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  value="incremental"
                  checked={formData.strategy === 'incremental'}
                  onChange={() => handleChange('strategy', 'incremental' as SyncStrategy)}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium">Incremental</span>
                  <p className="text-xs text-gray-600">
                    Only sync changes since last sync
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  value="full"
                  checked={formData.strategy === 'full'}
                  onChange={() => handleChange('strategy', 'full' as SyncStrategy)}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium">Full</span>
                  <p className="text-xs text-gray-600">
                    Sync all records every time
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* API Settings Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">API Settings</h3>

            <FormField
              label="API Endpoint"
              htmlFor="apiEndpoint"
              required
              error={errors.apiEndpoint}
            >
              <Input
                value={formData.apiEndpoint || ''}
                onChange={(e) => handleChange('apiEndpoint', e.target.value)}
                placeholder="https://api.company.com/v1/sync"
              />
            </FormField>

            <FormField
              label="Timeout (seconds)"
              htmlFor="timeout"
              error={errors.timeout}
            >
              <Input
                type="number"
                value={formData.timeout || 120}
                onChange={(e) =>
                  handleChange('timeout', parseInt(e.target.value, 10) || 120)
                }
                min={30}
                max={300}
              />
            </FormField>

            {/* Test Connection */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestConnection}
                disabled={isTesting || !formData.apiEndpoint}
              >
                {isTesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Test Connection
              </Button>

              {testResult && (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    testResult.success ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>{testResult.message}</span>
                  {testResult.latency && (
                    <span className="text-gray-500">({testResult.latency}ms)</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
