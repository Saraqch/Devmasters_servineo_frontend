const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/devmaster/jobs`;

export async function getJobs() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener los trabajos');
  return res.json();
}
