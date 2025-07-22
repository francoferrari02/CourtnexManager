-- ============================================
-- COURTNEX MANAGER - ESQUEMA DE BASE DE DATOS
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. GESTIÓN DE USUARIOS Y COMPLEJOS
-- ============================================

-- Tabla de Complejos Deportivos
CREATE TABLE complejos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    horario_apertura TIME NOT NULL DEFAULT '06:00:00',
    horario_cierre TIME NOT NULL DEFAULT '23:59:59',
    dias_operacion JSONB DEFAULT '["lunes","martes","miercoles","jueves","viernes","sabado","domingo"]',
    plan_suscripcion VARCHAR(20) NOT NULL DEFAULT 'base' CHECK (plan_suscripcion IN ('base', 'premium')),
    configuracion JSONB DEFAULT '{}', -- Configuraciones específicas del complejo
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'empleado' CHECK (rol IN ('superusuario', 'empleado')),
    permisos JSONB DEFAULT '{}', -- Permisos específicos por módulo
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. GESTIÓN DE CANCHAS
-- ============================================

-- Tabla de Canchas
CREATE TABLE canchas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    tipo_deporte VARCHAR(50) NOT NULL, -- padel, tenis, futbol, basquet, etc.
    dimensiones JSONB, -- {"largo": 20, "ancho": 10, "unidad": "metros"}
    capacidad_jugadores INTEGER DEFAULT 4,
    precio_hora DECIMAL(10,2) NOT NULL,
    coordenadas_mapa JSONB, -- {"x": 100, "y": 200} para posición en mapa interactivo
    equipamiento_incluido JSONB DEFAULT '[]', -- ["red", "pelotas", "raquetas"]
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'mantenimiento', 'fuera_servicio')),
    iluminacion BOOLEAN DEFAULT true,
    techada BOOLEAN DEFAULT false,
    descripcion TEXT,
    fotos JSONB DEFAULT '[]', -- URLs de fotos
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. GESTIÓN DE CLIENTES
-- ============================================

-- Tabla de Clientes
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    telefono VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    fecha_nacimiento DATE,
    documento VARCHAR(50),
    direccion TEXT,
    etiquetas JSONB DEFAULT '[]', -- ["frecuente", "VIP", "nuevo"]
    preferencias JSONB DEFAULT '{}', -- {"deporte_favorito": "padel", "horario_preferido": "noche"}
    puntos_fidelidad INTEGER DEFAULT 0,
    descuento_aplicable DECIMAL(5,2) DEFAULT 0.00,
    notas TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. GESTIÓN DE RESERVAS Y AGENDA
-- ============================================

-- Tabla de Reservas
CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    cancha_id UUID NOT NULL REFERENCES canchas(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada' CHECK (estado IN ('pendiente', 'confirmada', 'en_curso', 'finalizada', 'cancelada', 'no_show')),
    estado_pago VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'parcial', 'pagado', 'reembolsado')),
    metodo_pago VARCHAR(50), -- efectivo, mercadopago, transferencia
    descuento_aplicado DECIMAL(10,2) DEFAULT 0.00,
    recurrente BOOLEAN DEFAULT false,
    patron_recurrencia JSONB, -- {"tipo": "semanal", "dias": ["martes"], "hasta": "2024-12-31"}
    reserva_padre_id UUID REFERENCES reservas(id), -- Para reservas recurrentes
    origen VARCHAR(20) DEFAULT 'manual' CHECK (origen IN ('manual', 'bot_whatsapp', 'web', 'app')),
    jugadores_adicionales JSONB DEFAULT '[]', -- [{"nombre": "Juan", "telefono": "123456"}]
    notas TEXT,
    motivo_cancelacion TEXT,
    created_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Lista de Espera
CREATE TABLE lista_espera (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    cancha_id UUID REFERENCES canchas(id), -- Opcional, si es para una cancha específica
    fecha_deseada DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo_deporte VARCHAR(50), -- Si no especifica cancha
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'notificada', 'convertida', 'expirada')),
    prioridad INTEGER DEFAULT 1, -- 1=alta, 2=media, 3=baja
    notificado_at TIMESTAMP WITH TIME ZONE,
    expira_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. GESTIÓN DE PAGOS
-- ============================================

-- Tabla de Pagos
CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reserva_id UUID NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL, -- efectivo, mercadopago, transferencia, etc.
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'completado', 'fallido', 'reembolsado')),
    referencia_externa VARCHAR(255), -- ID de MercadoPago, número de transferencia, etc.
    link_pago TEXT, -- URL del link de pago generado
    comprobante_url TEXT, -- URL del comprobante
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    procesado_by UUID REFERENCES usuarios(id),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. GESTIÓN DE INVENTARIO
-- ============================================

