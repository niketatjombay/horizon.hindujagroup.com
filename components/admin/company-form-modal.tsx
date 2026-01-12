'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { Building2, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/shared/form-field'
import type { CompanyWithStats, CompanyFormData } from '@/lib/hooks/use-companies-admin'
import { COMPANY_INDUSTRIES } from '@/mock/services/companies-admin'

interface CompanyFormModalProps {
  company?: CompanyWithStats | null
  open: boolean
  onClose: () => void
  onSubmit: (data: CompanyFormData) => Promise<void>
  isSubmitting?: boolean
}

const companySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  industry: z.string().min(1, 'Industry is required'),
  website: z
    .string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  headquarters: z.string().min(2, 'Headquarters is required'),
  employeeCount: z.number().positive('Must be a positive number').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  status: z.enum(['active', 'inactive']),
})

type FormErrors = Partial<Record<keyof CompanyFormData, string>>

const initialFormState: CompanyFormData = {
  name: '',
  industry: '',
  website: '',
  headquarters: '',
  employeeCount: undefined,
  description: '',
  status: 'active',
}

export function CompanyFormModal({
  company,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CompanyFormModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const isEditing = !!company

  // Reset form when opening or company changes
  useEffect(() => {
    if (open) {
      if (company) {
        setFormData({
          name: company.name,
          industry: company.industry,
          website: '',
          headquarters: company.location,
          employeeCount: undefined,
          description: company.description,
          status: company.status,
        })
      } else {
        setFormData(initialFormState)
      }
      setErrors({})
    }
  }, [open, company])

  const handleChange = (field: keyof CompanyFormData, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const result = companySchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CompanyFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            {isEditing ? 'Edit Company' : 'Add New Company'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-0 py-4">
          {/* Company Name */}
          <FormField label="Company Name" htmlFor="name" required error={errors.name}>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter company name"
            />
          </FormField>

          {/* Industry */}
          <FormField label="Industry" htmlFor="industry" required error={errors.industry}>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleChange('industry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Headquarters */}
          <FormField
            label="Headquarters"
            htmlFor="headquarters"
            required
            error={errors.headquarters}
          >
            <Input
              value={formData.headquarters}
              onChange={(e) => handleChange('headquarters', e.target.value)}
              placeholder="e.g., Mumbai, Chennai"
            />
          </FormField>

          {/* Website (optional) */}
          <FormField label="Website" htmlFor="website" error={errors.website}>
            <Input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </FormField>

          {/* Employee Count (optional) */}
          <FormField
            label="Employee Count"
            htmlFor="employeeCount"
            error={errors.employeeCount}
          >
            <Input
              type="number"
              value={formData.employeeCount || ''}
              onChange={(e) =>
                handleChange(
                  'employeeCount',
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              placeholder="e.g., 5000"
              min={1}
            />
          </FormField>

          {/* Description (optional) */}
          <FormField
            label="Description"
            htmlFor="description"
            error={errors.description}
            description="Maximum 500 characters"
          >
            <Textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the company..."
              rows={3}
              maxLength={500}
            />
          </FormField>

          {/* Status Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Active Status
              </Label>
              <p className="text-xs text-gray-600 mt-0.5">
                Inactive companies won&apos;t appear in job listings
              </p>
            </div>
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) =>
                handleChange('status', checked ? 'active' : 'inactive')
              }
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Add Company'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
