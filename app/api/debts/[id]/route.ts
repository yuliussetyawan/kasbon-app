import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { updateDebtSchema } from '@/utils/schema'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * PATCH /api/debts/[id]
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const supabase = await createClient()
  const { id } = await params

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
  const parsed = updateDebtSchema.safeParse(body)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Data gak valid'
    return NextResponse.json(
      { error: firstError, details: parsed.error.issues },
      { status: 400 }
    )
  }

  // Update — RLS ensures that only the user's own row can be updated
  const { data, error } = await supabase
    .from('debts')
    .update(parsed.data as never)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[api/debts] Gagal update data:', error)
    return NextResponse.json(
      { error: 'Gagal update data utang piutang.' },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      { error: 'Data utang piutang gak ditemukan.' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

/**
 * DELETE /api/debts/[id]
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const supabase = await createClient()
  const { id } = await params

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Akses ditolak. Harap login terlebih dahulu.' },
      { status: 401 }
    )
  }

  // Delete — RLS ensures that only the user's own row can be deleted
  const { error } = await supabase
    .from('debts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[api/debts] Gagal hapus data:', error)
    return NextResponse.json(
      { error: 'Gagal hapus data utang piutang.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Data utang piutang berhasil dihapus.' })
}
