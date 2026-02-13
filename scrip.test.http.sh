#!/bin/bash

# Script para probar el rate limiting de la API usando HTTPie

echo "🧪 Probando Rate Limiting de la API Groq"
echo "=========================================="
echo ""

# Verificar si HTTPie está instalado
if ! command -v http &>/dev/null; then
    echo "❌ HTTPie no está instalado."
    echo "📦 Instálalo con: sudo apt install httpie"
    echo "   o: pip install httpie"
    exit 1
fi

# URL base
BASE_URL="http://localhost:3000"

# Test 1: Probar límite de chat (20 por minuto)
echo "📝 Test 1: Enviando 22 peticiones al endpoint de chat..."
echo "Límite esperado: 20 peticiones por minuto"
echo ""

for i in {1..22}; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📤 Petición $i de 22"
    echo ""

    # Usar HTTPie con formato compacto
    RESPONSE=$(http --check-status --ignore-stdin --timeout=5 \
        POST "$BASE_URL/api/groq/chat" \
        message="Test número $i" \
        2>&1)

    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
        echo "✅ Petición $i: OK (200)"
    elif echo "$RESPONSE" | grep -q "429"; then
        echo "❌ Petición $i: LÍMITE EXCEDIDO (429)"
        echo ""
        echo "📋 Respuesta del servidor:"
        http --print=b POST "$BASE_URL/api/groq/chat" message="Test" 2>/dev/null || true
        echo ""
        echo "🛑 Límite alcanzado después de $((i - 1)) peticiones exitosas"
        break
    else
        echo "⚠️  Petición $i: Error (código $EXIT_CODE)"
    fi

    # Pequeña pausa entre peticiones
    sleep 0.1
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Prueba completada"
echo ""
echo "💡 Tips:"
echo "   • Espera 1 minuto y vuelve a probar para verificar el reseteo"
echo "   • Usa 'http :3000/api/groq/chat message=\"hola\"' para probar manualmente"
echo "   • Revisa los headers con: http --headers POST :3000/api/groq/chat message=\"test\""
