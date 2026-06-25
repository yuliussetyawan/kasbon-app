'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatRupiah } from '@/utils/format'
import type { Debt } from '@/utils/database.types'

interface SummaryCardsProps {
  debts: Debt[]
}

export function SummaryCards({ debts }: SummaryCardsProps) {
  const totalOwedToMe = debts
    .filter((d) => d.type === 'owed_to_me' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const totalIOwe = debts
    .filter((d) => d.type === 'i_owe' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const net = totalOwedToMe - totalIOwe

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Total owed to me */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Dihutang ke saya
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatRupiah(totalOwedToMe)}
          </div>
        </CardContent>
      </Card>

      {/* Total I owe */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saya hutang
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatRupiah(totalIOwe)}
          </div>
        </CardContent>
      </Card>

      {/* Net */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              net >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {net >= 0 ? '+' : ''}{formatRupiah(net)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
