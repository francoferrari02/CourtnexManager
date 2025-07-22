# Courtnex Manager - Documentación del Esquema de Base de Datos

## Resumen del Diseño

El esquema de base de datos para **Courtnex Manager** está diseñado para soportar una solución integral de gestión de complejos deportivos con dos planes (Base y Premium). La base de datos utiliza PostgreSQL y está optimizada para escalabilidad y eficiencia.

## Estructura General

### 🏢 **Arquitectura Multi-Tenant**
- Cada complejo deportivo es independiente
- Los datos están segregados por `complejo_id`
- Soporte para múltiples complejos en la misma instancia

### 🔐 **Sistema de Usuarios y Permisos**
- **Superusuarios**: Dueños del complejo con acceso total
- **Empleados**: Usuarios con permisos limitados configurables
- Permisos granulares almacenados en formato JSONB

## Módulos Principales

### 1. **Gestión de Complejos y Usuarios**
- `complejos`: Información básica, horarios, plan de suscripción
- `usuarios`: Sistema de autenticación y autorización

### 2. **Gestión de Canchas**
- `canchas`: Canchas con coordenadas para mapa interactivo
- Estados en tiempo real (libre/ocupada/mantenimiento)
- Soporte para diferentes deportes y configuraciones

### 3. **Sistema de Reservas y Agenda**
- `reservas`: Reservas con soporte para recurrencia
- `lista_espera`: Sistema de cola para turnos no disponibles
- Estados de reserva y pago granulares

### 4. **Gestión de Clientes**
- `clientes`: Perfil completo con preferencias y etiquetas
- Sistema de puntos de fidelidad
- Historial de actividad

### 5. **Sistema de Pagos**
- `pagos`: Gestión completa de transacciones
- Integración con MercadoPago y otros métodos
- Seguimiento de estados y referencias externas

### 6. **Inventario y Productos**
- `productos`: Gestión de bebidas, equipamiento y indumentaria
- `transacciones_productos`: Ventas y alquileres
- `movimientos_stock`: Trazabilidad completa del inventario
- `categorias_productos`: Organización por categorías

### 7. **Sistema de Notificaciones**
- `notificaciones`: Sistema unificado de notificaciones
- `mensajes_whatsapp`: Bot de WhatsApp (Plan Premium)
- Soporte para múltiples canales (email, SMS, push)

### 8. **Gestión de Torneos**
- `torneos`: Organización de competencias
- `participantes_torneo`: Inscripciones y pagos
- `partidos_torneo`: Fixture y resultados

## Características Técnicas

### 🚀 **Optimización y Performance**
- Índices estratégicos en campos de consulta frecuente
- Vistas materializadas para analíticas
- Uso de JSONB para datos dinámicos y flexibles

### 📊 **Analíticas Integradas**
- Vistas precalculadas para reportes comunes
- Métricas de ocupación, ingresos y clientes
- Datos listos para dashboards

### 🔄 **Automatización**
- Triggers para timestamps automáticos
- Funciones para cálculos complejos
- Integridad referencial completa

## Relaciones Principales

```
complejos (1) → (*) usuarios
complejos (1) → (*) canchas
complejos (1) → (*) clientes
complejos (1) → (*) productos

clientes (1) → (*) reservas
canchas (1) → (*) reservas
reservas (1) → (*) pagos
reservas (1) → (*) transacciones_productos

torneos (1) → (*) participantes_torneo
participantes_torneo (*) → (*) partidos_torneo
```

## Escalabilidad

### 📈 **Diseño para Crecimiento**
- Soporte para miles de reservas diarias
- Particionado por fecha en tablas grandes
- Arquitectura preparada para sharding horizontal

### 🔧 **Flexibilidad**
- Campos JSONB para configuraciones dinámicas
- Sistema de permisos expandible
- Soporte para nuevos tipos de deportes y productos

## Seguridad

- Claves foráneas con cascada apropiada
- Validaciones a nivel de base de datos
- Campos de auditoría (created_at, updated_at)
- Soft delete con campos `activo`

## Próximos Pasos

1. **Ejecutar el script**: `psql -d courtnex_db -f database_schema.sql`
2. **Configurar conexión**: Actualizar credenciales en la aplicación
3. **Migrar datos**: Si existe información previa
4. **Configurar backups**: Estrategia de respaldo automático
5. **Monitoring**: Configurar alertas de performance

## Notas de Implementación

- Usar UUIDs para mayor seguridad y distribución
- Implementar soft delete en lugar de eliminación física
- Configurar conexión pool para mejor performance
- Considerar read replicas para consultas analíticas pesadas
