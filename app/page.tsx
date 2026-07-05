'use client'

import { useState, useEffect } from 'react'
import { createSearch, type CreateSearchResult } from '@/lib/actions/create-search'
import { getRecentSearches, type SearchListItem } from '@/lib/actions/get-searches'

export default function Home() {
  const [result, setResult] = useState<CreateSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
const [searches, setSearches] = useState<SearchListItem[]>([])

  async function loadSearches() {
    const list = await getRecentSearches()
    setSearches(list)
  }

  useEffect(() => {
    loadSearches()
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const res = await createSearch(formData)
    setResult(res)
    setLoading(false)
    if (res.success) {
      await loadSearches()
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Global Hunter</h1>

      <form action={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <input
          name="product"
          placeholder="Producto (ej: Cobre)"
          required
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
        />

        <select
          name="role"
          required
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
        >
          <option value="">¿Buscás comprar o vender?</option>
          <option value="buy">Comprar</option>
          <option value="sell">Vender</option>
        </select>

        <input
          name="country"
          placeholder="País (ej: Chile)"
          required
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
        />

        <input
          name="volume"
          type="number"
          placeholder="Cantidad (opcional)"
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-2 font-semibold disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {result && (
        <div className="mt-8 w-full max-w-md border border-gray-700 rounded p-4">
          {result.success ? (
            <>
              <p className="text-green-400 font-semibold">Búsqueda creada.</p>
              <p>Estado: {result.jobStatus}</p>
              <p className="text-xs text-gray-500 mt-2">Search ID: {result.searchId}</p>
              <p className="text-xs text-gray-500">Job ID: {result.jobId}</p>
            </>
          ) : (
            <p className="text-red-400">Error: {result.error}</p>
          )}
        </div>
      )}

      <div className="mt-10 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">Búsquedas recientes</h2>
        {searches.length === 0 ? (
          <p className="text-gray-500 text-sm">Todavía no hay búsquedas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {searches.map((s) => (
              <li key={s.id} className="border border-gray-800 rounded p-3 text-sm flex justify-between">
                <span>{s.role === 'buy' ? 'Comprar' : 'Vender'} {s.productName} en {s.country}{s.volume ? ` (${s.volume})` : ''}</span>
                <span className="text-gray-500">{s.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
