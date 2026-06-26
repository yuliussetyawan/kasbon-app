'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  children: React.ReactNode
  loadingText?: string
  className?: string
}

export function SubmitButton({ children, loadingText = 'Memproses...', className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className={className}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
