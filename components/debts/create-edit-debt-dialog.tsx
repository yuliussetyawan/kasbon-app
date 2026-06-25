// components/debts/create-edit-debt-dialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createDebtSchema } from '@/utils/schema'
import type { CreateDebtInput } from '@/utils/schema'
import type { Debt, DebtType } from '@/utils/database.types'

interface CreateEditDebtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateDebtInput) => Promise<Debt | null>
  debt?: Debt | null
}

export function CreateEditDebtDialog({
  open,
  onOpenChange,
  onSubmit,
  debt,
}: CreateEditDebtDialogProps) {
  const formKey = debt ? `edit-${debt.id}` : 'create'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {debt ? 'Edit Utang Piutang' : 'Catat Baru'}
          </DialogTitle>
        </DialogHeader>

        <DebtForm
          key={formKey}
          debt={debt}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

interface DebtFormProps {
  debt?: Debt | null
  onSubmit: (data: CreateDebtInput) => Promise<Debt | null>
  onCancel: () => void
}

function DebtForm({ debt, onSubmit, onCancel }: DebtFormProps) {
  const isEdit = !!debt

  const [type, setType] = useState<DebtType>(debt?.type ?? 'owed_to_me')
  const [counterpartName, setCounterpartName] = useState(debt?.counterpart_name ?? '')
  const [amount, setAmount] = useState(debt ? String(debt.amount) : '')
  const [dueDate, setDueDate] = useState(
    debt?.due_date ?? new Date().toISOString().split('T')[0]
  )
  const [note, setNote] = useState(debt?.note ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const result = createDebtSchema.safeParse({
      type,
      counterpart_name: counterpartName,
      amount: amount ? Number(amount) : undefined,
      due_date: dueDate || null,
      note: note || null,
    })

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        newErrors[field] = issue.message
      })
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setSubmitting(true)

    const data: CreateDebtInput = {
      type,
      counterpart_name: counterpartName.trim(),
      amount: Number(amount),
      due_date: dueDate || null,
      note: note.trim() || null,
    }

    const result = await onSubmit(data)
    setSubmitting(false)

    if (result) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipe */}
      <div className="space-y-2">
        <Label>Tipe</Label>
        <RadioGroup
          value={type}
          onValueChange={(v) => setType(v as DebtType)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="owed_to_me" id="type-owed" />
            <Label htmlFor="type-owed" className="font-normal cursor-pointer">
              Saya dihutang
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="i_owe" id="type-owe" />
            <Label htmlFor="type-owe" className="font-normal cursor-pointer">
              Saya hutang
            </Label>
          </div>
        </RadioGroup>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type}</p>
        )}
      </div>

      {/* Nama orang */}
      <div className="space-y-2">
        <Label htmlFor="counterpart_name">Nama orang</Label>
        <Input
          id="counterpart_name"
          value={counterpartName}
          onChange={(e) => setCounterpartName(e.target.value)}
          placeholder="Siapa?"
          maxLength={100}
        />
        {errors.counterpart_name && (
          <p className="text-sm text-destructive">{errors.counterpart_name}</p>
        )}
      </div>

      {/* Jumlah */}
      <div className="space-y-2">
        <Label htmlFor="amount">Jumlah (Rp)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500000"
          min={1}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>

      {/* Tanggal */}
      <div className="space-y-2">
        <Label htmlFor="due_date">Tanggal</Label>
        <Input
          id="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.due_date && (
          <p className="text-sm text-destructive">{errors.due_date}</p>
        )}
      </div>

      {/* Catatan */}
      <div className="space-y-2">
        <Label htmlFor="note">Catatan (opsional)</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tambahkan catatan..."
          maxLength={200}
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right">
          {note.length}/200
        </p>
        {errors.note && (
          <p className="text-sm text-destructive">{errors.note}</p>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Catat'}
        </Button>
      </DialogFooter>
    </form>
  )
}
