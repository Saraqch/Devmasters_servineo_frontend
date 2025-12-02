import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns" 
import { es } from "date-fns/locale" 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export { formatDistanceToNow } 
export function formatTimeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}