-- ============================================
-- CONSULTAS DE EJEMPLO Y CASOS DE USO
-- ============================================

-- 1. CONSULTAS BÁSICAS DE OPERACIÓN DIARIA

-- Obtener todas las reservas del día actual para un complejo
SELECT 
    r.id,
    cl.nombre || ' ' || COALESCE(cl.apellido, '') as cliente,
    ca.nombre as cancha,
    r.fecha_inicio,
    r.fecha_fin,
    r.estado,
    r.estado_pago,
    r.precio_total
FROM reservas r
JOIN clientes cl ON r.cliente_id = cl.id
JOIN canchas ca ON r.cancha_id = ca.id
WHERE r.complejo_id = '{{complejo_id}}'
  AND DATE(r.fecha_inicio) = CURRENT_DATE
ORDER BY r.fecha_inicio;

-- Verificar disponibilidad de canchas en un horario específico
SELECT 
    c.id,
    c.nombre,
    c.tipo_deporte,
    c.precio_hora,
    c.estado,
    CASE 
        WHEN r.id IS NOT NULL THEN 'Ocupada'
        ELSE 'Disponible'
    END as disponibilidad
FROM canchas c
LEFT JOIN reservas r ON c.id = r.cancha_id 
    AND r.fecha_inicio <= '2024-07-18 20:00:00'
    AND r.fecha_fin > '2024-07-18 18:00:00'
    AND r.estado IN ('confirmada', 'en_curso')
WHERE c.complejo_id = '{{complejo_id}}'
  AND c.activa = true;

-- 2. GESTIÓN DE CLIENTES Y FIDELIZACIÓN

-- Obtener clientes VIP (más de 10 reservas en los últimos 3 meses)
SELECT 
    cl.id,
    cl.nombre,
    cl.apellido,
    cl.telefono,
    COUNT(r.id) as total_reservas,
    SUM(r.precio_total) as total_gastado,
    AVG(r.precio_total) as promedio_gasto,
    MAX(r.fecha_inicio) as ultima_visita
FROM clientes cl
JOIN reservas r ON cl.id = r.cliente_id
WHERE cl.complejo_id = '{{complejo_id}}'
  AND r.fecha_inicio >= CURRENT_DATE - INTERVAL '3 months'
  AND r.estado IN ('confirmada', 'finalizada')
GROUP BY cl.id, cl.nombre, cl.apellido, cl.telefono
HAVING COUNT(r.id) >= 10
ORDER BY total_gastado DESC;

-- Clientes que no han venido en el último mes (para campañas de retención)
SELECT 
    cl.id,
    cl.nombre,
    cl.apellido,
    cl.telefono,
    cl.email,
    MAX(r.fecha_inicio) as ultima_reserva,
    COUNT(r.id) as total_reservas_historicas
FROM clientes cl
LEFT JOIN reservas r ON cl.id = r.cliente_id
WHERE cl.complejo_id = '{{complejo_id}}'
  AND cl.activo = true
GROUP BY cl.id, cl.nombre, cl.apellido, cl.telefono, cl.email
HAVING MAX(r.fecha_inicio) < CURRENT_DATE - INTERVAL '1 month'
   OR MAX(r.fecha_inicio) IS NULL
ORDER BY ultima_reserva DESC NULLS LAST;

-- 3. ANALÍTICAS DE NEGOCIO

-- Reporte de ingresos por mes
SELECT 
    DATE_TRUNC('month', r.fecha_inicio) as mes,
    COUNT(r.id) as total_reservas,
    SUM(r.precio_total) as ingresos_reservas,
    SUM(COALESCE(tp.total, 0)) as ingresos_productos,
    SUM(r.precio_total + COALESCE(tp.total, 0)) as ingresos_totales,
    AVG(r.precio_total) as ticket_promedio_reserva
FROM reservas r
LEFT JOIN (
    SELECT reserva_id, SUM(total) as total
    FROM transacciones_productos
    GROUP BY reserva_id
) tp ON r.id = tp.reserva_id
WHERE r.complejo_id = '{{complejo_id}}'
  AND r.estado IN ('confirmada', 'finalizada')
  AND r.fecha_inicio >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', r.fecha_inicio)
