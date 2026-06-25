import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

/**
 * Format angka ke Rupiah: 1500000 → "Rp 1.500.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format tanggal ke relative time: "3 hari lalu", "kemarin"
 */
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: id,
  })
}

/**
 * Format tanggal ke format Indonesia: "25 Juni 2026"
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
