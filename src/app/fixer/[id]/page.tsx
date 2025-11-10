// src/app/fixer/[id]/page.tsx
import { notFound } from "next/navigation"
import { mockFixers } from "@/app/lib/mock-data"
import { FixerProfileContent } from "./FixerProfileContent"

export default function FixerProfile({ params }: { params: { id: string } }) {
  const fixer = mockFixers.find(f => f.id === params.id)
  if (!fixer) notFound()

  return <FixerProfileContent fixer={fixer} />
} 


