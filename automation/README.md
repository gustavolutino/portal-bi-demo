# Automatización inicial del Portal BI

## Qué está automatizado

GitHub Actions ejecuta `.github/workflows/portal-bi.yml` en cada propuesta de cambio, al integrar en `main` y mediante **Run workflow**. No hay cronograma periódico configurado.

1. Comprueba que siete errores deliberados sean rechazados por el validador.
2. Lee la fuente ficticia versionada `sources/agromatic-demo.json`.
3. Conserva copia Bronze, valida Silver y prepara el dataset Gold.
4. Prueba los KPI de los siete productos (378 combinaciones y ocho grupos de comprobación).
5. Genera reporte de ejecución, hashes y paquete `dist/`.
6. Publica solamente desde main, si las etapas anteriores terminaron correctamente.

La fuente de ejemplo conserva el corte 2026-09-30. Reejecutar el proceso no inventa ventas nuevas ni cambia el corte. `builtAt` indica procesamiento, no fecha de negocio.

## Ejecución local

Requiere Node.js 22. Desde el repositorio:

```sh
node automation/test-pipeline.cjs
node automation/pipeline.cjs
```

Las carpetas `.build/` y `dist/` son salidas regenerables. Nunca contienen credenciales. El pipeline actual está limitado a datos ficticios.

## Guion de demostración

1. Ingresar al Portal con admin / 1234 y abrir Arquitectura y automatización.
2. Mostrar el corte del dataset y la hora real de construcción del paquete (son conceptos distintos).
3. Recorrer Bronze (origen), Silver (control), Gold (consumo) y publicación.
4. Abrir la ejecución de GitHub desde el enlace del reporte.
5. Mostrar las etapas y el artefacto `pipeline-evidence`, retenido 14 días.
6. Usar el ejercicio local de pedido inconsistente para explicar el rechazo. Ese botón no dispara el workflow.
7. Volver a RTM y filtrar una zona: los indicadores se calculan sobre el dataset Gold de esa publicación.

Para ejecutar realmente: GitHub → Actions → Portal BI - Validar y publicar → Run workflow → main. Un usuario debe tener permisos de ejecución. No se coloca un token en el navegador.

## Fallos y recuperación

Si falla la validación o una prueba, no se ejecuta deploy. La publicación previa permanece activa. Revisar el log del paso fallido, corregir la fuente o el código mediante PR y volver a ejecutar. Para recuperar una versión anterior, revertir el cambio en main mediante un nuevo commit y dejar que el workflow la valide y publique; no forzar historial.

El reporte público describe la versión servida, no una ejecución fallida posterior. Los fallos posteriores se consultan en Actions. La hoja Cuadre & Calidad contiene excepciones didácticas; el validador comprueba que ese lote de prueba sea internamente consistente, no exige que esas excepciones simuladas sean cero.

## Límite y siguiente integración

Esto implementa capas en archivos y entrega estática; no es aún un Data Warehouse productivo ni un flujo conectado al ERP. Silver valida y conserva el contrato existente, sin transformación empresarial adicional. Gold entrega el modelo para el motor de KPI del navegador.

El siguiente paso con AGROMATIC es acordar un extracto anonimizado de clientes, asignaciones de vendedores, visitas y pedidos para una zona y 1–2 vendedores. Definir claves, moneda, fechas, anulaciones, estado de pedidos, periodicidad y responsable de validación. Los datos reales requieren repositorio/procesamiento privados, autenticación real y permisos por cliente. No subirlos a este repositorio público.

Mantener Portal BI como plataforma de Gustavo Lutino; cliente, marca, productos, contratos y fuentes se parametrizan por separado.
