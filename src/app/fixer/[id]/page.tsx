import { notFound } from 'next/navigation';
import { mockFixers } from '@/app/lib/mock-data';
import { FixerProfileContent } from './FixerProfileContent';

interface FixerProfileProps {
  params: Promise<{ id: string }>;
}

export default async function FixerProfile({ params }: FixerProfileProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  console.log('🔍 Buscando fixer con ID:', id);
  console.log(
    '📋 Fixers disponibles:',
    mockFixers.map((f) => ({ id: f.id, name: f.name })),
  );

  const fixer = mockFixers.find((f) => f.id === id);

  if (!fixer) {
    console.error('❌ Fixer no encontrado:', id);
    notFound();
  }

  console.log('✅ Fixer encontrado:', fixer.name);
  return <FixerProfileContent fixer={fixer} />;
}

export async function generateStaticParams() {
  return mockFixers.map((fixer) => ({
    id: fixer.id,
  }));
}
