# Global Hunter — Arquitectura

## Pipeline
Interpretación → Expansión semántica → Búsqueda multi-fuente → Perfilado → Ranking → Resultados

Ejecución: asíncrona por jobs (no en request HTTP), por límites de Vercel Hobby.

## Modelo de datos (Supabase)
- entities: contraparte comercial, agnóstica de industria
- capabilities: rol (buy/sell/manufacture/distribute/represent/invest) + producto + volumen + unidad + período
- evidence: fuente de cada capability (url, snippet, fecha)
- searches: búsqueda estructurada del usuario
- search_jobs: estado del pipeline
- search_results: entidad + score + confianza + evidence

## Regla de confianza
Sin evidence, no hay capability. Si no hay evidencia suficiente, el resultado se marca insufficient_evidence en lugar de forzarse.

## Fuentes Sprint 1-2 (sin LLM)
- Google Custom Search API
- OpenCorporates API
- UN Comtrade API

LLM se incorpora en Sprint 5+, no antes.
