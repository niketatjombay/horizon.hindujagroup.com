'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { User, Loader2 } from 'lucide-react'
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
import { FormField } from '@/components/shared/form-field'
import type { UserWithCompany, UserFormData, UserStatus } from '@/lib/hooks/use-users-admin'
import type { UserRole } from '@/types'
import { USER_DEPARTMENTS, USER_ROLES, getCompaniesForDropdown } from '@/mock/services/users-admin'

interface UserFormModalProps {
  user?: UserWithCompany | null
  open: boolean
  onClose: () => void
  onSubmit: (data: UserFormData) => Promise<void>
  isSubmitting?: boolean
}

const userSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number')
      .optional()
      .or(z.literal('')),
    role: z.enum(['employee', 'hr', 'chro', 'admin']),
    companyId: z.string().optional(),
    department: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .optional()
      .or(z.literal('')),
    status: z.enum(['active', 'inactive']),
  })
  .refine(
    (data) => data.role === 'admin' || (data.companyId && data.companyId.length > 0),
    {
      message: 'Company is required for non-admin users',
      path: ['companyId'],
    }
  )

type FormErrors = Partial<Record<keyof UserFormData, string>>

const initialFormState: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'employee',
  companyId: '',
  department: '',
  password: '',
  status: 'active',
}

export function UserFormModal({
  user,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const isEditing = !!user

  const companies = getCompaniesForDropdown()

  // Reset form when opening or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          companyId: user.companyId || '',
          department: user.department || '',
          password: '',
          status: user.status,
        })
      } else {
        setFormData(initialFormState)
      }
      setErrors({})
    }
  }, [open, user])

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Clear company/department errors when role changes to admin
    if (field === 'role' && value === 'admin') {
      setErrors((prev) => ({ ...prev, companyId: undefined, department: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // For editing, password is optional - remove it if empty
    const dataToValidate = { ...formData }
    if (isEditing && !formData.password) {
      delete dataToValidate.password
    }

    // Validate form
    const result = userSchema.safeParse(dataToValidate)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UserFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    // Remove password if empty on edit
    const submitData = { ...formData }
    if (isEditing && !submitData.password) {
      delete submitData.password
    }

    await onSubmit(submitData)
  }

  const showCompanyAndDepartment = formData.role !== 'admin'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-400" />
            {isEditing ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-0 py-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              htmlFor="firstName"
              required
              error={errors.firstName}
            >
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </FormField>

            <FormField
              label="Last Name"
              htmlFor="lastName"
              required
              error={errors.lastName}
            >
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Enter last name"
              />
            </FormField>
          </div>

          {/* Email */}
          <FormField label="Email" htmlFor="email" required error={errors.email}>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="user@company.com"
              disabled={isEditing}
            />
          </FormField>

          {/* Phone */}
          <FormField label="Phone" htmlFor="phone" error={errors.phone}>
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 9876543210"
            />
          </FormField>

          {/* Role */}
          <FormField label="Role" htmlFor="role" required error={errors.role}>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Company (hidden for admin) */}
          {showCompanyAndDepartment && (
            <FormField
              label="Company"
              htmlFor="companyId"
              required
              error={errors.companyId}
            >
              <Select
                value={formData.companyId}
                onValueChange={(value) => handleChange('companyId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          {/* Department (hidden for admin) */}
          {showCompanyAndDepartment && (
            <FormField
              label="Department"
              htmlFor="department"
              error={errors.department}
            >
              <Select
                value={formData.department}
                onValueChange={(value) => handleChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {USER_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          {/* Password */}
          <FormField
            label={isEditing ? 'New Password (optional)' : 'Password'}
            htmlFor="password"
            required={!isEditing}
            error={errors.password}
            description="Minimum 8 characters, must include uppercase letter and number"
          >
            <Input
              type="password"
              value={formData.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={isEditing ? 'Leave blank to keep current' : 'Enter password'}
            />
          </FormField>

          {/* Status Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Active Status
              </Label>
              <p className="text-xs text-gray-600 mt-0.5">
                Inactive users cannot log in to the platform
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
            {isEditing ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
