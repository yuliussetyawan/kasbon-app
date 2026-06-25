export function getCasualErrorMessage(message: string) {
  switch (message) {
    case 'Invalid login credentials':
      return 'Email atau password salah nih. Coba cek lagi ya.'
    case 'User already registered':
      return 'Email ini udah pernah didaftarin. Langsung login aja.'
    case 'Password should be at least 6 characters.':
    case 'Password should be at least 6 characters':
      return 'Password kependekan, minimal 6 karakter ya.'
    case 'Signups not allowed for this instance':
      return 'Pendaftaran user baru lagi ditutup nih.'
    case 'Email not confirmed':
      return 'Email belum dikonfirmasi, cek inbox kamu ya.'
    default:
      return 'Waduh, ada error nih. Coba sebentar lagi ya.'
  }
}