-- Tabla de Categorías de Productos
CREATE TABLE categorias_productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100), -- Clase CSS o nombre de icono
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos/Equipamiento
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias_productos(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('venta', 'alquiler', 'ambos')),
    precio_venta DECIMAL(10,2),
    precio_alquiler DECIMAL(10,2),
    stock_total INTEGER DEFAULT 0,
    stock_disponible INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    unidad_medida VARCHAR(20) DEFAULT 'unidad', -- unidad, kg, litro, etc.
    codigo_barras VARCHAR(100),
    fotos JSONB DEFAULT '[]',
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'agotado', 'mantenimiento', 'descontinuado')),
    requiere_devolucion BOOLEAN DEFAULT false, -- Para equipamiento alquilado
    deposito_requerido DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Movimientos de Stock
CREATE TABLE movimientos_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'merma')),
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    referencia_id UUID, -- Puede referenciar venta, alquiler, etc.
    usuario_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas/Alquileres de Productos
CREATE TABLE transacciones_productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reserva_id UUID REFERENCES reservas(id), -- Opcional, si está asociado a una reserva
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    producto_id UUID NOT NULL REFERENCES productos(id),
    tipo_transaccion VARCHAR(20) NOT NULL CHECK (tipo_transaccion IN ('venta', 'alquiler')),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    deposito_pagado DECIMAL(10,2) DEFAULT 0.00,
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'devuelto', 'perdido', 'dañado')),
    fecha_devolucion_esperada TIMESTAMP WITH TIME ZONE,
    fecha_devolucion_real TIMESTAMP WITH TIME ZONE,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. SISTEMA DE NOTIFICACIONES Y BOT WHATSAPP
-- ============================================

-- Tabla de Notificaciones
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES clientes(id),
    usuario_id UUID REFERENCES usuarios(id), -- Para notificaciones internas
    tipo VARCHAR(50) NOT NULL, -- recordatorio, oferta, cancelacion, confirmacion, etc.
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    canal VARCHAR(20) NOT NULL CHECK (canal IN ('whatsapp', 'email', 'sms', 'push', 'sistema')),
    prioridad VARCHAR(10) DEFAULT 'media' CHECK (prioridad IN ('alta', 'media', 'baja')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviada', 'entregada', 'leida', 'fallida')),
    programada_para TIMESTAMP WITH TIME ZONE,
    enviada_at TIMESTAMP WITH TIME ZONE,
    leida_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}', -- Datos adicionales específicos del canal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Mensajes WhatsApp (Plan Premium)
CREATE TABLE mensajes_whatsapp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES clientes(id),
    telefono VARCHAR(20) NOT NULL,
    tipo_mensaje VARCHAR(30) NOT NULL, -- texto, imagen, documento, ubicacion, etc.
    direccion VARCHAR(10) NOT NULL CHECK (direccion IN ('entrante', 'saliente')),
    contenido TEXT NOT NULL,
    mensaje_id_whatsapp VARCHAR(255), -- ID del mensaje en WhatsApp API
    estado VARCHAR(20) DEFAULT 'enviado' CHECK (estado IN ('enviado', 'entregado', 'leido', 'fallido')),
    contexto JSONB, -- Información del contexto de la conversación
    respuesta_a_mensaje_id UUID REFERENCES mensajes_whatsapp(id),
    procesado_automaticamente BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. GESTIÓN DE TORNEOS
-- ============================================

-- Tabla de Torneos
CREATE TABLE torneos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complejo_id UUID NOT NULL REFERENCES complejos(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_deporte VARCHAR(50) NOT NULL,
    tipo_torneo VARCHAR(20) DEFAULT 'eliminacion' CHECK (tipo_torneo IN ('eliminacion', 'round_robin', 'grupos')),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fecha_limite_inscripcion DATE,
    precio_inscripcion DECIMAL(10,2) DEFAULT 0.00,
    premio JSONB, -- {"primer_lugar": 1000, "segundo_lugar": 500}
    max_participantes INTEGER,
    min_participantes INTEGER DEFAULT 2,
    estado VARCHAR(20) DEFAULT 'programado' CHECK (estado IN ('programado', 'inscripciones_abiertas', 'en_curso', 'finalizado', 'cancelado')),
    reglas TEXT,
    organizador_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Participantes de Torneos
CREATE TABLE participantes_torneo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    torneo_id UUID NOT NULL REFERENCES torneos(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado_pago VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'pagado', 'exento')),
    estado_participacion VARCHAR(20) DEFAULT 'inscrito' CHECK (estado_participacion IN ('inscrito', 'confirmado', 'eliminado', 'retirado')),
    notas TEXT,
    UNIQUE(torneo_id, cliente_id)
);

-- Tabla de Partidos de Torneo
CREATE TABLE partidos_torneo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    torneo_id UUID NOT NULL REFERENCES torneos(id) ON DELETE CASCADE,
    cancha_id UUID REFERENCES canchas(id),
    participante1_id UUID NOT NULL REFERENCES participantes_torneo(id),
    participante2_id UUID NOT NULL REFERENCES participantes_torneo(id),
    fecha_programada TIMESTAMP WITH TIME ZONE,
    ronda VARCHAR(50), -- "cuartos", "semifinal", "final", etc.
    resultado JSONB, -- {"participante1": 2, "participante2": 1, "sets": [[6,4], [6,2]]}
    estado VARCHAR(20) DEFAULT 'programado' CHECK (estado IN ('programado', 'en_curso', 'finalizado', 'walkover', 'cancelado')),
    ganador_id UUID REFERENCES participantes_torneo(id),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices para consultas frecuentes
