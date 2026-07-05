'use server'

import { supabase } from '@/lib/supabase'

export type CreateSearchResult = {
  success: boolean
  searchId?: string
  jobId?: string
  jobStatus?: string
  error?: string
}

export async function createSearch(formData: FormData): Promise<CreateSearchResult> {
  const productName = formData.get('product') as string
  const role = formData.get('role') as string
  const country = formData.get('country') as string
  const volume = formData.get('volume') as string

  if (!productName || !role || !country) {
    return { success: false, error: 'Faltan campos obligatorios' }
  }

  // Buscar o crear el producto (sin normalización avanzada todavia, Sprint 2)
  let productId: string

  const { data: existingProduct } = await supabase
    .from('products')
    .select('id')
    .ilike('canonical_name', productName)
    .maybeSingle()

  if (existingProduct) {
    productId = existingProduct.id
  } else {
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({ canonical_name: productName })
      .select('id')
      .single()

    if (productError || !newProduct) {
      return { success: false, error: 'Error creando producto: ' + productError?.message }
    }
    productId = newProduct.id
  }

  // Crear la búsqueda
  const { data: search, error: searchError } = await supabase
    .from('searches')
    .insert({
      product_id: productId,
      role,
      country_target: country,
      volume_target: volume ? Number(volume) : null,
    })
    .select('id')
    .single()

  if (searchError || !search) {
    return { success: false, error: 'Error creando búsqueda: ' + searchError?.message }
  }

  // Crear el search_job en estado pending
  const { data: job, error: jobError } = await supabase
    .from('search_jobs')
    .insert({
      search_id: search.id,
      status: 'pending',
    })
    .select('id, status')
    .single()

  if (jobError || !job) {
    return { success: false, error: 'Error creando job: ' + jobError?.message }
  }

  return {
    success: true,
    searchId: search.id,
    jobId: job.id,
    jobStatus: job.status,
  }
}
