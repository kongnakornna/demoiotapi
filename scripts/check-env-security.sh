#!/bin/bash

# Script to check for common security issues in .env files

echo "🔍 Checking environment file security..."

# Check if .env is in .gitignore
if ! grep -q "^\.env$" .gitignore; then
    echo "⚠️  WARNING: .env is not in .gitignore!"
fi

# Check for weak passwords
if grep -qE "(password|secret|key)=(123|admin|test|pass)" .env 2>/dev/null; then
    echo "⚠️  WARNING: Weak passwords detected in .env"
fi

# Check for exposed credentials
if grep -qE "[a-zA-Z0-9]{20,}" .env 2>/dev/null; then
    echo "✅ Credentials appear to be present"
else
    echo "⚠️  WARNING: No credentials found - using defaults?"
fi

# Check file permissions
if [ -f .env ]; then
    PERMS=$(stat -c %a .env 2>/dev/null || stat -f %A .env)
    if [ "$PERMS" != "600" ] && [ "$PERMS" != "400" ]; then
        echo "⚠️  WARNING: .env has insecure permissions ($PERMS)"
        echo "   Run: chmod 600 .env"
    fi
fi

echo "✅ Security check complete!"
