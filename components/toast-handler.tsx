'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

export function ToastHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const error = searchParams.get('error')
    const success = searchParams.get('success')

    if (error) {
      toast.error(error)
      router.replace(pathname) 
    }
    
    if (success) {
      toast.success(success)
      router.replace(pathname)
    }
  }, [searchParams, pathname, router])

  return null
}