ORDER BY mes DESC;

-- Análisis de ocupación por cancha y horario
SELECT 
    ca.nombre as cancha,
    ca.tipo_deporte,
    EXTRACT(hour FROM r.fecha_inicio) as hora,
    COUNT(r.id) as reservas,
    ROUND(COUNT(r.id) * 100.0 / 
        (SELECT COUNT(*) FROM generate_series(
            CURRENT_DATE - INTERVAL '30 days',
            CURRENT_DATE,
            INTERVAL '1 day'
        )), 2) as porcentaje_ocupacion
FROM canchas ca
LEFT JOIN reservas r ON ca.id = r.cancha_id
    AND r.fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
    AND r.estado IN ('confirmada', 'finalizada')
WHERE ca.complejo_id = '{{complejo_id}}'
  AND ca.activa = true
GROUP BY ca.id, ca.nombre, ca.tipo_deporte, EXTRACT(hour FROM r.fecha_inicio)
ORDER BY ca.nombre, hora;

-- 4. GESTIÓN DE INVENTARIO

-- Productos con stock bajo
SELECT 
    p.id,
    p.nombre,
    c.nombre as categoria,
    p.stock_disponible,
    p.stock_minimo,
    p.stock_disponible - p.stock_minimo as diferencia,
    p.precio_venta,
    p.precio_alquiler
FROM productos p
JOIN categorias_productos c ON p.categoria_id = c.id
WHERE p.complejo_id = '{{complejo_id}}'
  AND p.activo = true
  AND p.stock_disponible <= p.stock_minimo
ORDER BY diferencia ASC;

-- Productos más vendidos/alquilados en el último mes
SELECT 
    p.nombre,
    c.nombre as categoria,
    SUM(tp.cantidad) as cantidad_total,
    SUM(tp.total) as ingresos_total,
    AVG(tp.precio_unitario) as precio_promedio,
    tp.tipo_transaccion
FROM transacciones_productos tp
JOIN productos p ON tp.producto_id = p.id
JOIN categorias_productos c ON p.categoria_id = c.id
WHERE p.complejo_id = '{{complejo_id}}'
  AND tp.created_at >= CURRENT_DATE - INTERVAL '1 month'
GROUP BY p.id, p.nombre, c.nombre, tp.tipo_transaccion
ORDER BY cantidad_total DESC;

-- 5. SISTEMA DE NOTIFICACIONES

-- Recordatorios pendientes para hoy
SELECT 
    n.id,
    cl.nombre || ' ' || COALESCE(cl.apellido, '') as cliente,
    cl.telefono,
    n.tipo,
    n.titulo,
    n.canal,
    n.programada_para
FROM notificaciones n
JOIN clientes cl ON n.cliente_id = cl.id
WHERE n.complejo_id = '{{complejo_id}}'
  AND n.estado = 'pendiente'
  AND DATE(n.programada_para) = CURRENT_DATE
ORDER BY n.programada_para;

-- Clientes para recordatorio de reserva mañana
SELECT DISTINCT
    cl.id,
    cl.nombre,
    cl.apellido,
    cl.telefono,
    r.fecha_inicio,
    ca.nombre as cancha
FROM reservas r
JOIN clientes cl ON r.cliente_id = cl.id
JOIN canchas ca ON r.cancha_id = ca.id
WHERE r.complejo_id = '{{complejo_id}}'
  AND DATE(r.fecha_inicio) = CURRENT_DATE + INTERVAL '1 day'
  AND r.estado = 'confirmada'
  AND NOT EXISTS (
      SELECT 1 FROM notificaciones n 
      WHERE n.cliente_id = cl.id 
        AND n.tipo = 'recordatorio'
        AND DATE(n.programada_para) = CURRENT_DATE + INTERVAL '1 day'
  );

-- 6. GESTIÓN DE PAGOS

-- Pagos pendientes del día
SELECT 
    p.id,
    cl.nombre || ' ' || COALESCE(cl.apellido, '') as cliente,
    cl.telefono,
    ca.nombre as cancha,
    r.fecha_inicio,
    p.monto,
    p.metodo_pago,
    p.estado,
    p.created_at
