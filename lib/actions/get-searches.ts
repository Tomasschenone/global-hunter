'use server'

import { supabase } from '@/lib/supabase'

export type SearchListItem = {
  id: string
  productName: string
  role: string
  country: string | null
  volume: number | null
  status: string
  createdAt: string
}

export async function getRecentSearches(): Promise<SearchListItem[]> {
  const { data, error } = await supabase
    .from('searches')
    .select('id, role, country_target, volume_target, created_at, products(canonical_name), search_jobs(status)')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error || !data) {
    return []
  }

  return data.map((row: any) => ({
    id: row.id,
    productName: row.products?.canonical_name ?? 'Desconocido',
    role: row.role,
    country: row.country_target,
    volume: row.volume_target,
    status: row.search_jobs?.[0]?.status ?? 'sin job',
    createdAt: row.created_at,
  }))
}
