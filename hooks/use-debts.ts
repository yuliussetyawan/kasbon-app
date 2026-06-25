'use client'

import { useState, useEffect } from 'react'
import type { Debt } from '@/utils/database.types'
import type { DebtFilterInput, CreateDebtInput, UpdateDebtInput } from '@/utils/schema'

interface UseDebtsReturn {
  debts: Debt[]
  loading: boolean
  error: string | null
  filters: DebtFilterInput
  setFilters: (filters: DebtFilterInput) => void
  createDebt: (data: CreateDebtInput) => Promise<Debt | null>
  updateDebt: (id: string, data: UpdateDebtInput) => Promise<Debt | null>
  deleteDebt: (id: string) => Promise<boolean>
  toggleSettled: (id: string) => Promise<Debt | null>
  refetch: () => void
}

export function useDebts(): UseDebtsReturn {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<DebtFilterInput>({
    status: 'all',
    type: 'all',
    search: '',
  })
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchDebts = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (filters.status !== 'all') params.set('status', filters.status)
        if (filters.type !== 'all') params.set('type', filters.type)
        if (filters.search) params.set('search', filters.search)

        const url = `/api/debts${params.toString() ? '?' + params.toString() : ''}`
        const res = await fetch(url)

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'Gagal mengambil data')
        }

        const data = await res.json()
        if (!cancelled) setDebts(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDebts()

    return () => { cancelled = true }
  }, [filters, refetchTrigger])

  const createDebt = async (data: CreateDebtInput): Promise<Debt | null> => {
    try {
      const res = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Gagal menyimpan data')
      }

      const newDebt = await res.json()
      setDebts((prev) => [newDebt, ...prev])
      return newDebt
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      return null
    }
  }

  const updateDebt = async (id: string, data: UpdateDebtInput): Promise<Debt | null> => {
    try {
      const res = await fetch(`/api/debts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Gagal update data')
      }

      const updated = await res.json()
      setDebts((prev) => prev.map((d) => (d.id === id ? updated : d)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      return null
    }
  }

  const deleteDebt = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/debts/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Gagal hapus data')
      }

      setDebts((prev) => prev.filter((d) => d.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      return false
    }
  }

  const toggleSettled = async (id: string): Promise<Debt | null> => {
    const debt = debts.find((d) => d.id === id)
    if (!debt) return null

    const settled_at = debt.settled_at ? null : new Date().toISOString()
    return updateDebt(id, { settled_at })
  }

  return {
    debts,
    loading,
    error,
    filters,
    setFilters,
    createDebt,
    updateDebt,
    deleteDebt,
    toggleSettled,
    refetch: () => setRefetchTrigger((n) => n + 1),
  }
}