FROM pagos p
JOIN reservas r ON p.reserva_id = r.id
JOIN clientes cl ON r.cliente_id = cl.id
JOIN canchas ca ON r.cancha_id = ca.id
WHERE r.complejo_id = '{{complejo_id}}'
  AND p.estado IN ('pendiente', 'procesando')
  AND DATE(r.fecha_inicio) = CURRENT_DATE
ORDER BY r.fecha_inicio;

-- Resumen de métodos de pago por período
SELECT 
    p.metodo_pago,
    COUNT(p.id) as cantidad_transacciones,
    SUM(p.monto) as total_monto,
    AVG(p.monto) as monto_promedio
FROM pagos p
JOIN reservas r ON p.reserva_id = r.id
WHERE r.complejo_id = '{{complejo_id}}'
  AND p.estado = 'completado'
  AND p.created_at >= CURRENT_DATE - INTERVAL '1 month'
GROUP BY p.metodo_pago
ORDER BY total_monto DESC;

-- 7. CONSULTAS PARA EL BOT DE WHATSAPP (PLAN PREMIUM)

-- Últimas conversaciones de WhatsApp
SELECT 
    mw.telefono,
    cl.nombre,
    COUNT(mw.id) as total_mensajes,
    MAX(mw.created_at) as ultimo_mensaje,
    COUNT(CASE WHEN mw.direccion = 'entrante' THEN 1 END) as mensajes_recibidos,
    COUNT(CASE WHEN mw.direccion = 'saliente' THEN 1 END) as mensajes_enviados
FROM mensajes_whatsapp mw
LEFT JOIN clientes cl ON mw.cliente_id = cl.id
WHERE mw.complejo_id = '{{complejo_id}}'
  AND mw.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY mw.telefono, cl.nombre
ORDER BY ultimo_mensaje DESC;

-- Mensajes no procesados automáticamente (requieren atención manual)
SELECT 
    mw.id,
    mw.telefono,
    cl.nombre,
    mw.contenido,
    mw.created_at
FROM mensajes_whatsapp mw
LEFT JOIN clientes cl ON mw.cliente_id = cl.id
WHERE mw.complejo_id = '{{complejo_id}}'
  AND mw.direccion = 'entrante'
  AND mw.procesado_automaticamente = false
  AND mw.created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY mw.created_at DESC;

-- 8. GESTIÓN DE TORNEOS

-- Torneos activos con estado de inscripciones
SELECT 
    t.id,
    t.nombre,
    t.tipo_deporte,
    t.fecha_inicio,
    t.fecha_limite_inscripcion,
    t.precio_inscripcion,
    t.max_participantes,
    COUNT(pt.id) as participantes_inscritos,
    t.max_participantes - COUNT(pt.id) as cupos_disponibles,
    t.estado
FROM torneos t
LEFT JOIN participantes_torneo pt ON t.id = pt.torneo_id
WHERE t.complejo_id = '{{complejo_id}}'
  AND t.estado IN ('programado', 'inscripciones_abiertas')
GROUP BY t.id, t.nombre, t.tipo_deporte, t.fecha_inicio, 
         t.fecha_limite_inscripcion, t.precio_inscripcion, 
         t.max_participantes, t.estado
ORDER BY t.fecha_inicio;

-- Fixture de partidos para un torneo
SELECT 
    pt.id,
    pt.ronda,
    pt.fecha_programada,
    ca.nombre as cancha,
    cl1.nombre || ' ' || COALESCE(cl1.apellido, '') as participante1,
    cl2.nombre || ' ' || COALESCE(cl2.apellido, '') as participante2,
    pt.estado,
    pt.resultado
FROM partidos_torneo pt
JOIN participantes_torneo p1 ON pt.participante1_id = p1.id
JOIN participantes_torneo p2 ON pt.participante2_id = p2.id
JOIN clientes cl1 ON p1.cliente_id = cl1.id
JOIN clientes cl2 ON p2.cliente_id = cl2.id
LEFT JOIN canchas ca ON pt.cancha_id = ca.id
WHERE pt.torneo_id = '{{torneo_id}}'
ORDER BY pt.fecha_programada, pt.ronda;
