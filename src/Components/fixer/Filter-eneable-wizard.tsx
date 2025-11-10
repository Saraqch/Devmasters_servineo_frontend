"use client"

import { useState } from "react"
import { StepIndicator } from "./Step-indicator"
import { Card } from "../Card"
import { PillButton } from "./Pill-button"
import { CIStep } from "./steps/Ci-step"
import { LocationStep } from "./steps/Location-step"
import { ServicesStep, type Service } from "./steps/Services-step"
import { PaymentStep, type PaymentMethod } from "./steps/Payment-step";
import { ExperienceStep, type Experience } from "./steps/Experience-step"
import { VehicleStep } from "./steps/Vehicle-step"
import { TermsStep } from "./steps/Terms-step"
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { ProfilePhotoStep } from "./steps/Profile-photo-step"

type RequesterUser = {
  id: string
  name: string
  email: string
  urlPhoto?: string
  role: "requester" | "fixer"
}

type FixerProfileDraft = {
  ci: string
  location?: { lat: number; lng: number } | null
  services: Service[]
  selectedServiceIds: string[]
  payments: PaymentMethod[]
  accountInfo?: string
  experiences: Experience[]
  hasVehicle: boolean | null
  vehicleType?: string
  termsAccepted: boolean
  photoUrl?: string
}

const DEFAULT_SERVICES: Service[] = [
  { id: "svc-plumbing", name: "Plomería" },
  { id: "svc-electric", name: "Electricidad" },
  { id: "svc-carpentry", name: "Carpintería" },
  { id: "svc-paint", name: "Pintura" },
]

const MOCK_TAKEN_CIS = new Set(["1234567", "ABC-890", "9001002"])

interface FixerEnableWizardProps {
  user: RequesterUser
}

