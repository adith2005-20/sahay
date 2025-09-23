'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

interface CertificationFormData {
  user: string;
  certificate_number: string
  main_skill: string
  secondary_skill: string
  certification_name: string
  issued_at: string
}

// Define the shape of the certification data returned by the API
interface Certification {
  id: string;
  wallet: string;
  certificate_number: string | null;
  main_skill: string;
  secondary_skill: string | null;
  certification_name: string;
  certification_file: string | null;
  issued_at: string;
  created_at: string;
}

// Define a type for the expected API response to fix unsafe assignment errors
interface ApiResponse {
  details?: string;
  error?: string;
  message?: string;
  data?: Certification;
}

export default function CertificationPage() {
  const [formData, setFormData] = useState<CertificationFormData>({
    user: '',
    certificate_number: '',
    main_skill: '',
    secondary_skill: '',
    certification_name: '',
    issued_at: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null)
  
  const [certificationFile, setCertificationFile] = useState<File | null>(null)

  const handleInputChange = (field: keyof CertificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCertificationFile(file);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus(null)

    try {
      if (!certificationFile) {
        throw new Error('Please select a certification file to upload.')
      }
      
      const fileUrl = `placeholder/path/${certificationFile.name}`;

      const submissionData = {
        ...formData,
        certification_file: fileUrl,
      };
      
      const response = await fetch('/api/addCertifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json() as ApiResponse;

      if (!response.ok) {
        throw new Error(result.details ?? result.error ?? 'An unknown error occurred.');
      }

      setSubmissionStatus({ type: 'success', message: 'Certification added successfully!' })
      
      setFormData({
        user: '',
        certificate_number: '',
        main_skill: '',
        secondary_skill: '',
        certification_name: '',
        issued_at: '',
      })
      setCertificationFile(null)
      const fileInput = document.getElementById('certification_file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: unknown) { // Use 'unknown' instead of 'any'
      console.error('Submission error:', error)
      // Use a type guard to safely access the error message
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setSubmissionStatus({ type: 'error', message: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.user.trim() !== '' &&
      formData.main_skill.trim() !== '' &&
      formData.certification_name.trim() !== '' &&
      formData.issued_at !== '' &&
      certificationFile !== null
    )
  }

  const getDateInputValue = () => {
    if (!formData.issued_at) return ''
    try {
      return new Date(formData.issued_at).toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add Certification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm font-medium">User ID *</Label>
              <Input id="user" type="text" value={formData.user} onChange={(e) => handleInputChange('user', e.target.value)} placeholder="Enter your User ID (for testing)" required className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certification_name" className="text-sm font-medium">Certification Name *</Label>
              <Input id="certification_name" type="text" value={formData.certification_name} onChange={(e) => handleInputChange('certification_name', e.target.value)} placeholder="e.g., Certified JavaScript Developer" required className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main_skill" className="text-sm font-medium">Main Skill *</Label>
              <Input id="main_skill" type="text" value={formData.main_skill} onChange={(e) => handleInputChange('main_skill', e.target.value)} placeholder="e.g., JavaScript" required className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_skill" className="text-sm font-medium">Secondary Skill</Label>
              <Input id="secondary_skill" type="text" value={formData.secondary_skill} onChange={(e) => handleInputChange('secondary_skill', e.target.value)} placeholder="e.g., React (Optional)" className="w-full" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificate_number" className="text-sm font-medium">Certificate Number or ID</Label>
              <Input id="certificate_number" type="text" value={formData.certificate_number} onChange={(e) => handleInputChange('certificate_number', e.target.value)} placeholder="Enter certificate number (Optional)" className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issued_at" className="text-sm font-medium">Issue Date *</Label>
              <div className="relative">
                <Input id="issued_at" type="date" value={getDateInputValue()} onChange={(e) => handleInputChange('issued_at', e.target.value)} required className="w-full pr-10" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Certification File *</Label>
              <Input id="certification_file" type="file" onChange={handleFileChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <p className="text-xs text-muted-foreground">Accepted formats: PDF, PNG, JPG (Max 10MB)</p>
            </div>

            {submissionStatus && (
              <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${submissionStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submissionStatus.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <p>{submissionStatus.message}</p>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={!isFormValid() || isSubmitting} size="lg">
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : ('Submit Certification')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


