import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createDebtSchema, debtFilterSchema } from '@/utils/schema'
import type { DebtInsert } from '@/utils/database.types'

/**
 * GET /api/debts?status=all|belum|lunas&type=all|owed_to_me|i_owe&search=budi
 */
export async function GET(request: Request) {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Akses ditolak. Harap login terlebih dahulu.' },
      { status: 401 }
    )
  }

  // Parse & validate query params
  const { searchParams } = new URL(request.url)
  const parsed = debtFilterSchema.safeParse({
    status: searchParams.get('status') ?? 'all',
    type: searchParams.get('type') ?? 'all',
    search: searchParams.get('search') ?? '',
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Parameter filter gak valid', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { status, type, search } = parsed.data

  let query = supabase
    .from('debts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (type !== 'all') {
    query = query.eq('type', type)
  }

  if (status === 'belum') {
    query = query.is('settled_at', null)
  } else if (status === 'lunas') {
    query = query.not('settled_at', 'is', null)
  }

  if (search) {
    query = query.ilike('counterpart_name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('[api/debts] Gagal mengambil data:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data utang piutang.' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

/**
 * POST /api/debts
 */
export async function POST(request: Request) {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Akses ditolak. Harap login terlebih dahulu.' },
      { status: 401 }
    )
  }

  // Parse & validate body
  const body = await request.json()
  const parsed = createDebtSchema.safeParse(body)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Data gak valid'
    return NextResponse.json(
      { error: firstError, details: parsed.error.issues },
      { status: 400 }
    )
  }

  const insertData: DebtInsert = {
    ...parsed.data,
    user_id: user.id,
  }

  const { data, error } = await supabase
    .from('debts')
    .insert(insertData as never)
    .select()
    .single()

  if (error) {
    console.error('[api/debts] Gagal menyimpan data:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan data utang piutang.' },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 201 })
}
