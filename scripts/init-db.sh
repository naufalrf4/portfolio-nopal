#!/bin/bash
set -e

# Initialize PostgreSQL database for NaufalRF Portfolio
# This script runs on first container startup

echo "Initializing PostgreSQL database..."

# Enable necessary extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID generation
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Enable full-text search
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Enable case-insensitive text type
    CREATE EXTENSION IF NOT EXISTS "citext";
    
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$POSTGRES_USER";
EOSQL

echo "PostgreSQL database initialized successfully!"
