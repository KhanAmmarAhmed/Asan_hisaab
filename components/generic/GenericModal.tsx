'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'

export interface FieldDef {
  id: string
  label: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date'
  placeholder?: string
  required?: boolean
  options?: string[]
  rows?: number
}

export interface GenericModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fields: FieldDef[]
  onSubmit: (formData: Record<string, string>) => void
  submitButtonLabel?: string
  onAddFile?: () => void
  showAddFileButton?: boolean
}

export default function GenericModal({
  open,
  onOpenChange,
  title,
  fields,
  onSubmit,
  submitButtonLabel = 'Save',
  onAddFile,
  showAddFileButton = true,
}: GenericModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    setFormData({})
    setErrors({})
    onOpenChange(false)
  }

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1B0D3F]">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => {
              if (field.type === 'textarea') {
                return (
                  <div key={field.id} className="col-span-2">
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Textarea
                      value={formData[field.id] || ''}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                      className={`border rounded-lg p-2 w-full ${
                        errors[field.id]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors[field.id] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.id]}
                      </p>
                    )}
                  </div>
                )
              }

              if (field.type === 'select') {
                return (
                  <div key={field.id}>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      className={`w-full border rounded-lg p-2 ${
                        errors[field.id]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    >
                      <option value="">{field.placeholder || `Select ${field.label}`}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors[field.id] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.id]}
                      </p>
                    )}
                  </div>
                )
              }

              return (
                <div key={field.id}>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className={`border rounded-lg ${
                      errors[field.id]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors[field.id] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {showAddFileButton && (
            <button
              type="button"
              onClick={onAddFile}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B0D3F] text-white font-semibold hover:bg-[#2D1B69] transition-colors"
            >
              <Plus size={18} />
              Add File
            </button>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1B0D3F] hover:bg-[#2D1B69] text-white font-semibold"
            >
              {submitButtonLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
