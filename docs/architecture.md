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

## Reglas adicionales (post Stage 1 review)

### Multi-tenancy
Ninguna tabla de negocio debe asumir un único cliente, aunque hoy
solo haya un usuario. Cuando se implemente organization_id, debe
evaluarse su propagación a toda tabla que contenga datos propios
de un cliente (searches, search_jobs, search_results, y
potencialmente entities/capabilities/evidence si en el futuro
distintos clientes cargan datos sobre la misma industria).

### Normalización obligatoria antes de escribir en entities
Ninguna fuente de datos escribe directamente en `entities`. Todo
dato entrante pasa primero por una etapa de matching contra
`entity_aliases` para evitar duplicados (ej: "Codelco" vs
"Corporación Nacional del Cobre" vs "CODELCO Chile"). Se
implementa en Sprint 2 junto con los primeros conectores reales.

### Unidad conceptual: oportunidad comercial
La unidad fundamental del sistema no es la empresa ni el producto,
sino la oportunidad comercial: una necesidad concreta de conectar
oferta con demanda. Hoy esto se modela funcionalmente en `searches`.
Si en el futuro una oportunidad necesita más estado que una búsqueda
puntual (seguimiento, negociación), se evalúa separarla en su
propia tabla. No se implementa ahora.

## Arquitectura congelada
A partir de este punto no se abren nuevos debates de diseño de
datos salvo que aparezca un problema real de implementación.
El trabajo pasa a foco 100% en ejecución: Sprint 1 en adelante.
