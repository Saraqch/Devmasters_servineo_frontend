import { notFound } from "next/navigation"
import { mockFixers } from "@/app/lib/mock-data"
import { FixerProfileContent } from "./FixerProfileContent"

export default function AboutFixerProfile({ params }: { params: { id: string } }) {
  const fixer = mockFixers.find((f) => f.id === params.id)

  if (!fixer) {
    console.error("❌ Fixer no encontrado:", params.id)
    notFound()
  }

  console.log("🔍 Buscando fixer con ID:", params.id)
  console.log(
    "📋 Fixers disponibles:",
    mockFixers.map((f) => ({ id: f.id, name: f.name })),
  )
  console.log("✅ Fixer encontrado:", fixer.name)

  return <FixerProfileContent fixer={fixer} />
}

export async function generateStaticParams() {
  return mockFixers.map((fixer) => ({
    id: fixer.id,
  }))
}
