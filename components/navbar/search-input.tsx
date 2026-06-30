'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebouncedCallback } from '@/hooks/use-debounce'

interface SearchInputProps {
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({
  onChange,
  placeholder = 'Cari nama...',
}: SearchInputProps) {
  const [value, setValue] = useState('')
  const debouncedOnChange = useDebouncedCallback(onChange, 500)

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      debouncedOnChange(newValue)
    },
    [debouncedOnChange]
  )

  const handleClear = useCallback(() => {
    setValue('')
    onChange('')
  }, [onChange])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8 h-8 text-sm"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
