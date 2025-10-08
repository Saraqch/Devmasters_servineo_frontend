export async function fetchServicios({ name = "", context = "" }) {
  const url = `http://localhost:3000/api/devmaster/servicios?name=${encodeURIComponent(name)}&context=${encodeURIComponent(context)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener servicios");
  return response.json();
}