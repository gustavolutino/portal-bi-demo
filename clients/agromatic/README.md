# Portal BI · Edición AGROMATIC 4.0.0

Plataforma y autoría: **Gustavo Lutino | Arquitectura Analítica**.
Personalización del Portal BI para AGROMATIC; no es una sustitución de su sitio corporativo.

## Contexto de producto

Foco recuperado y aplicado: RTM, orientación del crecimiento comercial, OKR/KPI, control de pedidos, frecuencia de visitas, cobertura territorial y carga de vendedores.

La implementación organiza RTM como prioridad inicial. Dirección Comercial acompaña esa prioridad. Clientes 360, Inventario y Margen/Precios se presentan como evolución propuesta; Cuadre y Calidad es transversal. Las metas concretas y los entregables del piloto deben validarse antes de una contratación. No se presenta ninguna propuesta del asistente como compromiso aceptado.

| Producto | Pregunta principal | Indicadores principales |
| --- | --- | --- |
| RTM & Territorio | ¿Dónde concentrar visitas y equilibrar carga? | Visitas previstas/realizadas, cumplimiento, conversión, cobertura, frecuencia, carga, costo por visita |
| Dirección Comercial & OKR | ¿Avanza el objetivo con cobertura y servicio? | Crecimiento YTD, venta YTD, cobertura, servicio de pedidos, margen, avance de KR |
| Ventas & Pedidos | ¿Qué crece y qué necesita seguimiento? | Venta YTD/mes, cumplimiento, variación, pedidos, pendientes, ticket, servicio |
| Clientes 360 | ¿A quién atender, retener o reactivar? | Universo, compradores, penetración, sin compra, retención, saldo, vencido, mora |
| Inventario & Disponibilidad | ¿Qué reponer y qué capital movilizar? | Stock valorizado, disponibilidad SKU-zona, quiebres, cobertura, rotación, sin movimiento, reposición, plazo |
| Margen & Precios | ¿Dónde recuperar rentabilidad? | Margen bruto/ponderado, descuento, venta bajo objetivo, brecha, margen/pedido, contribución tras ruta |
| Cuadre & Calidad | ¿Qué debe revisarse antes de decidir? | Evaluados, conformes, claves faltantes, duplicados, diferencias, descuadre, importe referencia, demora |

Cada carpeta `projects/<producto>/product.json` describe su personalización, entrada, KPI y reglas. El motor y los componentes compartidos evitan divergencias entre proyectos.

## Identidad

Referencia visual revisada: https://agromatic.com.bo/ (2026-10-12 UTC).
Azul observado en navegación: RGB 30,56,117 / #1e3875. Amarillo de acento #ffe500 y fondos blancos/grises como adaptación visual, no manual de marca certificado.
Logo obtenido del sitio: https://agromatic.com.bo/wp-content/uploads/2021/07/logo.png. Se conserva como marca del cliente; no se atribuye su diseño a Gustavo Lutino.
Familias tomadas como contexto público: repuestos agrícolas, monitores de siembra, ejes de doble tracción e implementos agrícolas.

## Datos y límites

Todos los registros, asignaciones, importes, objetivos, capacidad, deuda, costos, plazos y demanda son ficticios. Los nombres de territorios contextualizan la demo y no acreditan presencia comercial o sucursales. No hay datos privados de AGROMATIC, AIDISA ni clientes reales.

Datos: 72 clientes ficticios; 648 registros cliente-mes, 432 posiciones mensuales SKU-zona y 54 controles territoriales. Corte septiembre 2026. Se distingue YTD de foto mensual. Los saldos de cartera y stock nunca se acumulan entre meses.

OKR: metas propuestas exclusivamente para la demo (10 % crecimiento, 85 % cobertura, 90 % servicio), pesos iguales y avance individual acotado 0–100 %. Margen objetivo demo 25 %. No son metas aprobadas por AGROMATIC.

RTM: un pedido como máximo por visita en el generador. Costo de ruta no representa todos los gastos del negocio. Inventario: la sugerencia no contempla tránsito ni stock de seguridad. No se aplica vencimiento como KPI principal de repuestos.

## Acceso y uso

Abrir `index.html` a través de un servidor HTTP. Demo visual **admin / 1234**. No es autenticación ni controla acceso a los recursos públicos. Solo se conserva el identificador de sesión; la contraseña no se almacena.

Filtros: mes, territorio, vendedor y familia según producto. Búsqueda, paginación, exportación CSV, escenarios, estados locales de acciones y borrador de alcance descargable. Las acciones y formularios no envían datos ni ejecutan procesos externos.

## Evolución propuesta

1. Piloto acotado con una zona y 1–2 vendedores, cruzando fuentes disponibles.
2. Ingeniería de datos para históricos, automatización, claves y calidad reutilizables.
3. Incorporación gradual de productos y microservicios de captura, alertas, pedidos y precios/demanda según evidencia.

Capacidad de referencia del configurador: 24–40 horas/mes; no es un compromiso contractual. Importes y cronograma a cotizar.

## Validación

`node tests/metrics.cjs`

Incluye 378 combinaciones producto/mes/territorio, comprobaciones de filtros, YTD, ratios ponderados, retención sin base, inventario por corte, conciliación y ausencia de NaN/Infinity. No exige librerías externas. Los ocho grupos de pruebas se ejecutan desde cualquier directorio.