export function FixerEnableWizard({ user }: FixerEnableWizardProps) {
  const [step, setStep] = useState(0)
  const total = 8
  const [draft, setDraft] = useState<FixerProfileDraft>({
    ci: "",
    location: null,
    services: DEFAULT_SERVICES.map((s) => ({ id: s.id, name: s.name })),
    selectedServiceIds: [],
    payments: [],
    accountInfo: "",
    experiences: [],
    hasVehicle: null,
    vehicleType: "",
    termsAccepted: false,
    photoUrl: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function validateStep() {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!draft.photoUrl) e.photo = "Debe subir una foto de perfil"
    }
    if (step === 1) {
      if (!draft.ci.trim()) e.ci = "CI es requerido"
      else if (!/^[0-9-]+$/.test(draft.ci.trim())) e.ci = "CI debe contener solo números y guiones"
      else if (draft.ci && MOCK_TAKEN_CIS.has(draft.ci.trim())) e.ci = "Este CI ya está registrado"
    }
    if (step === 2) {
      if (!draft.location) e.location = "Debe seleccionar una ubicación"
    }
    if (step === 3) {
      if (draft.selectedServiceIds.length === 0) e.services = "Seleccione al menos un servicio"
    }
    if (step === 4) {
      if (draft.payments.length === 0) e.payments = "Seleccione al menos un método de pago"
      const needsAccount = draft.payments.includes("qr") || draft.payments.includes("card")
      if (needsAccount && !draft.accountInfo?.trim()) e.accountInfo = "Ingrese la cuenta para pagos"
    }
    if (step === 6) {
      if (draft.hasVehicle === null) e.vehicle = "Debe indicar si cuenta con vehículo"
      if (draft.hasVehicle === true && !draft.vehicleType) e.vehicleType = "Seleccione el tipo de vehículo"
    }
    if (step === 7) {
      if (!draft.termsAccepted) e.terms = "Debe aceptar los términos y condiciones"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function goNext() {
    if (validateStep()) setStep((s) => Math.min(total - 1, s + 1))
  }
  function goPrev() {
    setStep((s) => Math.max(0, s - 1))
  }

  function toggleService(id: string) {
    setDraft((d) => ({
      ...d,
      selectedServiceIds: d.selectedServiceIds.includes(id)
        ? d.selectedServiceIds.filter((x) => x !== id)
        : [...d.selectedServiceIds, id],
    }))
  }

  function addCustomService(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = `custom-${Date.now()}`
    setDraft((d) => ({
      ...d,
      services: [...d.services, { id, name: trimmed, custom: true }],
      selectedServiceIds: [...d.selectedServiceIds, id],
    }))
  }

  function editService(id: string, name: string) {
    setDraft((d) => ({
      ...d,
      services: d.services.map((s) => (s.id === id ? { ...s, name } : s)),
    }))
  }

  function deleteService(id: string) {
    setDraft((d) => ({
      ...d,
      services: d.services.filter((s) => s.id !== id),
      selectedServiceIds: d.selectedServiceIds.filter((x) => x !== id),
    }))
  }

  async function handleSubmit() {
    if (!validateStep()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    setSuccess(true)
  }

  function addExperience(experience: Omit<Experience, "id">) {
    const id = `exp-${Date.now()}`
    setDraft((d) => ({
      ...d,
      experiences: [...d.experiences, { ...experience, id }],
    }))
  }

  function deleteExperience(id: string) {
    setDraft((d) => ({
      ...d,
      experiences: d.experiences.filter((exp) => exp.id !== id),
    }))
  }

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in">
      <StepIndicator step={step} total={total} />
      {success ? (
        <Card title="¡Listo!">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 animate-scale-in" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{user.name} ahora está habilitado como FIXER.</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>CI: {draft.ci}</p>
              <p>
                Ubicación: {draft.location?.lat.toFixed(5)}, {draft.location?.lng.toFixed(5)}
              </p>
              <p>Servicios: {draft.selectedServiceIds.length}</p>
              <p>Métodos de pago: {draft.payments.join(", ")}</p>
              <p>Experiencias: {draft.experiences.length}</p>
              <p>Vehículo: {draft.hasVehicle ? `Sí (${draft.vehicleType})` : "No"}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {step === 0 && (
            <ProfilePhotoStep
              photoUrl={draft.photoUrl}
              onPhotoChange={(photoUrl) => setDraft((d) => ({ ...d, photoUrl }))}
              error={errors.photo}
            />
          )}

          {step === 1 && (
            <CIStep ci={draft.ci} onCIChange={(ci) => setDraft((d) => ({ ...d, ci }))} error={errors.ci} />
          )}

          {step === 2 && (
            <LocationStep
              location={draft.location || null}
              onLocationChange={(location) => setDraft((d) => ({ ...d, location }))}
              error={errors.location}
            />
          )}

          {step === 3 && (
            <ServicesStep
              services={draft.services}
              selectedServiceIds={draft.selectedServiceIds}
              onToggleService={toggleService}
              onAddCustomService={addCustomService}
              onEditService={editService}
              onDeleteService={deleteService}
              error={errors.services}
            />
          )}

          {step === 4 && (
            <PaymentStep
              payments={draft.payments}
              accountInfo={draft.accountInfo || ""}
              onTogglePayment={(method) =>
                setDraft((d) => ({
                  ...d,
                  payments: d.payments.includes(method)
                    ? d.payments.filter((x) => x !== method)
                    : [...d.payments, method],
                }))
              }
              onAccountInfoChange={(accountInfo) => setDraft((d) => ({ ...d, accountInfo }))}
              paymentsError={errors.payments}
              accountError={errors.accountInfo}
            />
          )}

          {step === 5 && (
            <ExperienceStep
              experiences={draft.experiences}
              onAddExperience={addExperience}
              onDeleteExperience={deleteExperience}
              error={errors.experiences}
            />
          )}

          {step === 6 && (
            <VehicleStep
              hasVehicle={draft.hasVehicle}
              vehicleType={draft.vehicleType}
              onHasVehicleChange={(hasVehicle) => setDraft((d) => ({ ...d, hasVehicle }))}
              onVehicleTypeChange={(vehicleType) => setDraft((d) => ({ ...d, vehicleType }))}
              error={errors.vehicle || errors.vehicleType}
            />
          )}

          {step === 7 && (
            <TermsStep
              accepted={draft.termsAccepted}
              onAcceptChange={(termsAccepted) => setDraft((d) => ({ ...d, termsAccepted }))}
              error={errors.terms}
            />
          )}

          <div className="flex items-center justify-between">
            <PillButton
              type="button"
              disabled={step === 0}
              onClick={goPrev}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </PillButton>
            {step < 7 ? (
              <PillButton
                type="button"
                onClick={goNext}
                className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </PillButton>
            ) : (
              <PillButton
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary text-white hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? "Guardando..." : "Finalizar"}
                <CheckCircle2 className="h-4 w-4" />
              </PillButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