CREATE INDEX idx_reservas_fecha_inicio ON reservas(fecha_inicio);
CREATE INDEX idx_reservas_cancha_fecha ON reservas(cancha_id, fecha_inicio);
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_complejo ON reservas(complejo_id);

CREATE INDEX idx_clientes_telefono ON clientes(telefono);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_complejo ON clientes(complejo_id);

CREATE INDEX idx_pagos_reserva ON pagos(reserva_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);

CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_tipo ON productos(tipo);
CREATE INDEX idx_productos_estado ON productos(estado);

CREATE INDEX idx_notificaciones_cliente ON notificaciones(cliente_id);
CREATE INDEX idx_notificaciones_estado ON notificaciones(estado);
CREATE INDEX idx_notificaciones_programada ON notificaciones(programada_para);

CREATE INDEX idx_mensajes_whatsapp_telefono ON mensajes_whatsapp(telefono);
CREATE INDEX idx_mensajes_whatsapp_cliente ON mensajes_whatsapp(cliente_id);

-- ============================================
-- 10. TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ============================================

-- Función para actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a las tablas que lo necesiten
CREATE TRIGGER update_complejos_updated_at BEFORE UPDATE ON complejos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canchas_updated_at BEFORE UPDATE ON canchas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagos_updated_at BEFORE UPDATE ON pagos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. VISTAS PARA ANALÍTICAS
-- ============================================

-- Vista para ocupación de canchas
CREATE VIEW vista_ocupacion_canchas AS
SELECT 
    c.id as cancha_id,
    c.nombre as cancha_nombre,
    c.tipo_deporte,
    c.complejo_id,
    DATE(r.fecha_inicio) as fecha,
    COUNT(r.id) as reservas_dia,
    SUM(EXTRACT(EPOCH FROM (r.fecha_fin - r.fecha_inicio))/3600) as horas_ocupadas,
    AVG(r.precio_total) as precio_promedio
FROM canchas c
LEFT JOIN reservas r ON c.id = r.cancha_id 
    AND r.estado IN ('confirmada', 'finalizada')
GROUP BY c.id, c.nombre, c.tipo_deporte, c.complejo_id, DATE(r.fecha_inicio);

-- Vista para resumen de clientes
CREATE VIEW vista_resumen_clientes AS
SELECT 
    cl.id,
    cl.nombre,
    cl.apellido,
    cl.telefono,
    cl.complejo_id,
    COUNT(r.id) as total_reservas,
    SUM(r.precio_total) as total_gastado,
    MAX(r.fecha_inicio) as ultima_reserva,
    AVG(r.precio_total) as gasto_promedio
FROM clientes cl
LEFT JOIN reservas r ON cl.id = r.cliente_id
GROUP BY cl.id, cl.nombre, cl.apellido, cl.telefono, cl.complejo_id;

-- Vista para ingresos diarios
CREATE VIEW vista_ingresos_diarios AS
SELECT 
    r.complejo_id,
    DATE(r.fecha_inicio) as fecha,
    COUNT(r.id) as total_reservas,
    SUM(r.precio_total) as ingresos_reservas,
    SUM(tp.total) as ingresos_productos,
    SUM(r.precio_total) + COALESCE(SUM(tp.total), 0) as ingresos_totales
FROM reservas r
LEFT JOIN transacciones_productos tp ON r.id = tp.reserva_id
WHERE r.estado IN ('confirmada', 'finalizada')
GROUP BY r.complejo_id, DATE(r.fecha_inicio);

-- ============================================
-- 12. DATOS INICIALES DE EJEMPLO
-- ============================================

-- Insertar un complejo de ejemplo
INSERT INTO complejos (nombre, direccion, telefono, email, plan_suscripcion) 
VALUES ('Complejo Deportivo Demo', 'Av. Principal 123, Ciudad', '+54 11 1234-5678', 'info@complexdemo.com', 'premium');

-- Insertar categorías de productos básicas
INSERT INTO categorias_productos (complejo_id, nombre, descripcion) 
SELECT id, 'Bebidas', 'Bebidas y refrescos' FROM complejos WHERE nombre = 'Complejo Deportivo Demo'
UNION ALL
SELECT id, 'Equipamiento', 'Raquetas, pelotas y accesorios' FROM complejos WHERE nombre = 'Complejo Deportivo Demo'
UNION ALL
SELECT id, 'Indumentaria', 'Ropa deportiva y calzado' FROM complejos WHERE nombre = 'Complejo Deportivo Demo';

COMMIT;
