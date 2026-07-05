# Global Hunter — Principios de Scoring

No es el algoritmo. Son los principios que lo van a guiar cuando
haya suficiente volumen de datos reales para calibrarlo (Sprint 3+).

## Señales positivas
- La entidad declara explícitamente el rol buscado (compra/vende/fabrica)
- Evidencia de exportación/importación real del producto
- Opera en el país buscado
- Escala de operación consistente con el volumen buscado
- Evidencia reciente (verified_at cercano a hoy)
- Evidencia de fuente gubernamental o oficial

## Señales negativas
- Sitio web caído o sin actividad reciente
- Sin evidencia reciente
- Solo aparece en directorios genéricos, sin evidencia primaria
- Escala de la entidad incompatible con el volumen buscado
- El producto se menciona una sola vez, sin contexto de operación real

## Nota
Estos principios alimentan el cálculo de `confidence` en `capabilities`
y eventualmente `score` en `search_results`. No implementar el algoritmo
todavía — esperar a Sprint 3 con datos reales de al menos una industria.
