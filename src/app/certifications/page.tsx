"use client";

import { createClient } from '@/app/utils/supabase/client.ts'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

// FIX 1: Removed 'user' from the form data interface.
// The user ID is fetched from the session, not entered in the form.
interface CertificationFormData {
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CertificationFormData>({
    certificate_number: '',
    main_skill: '',
    secondary_skill: '',
    certification_name: '',
    issued_at: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [certificationFile, setCertificationFile] = useState<File | null>(null);

  const handleInputChange = (
    field: keyof CertificationFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCertificationFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      if (!certificationFile) {
        throw new Error(t("certifications.messages.pleaseSelectFile"));
      }

      const supabase = createClient();
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !data.session) {
        throw new Error('Could not get user session. Please log in again.');
      }

      const userId = data.session.user.id;
      const fileUrl = `placeholder/path/${certificationFile.name}`; // Replace with actual file upload logic

      // FIX 2: Correctly added userId to the submission object with a 'user' key.
      const submissionData = {
        ...formData,
        user: userId,
        certification_file: fileUrl,
      };

      const response = await fetch("/api/addCertifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(
          result.details ??
            result.error ??
            t("certifications.messages.submitError"),
        );
      }

      setSubmissionStatus({ type: 'success', message: 'Certification added successfully!' })
      
      // Reset form
      setFormData({
        certificate_number: '',
        main_skill: '',
        secondary_skill: '',
        certification_name: '',
        issued_at: '',
      })
      setCertificationFile(null)
      const fileInput = document.getElementById('certification_file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: unknown) {
      console.error('Submission error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setSubmissionStatus({ type: 'error', message: errorMessage })
    } finally {
      setIsSubmitting(false);
    }
  };

  // FIX 3: Updated validation logic to remove the check for 'user'.
  const isFormValid = () => {
    return (
      formData.main_skill.trim() !== '' &&
      formData.certification_name.trim() !== '' &&
      formData.issued_at !== '' &&
      certificationFile !== null
    );
  };

  const getDateInputValue = () => {
    if (!formData.issued_at) return "";
    try {
      return new Date(formData.issued_at).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {t("certifications.addCertification")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <Label
                htmlFor="certification_name"
                className="text-sm font-medium"
              >
                {t("certifications.form.certificationName")}{" "}
                {t("certifications.form.required")}
              </Label>
              <Input
                id="certification_name"
                type="text"
                value={formData.certification_name}
                onChange={(e) =>
                  handleInputChange("certification_name", e.target.value)
                }
                placeholder={t(
                  "certifications.form.certificationNamePlaceholder",
                )}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main_skill" className="text-sm font-medium">
                {t("certifications.form.mainSkill")}{" "}
                {t("certifications.form.required")}
              </Label>
              <Input
                id="main_skill"
                type="text"
                value={formData.main_skill}
                onChange={(e) =>
                  handleInputChange("main_skill", e.target.value)
                }
                placeholder={t("certifications.form.mainSkillPlaceholder")}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_skill" className="text-sm font-medium">
                {t("certifications.form.secondarySkill")}
              </Label>
              <Input
                id="secondary_skill"
                type="text"
                value={formData.secondary_skill}
                onChange={(e) =>
                  handleInputChange("secondary_skill", e.target.value)
                }
                placeholder={t("certifications.form.secondarySkillPlaceholder")}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="certificate_number"
                className="text-sm font-medium"
              >
                {t("certifications.form.certificateNumber")}
              </Label>
              <Input
                id="certificate_number"
                type="text"
                value={formData.certificate_number}
                onChange={(e) =>
                  handleInputChange("certificate_number", e.target.value)
                }
                placeholder={t(
                  "certifications.form.certificateNumberPlaceholder",
                )}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issued_at" className="text-sm font-medium">
                {t("certifications.form.issueDate")}{" "}
                {t("certifications.form.required")}
              </Label>
              <div className="relative">
                <Input
                  id="issued_at"
                  type="date"
                  value={getDateInputValue()}
                  onChange={(e) =>
                    handleInputChange("issued_at", e.target.value)
                  }
                  required
                  className="w-full pr-10"
                />
                <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("certifications.form.certificationFile")}{" "}
                {t("certifications.form.required")}
              </Label>
              <Input
                id="certification_file"
                type="file"
                onChange={handleFileChange}
                className="w-full file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-muted-foreground text-xs">
                {t("certifications.form.fileFormats")}
              </p>
            </div>

            {submissionStatus && (
              <div
                className={`flex items-center gap-2 rounded-md p-3 text-sm ${submissionStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {submissionStatus.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <p>{submissionStatus.message}</p>
              </div>
            )}

            <div className="pt-4">
              {/* FIX 4: Added the disabled prop to connect the button's state to the form's validity. */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : ('Submit Certification')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
