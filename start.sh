#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎾 CourtnexManager - Iniciando Sistema Completo${NC}"
echo "================================================="

# Verificar que PostgreSQL esté corriendo
echo -e "${YELLOW}📊 Verificando PostgreSQL...${NC}"
if pg_isready -q; then
    echo -e "${GREEN}✅ PostgreSQL está funcionando${NC}"
else
    echo -e "${RED}❌ PostgreSQL no está funcionando. Iniciando PostgreSQL...${NC}"
    brew services start postgresql
    sleep 2
fi

# Verificar base de datos
echo -e "${YELLOW}🗄️ Verificando base de datos courtnex_db...${NC}"
if psql -d courtnex_db -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✅ Base de datos courtnex_db existe${NC}"
else
    echo -e "${RED}❌ Base de datos no existe. Creándola...${NC}"
    createdb courtnex_db
    psql -d courtnex_db -f database/database_schema.sql
fi

# Verificar datos de ejemplo
echo -e "${YELLOW}📋 Verificando datos de ejemplo...${NC}"
COMPLEJO_COUNT=$(psql -d courtnex_db -t -c "SELECT COUNT(*) FROM complejos;" | xargs)
if [ "$COMPLEJO_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Hay $COMPLEJO_COUNT complejo(s) en la base de datos${NC}"
else
    echo -e "${YELLOW}⚠️ No hay datos. Los datos de ejemplo se crearán automáticamente.${NC}"
fi

echo -e "${BLUE}🚀 Iniciando Backend y Frontend...${NC}"
echo "================================================="
echo -e "${YELLOW}Backend estará en: http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend estará en: http://localhost:3001${NC}"
echo "================================================="
echo -e "${GREEN}Presiona Ctrl+C para detener todos los servicios${NC}"
echo ""

# Iniciar backend y frontend simultáneamente
npm run dev
