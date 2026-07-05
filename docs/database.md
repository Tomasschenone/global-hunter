# Global Hunter — Base de Datos

## Regla de oro
No guardar información derivada si puede recalcularse fácilmente.
Sí guardar información cuyo costo de obtener nuevamente sea alto
(ej: evidence, contacts). Score se recalcula salvo que el ranking
se vuelva costoso computacionalmente.

## entities
- id (uuid, pk)
- entity_type (enum: company, mine, factory, farm, hotel, brand, asset, person, organization)
- name (text)
- created_at (timestamp)

## entity_aliases
- id (uuid, pk)
- entity_id (fk -> entities)
- alias (text)
- source (text)

## locations
- id (uuid, pk)
- entity_id (fk -> entities)
- country (text)
- region (text)
- city (text)
- location_type (enum: headquarters, factory, warehouse, office, mine, port, farm)

## products
- id (uuid, pk)
- canonical_name (text)
- category (text)

## product_aliases
- id (uuid, pk)
- product_id (fk -> products)
- alias (text)

## capabilities
- id (uuid, pk)
- entity_id (fk -> entities)
- product_id (fk -> products)
- role (enum: buy, sell, manufacture, distribute, represent, invest)
- volume (numeric)
- unit (text)
- period (text)
- confidence (numeric, 0-1)
- verified_at (timestamp)
- created_at (timestamp)

## evidence
- id (uuid, pk)
- capability_id (fk -> capabilities)
- source_type (enum: government, company, marketplace, news, directory, manual, api)
- url (text)
- snippet (text)
- captured_at (date)
- verified_at (timestamp)

## contacts
- id (uuid, pk)
- entity_id (fk -> entities)
- contact_type (enum: email, phone, linkedin, whatsapp, web_form)
- value (text)
- notes (text)

## searches
- id (uuid, pk)
- product_id (fk -> products)
- role (enum: buy, sell, manufacture, distribute, represent, invest)
- volume_target (numeric)
- unit (text)
- country_target (text)
- created_at (timestamp)

## search_jobs
- id (uuid, pk)
- search_id (fk -> searches)
- status (enum: pending, interpreting, expanding, searching, profiling, ranking, done, insufficient_evidence, failed)
- created_at (timestamp)
- updated_at (timestamp)

## search_results
- id (uuid, pk)
- search_job_id (fk -> search_jobs)
- entity_id (fk -> entities)
- score (numeric)
- confidence (numeric)
- ranking_version (text)
- created_at (timestamp)

## Pendiente para Sprint 1 (antes de cargar datos reales)
- organization_id: columna a agregar en searches, search_jobs, search_results
  cuando se defina multi-tenancy (necesario si el producto se vende a más
  de un cliente/empresa).

## Futuro, no implementado (evaluar con volumen real de datos)
- claims: capa intermedia entre entity y capability para sintetizar
  múltiples afirmaciones parciales o contradictorias en una capability.
  Modelo actual: entity -> capability -> evidence.
  Modelo futuro posible: entity -> claim -> evidence, con capability
  derivada de varios claims.
