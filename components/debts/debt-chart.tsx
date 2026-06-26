'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { formatRupiah } from '@/utils/format'
import type { Debt } from '@/utils/database.types'

interface DebtChartProps {
  debts: Debt[]
}

interface TooltipPayloadItem {
  value: number
  payload: { name: string; amount: number }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 text-sm shadow-md">
      <p className="text-muted-foreground">{payload[0].payload.name}</p>
      <p className="font-semibold">{formatRupiah(payload[0].value)}</p>
    </div>
  )
}

export function DebtChart({ debts }: DebtChartProps) {
  const [expanded, setExpanded] = useState(false)

  const totalOwedToMe = debts
    .filter((d) => d.type === 'owed_to_me' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const totalIOwe = debts
    .filter((d) => d.type === 'i_owe' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const data = [
    {
      name: 'Dihutang ke saya',
      amount: totalOwedToMe,
    },
    {
      name: 'Saya hutang',
      amount: totalIOwe,
    },
  ]

  // Hide chart if both are zero
  if (totalOwedToMe === 0 && totalIOwe === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Perbandingan Utang Piutang
          </CardTitle>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v: number) => formatRupiah(v)}
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar
                dataKey="amount"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
                fill="var(--chart-1)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      )}
    </Card>
  )
}
