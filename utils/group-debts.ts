import type { Debt } from '@/utils/database.types'

export interface GroupedDebt {
  name: string
  totalAmount: number
  count: number
  debts: Debt[]
}

/**
 * Group debts by counterpart_name.
 * Preserves the original order from the API (sorted by date or amount).
 */
export function groupDebtsByName(debts: Debt[]): GroupedDebt[] {
  const map = new Map<string, Debt[]>()

  for (const debt of debts) {
    const existing = map.get(debt.counterpart_name) ?? []
    existing.push(debt)
    map.set(debt.counterpart_name, existing)
  }

  const groups: GroupedDebt[] = []

  for (const [name, groupDebts] of map) {
    groups.push({
      name,
      totalAmount: groupDebts.reduce((sum, d) => sum + d.amount, 0),
      count: groupDebts.length,
      debts: groupDebts,
    })
  }

  return groups
}
