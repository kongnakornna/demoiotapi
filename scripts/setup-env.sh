#!/bin/bash

# Script to setup environment files
# Usage: ./scripts/setup-env.sh [development|production|test]

ENV_TYPE=${1:-development}

echo "Setting up environment for: $ENV_TYPE"

if [ "$ENV_TYPE" = "production" ]; then
    if [ ! -f .env.production ]; then
        echo "Error: .env.production not found"
        exit 1
    fi
    cp .env.production .env
    echo "Production environment configured"
    
elif [ "$ENV_TYPE" = "test" ]; then
    if [ ! -f .env.test ]; then
        echo "Creating test environment from example..."
        cp .env.example .env.test
    fi
    cp .env.test .env
    echo "Test environment configured"
    
else
    if [ ! -f .env ]; then
        echo "Creating development environment from example..."
        cp .env.example .env
        echo "⚠️  Please update .env with your actual credentials"
    fi
    echo "Development environment configured"
fi

echo "✅ Environment setup complete!"
