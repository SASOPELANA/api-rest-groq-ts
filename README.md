# API REST con Groq AI - Chat y Transcripción de Audio

## Descripción

API REST desarrollada con Node.js, Express Y TypeScript que permite interactuar con los modelos de inteligencia artificial de Groq. Proporciona dos funcionalidades principales:

- **Chat con IA**: Utiliza el modelo Llama 3.3 70B Versatile para conversaciones y generación de texto.
- **Transcripción de Audio**: Utiliza el modelo Whisper Large V3 para convertir archivos de audio a texto.

La API implementa rate limiting para protección contra abuso, validación de datos con express-validator, manejo robusto de errores y soporte CORS para integración con aplicaciones frontend.

## Demo en Producción

El proyecto está desplegado y disponible en Vercel:

**URL de producción:** [https://tu-proyecto.vercel.app](https://tu-proyecto.vercel.app)

> Puedes probar los endpoints directamente desde la URL de producción. Recuerda respetar los límites de rate limiting.

## Pre requisitos

- Node.js (v18 o superior)
- pnpm
- Cuenta en [Groq Cloud](https://console.groq.com/) para obtener API Key

## Instalación

1. Clonar el repositorio.

2. Instalar pnpm si no lo tienes instalado.

```bash
npm install -g pnpm
```

1. Instalar dependencias.

```bash
pnpm install
```

1. Configurar variables de entorno:

Copia el archivo `axample.env` y renómbralo a `.env`. Luego, completa los valores requeridos.

```bash
cp axample.env .env
```

Las variables de entorno son las siguientes:

- `PORT`: Puerto en el que correrá el servidor (por defecto: 3000).
- `URL_GROQ_API`: URL de la API de Groq para chat completions.
- `GROQ_API_KEY`: Tu clave de API de Groq (obtenerla en [console.groq.com](https://console.groq.com/)).
- `URL_AUDIO_GROQ_API`: URL de la API de Groq para transcripciones de audio.

### Ejemplo de archivo .env

```env
PORT=3000
URL_GROQ_API=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=gsk_tu_api_key_aqui
URL_AUDIO_GROQ_API=https://api.groq.com/openai/v1/audio/transcriptions
```

> **Importante:** Nunca subas el archivo `.env` a tu repositorio. El archivo `.gitignore` ya está configurado para protegerlo.

## Uso

### Ejecutar en modo desarrollo

```bash
pnpm run dev
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado en `.env`).

### Ejecutar en modo producción

```bash
pnpm start
```

## Documentación de la API

### Endpoint de Información

#### Obtener información de la API

- **GET** `/`
- **Descripción:** Devuelve información básica sobre la API.
- **Autenticación:** No requerida
- **Respuesta de ejemplo:**

```json
{
  "message": "API GROQ IA - CHAT",
  "author": "Sergio Devs",
  "version": "1.0.0",
  "date": "2026-02-12T21:00:00.000Z"
}
```

### Endpoints de Chat

#### Enviar mensaje al modelo de chat

- **POST** `/api/groq/chat`
- **Descripción:** Envía un mensaje al modelo Llama 3.3 70B Versatile y recibe una respuesta generada por IA.
- **Autenticación:** No requerida
- **Rate Limit:** 20 peticiones por minuto
- **Body (JSON):**

```json
{
  "message": "¿Qué día es hoy?"
}
```

- **Validaciones:**
  - `message`: Campo requerido, no puede estar vacío, debe ser una cadena de texto.

- **Respuesta exitosa (200):**

```json
{
  "message": "Hoy es miércoles 12 de febrero de 2026."
}
```

- **Respuesta de error - Validación (400):**

```json
{
  "errors": [
    {
      "msg": "El campo 'message' es requerido",
      "param": "message",
      "location": "body"
    }
  ]
}
```

- **Respuesta de error - Rate Limit (429):**

```json
{
  "error": "Límite de chat excedido",
  "message": "Has alcanzado el límite de 20 mensajes por minuto. Espera un momento antes de continuar.",
  "retryAfter": "1 minuto",
  "resetTime": "2026-02-12T21:01:00.000Z"
}
```

- **Respuesta de error - Servidor (500):**

```json
{
  "error": "Error interno del servidor."
}
```

### Endpoints de Audio

#### Transcribir archivo de audio

- **POST** `/api/groq/audio`
- **Descripción:** Transcribe un archivo de audio a texto utilizando el modelo Whisper Large V3.
- **Autenticación:** No requerida
- **Rate Limit:** 5 peticiones por minuto
- **Content-Type:** `multipart/form-data`
- **Parámetros:**
  - `file` (form-data, requerido): Archivo de audio a transcribir.

- **Formatos soportados:**
  - `audio/mpeg` (MP3)
  - `audio/ogg` (OGG)
  - `audio/wav` (WAV)
  - `audio/webm` (WEBM)
  - `audio/flac` (FLAC)
  - `audio/x-m4a` (M4A)

- **Límite de tamaño:** 25 MB

- **Respuesta exitosa (200):**

```json
{
  "text": "Hola, este es un ejemplo de transcripción de audio."
}
```

- **Respuesta de error - Archivo no proporcionado (400):**

```json
{
  "error": "No se ha proporcionado un archivo de audio."
}
```

- **Respuesta de error - Formato no soportado (400):**

```json
{
  "message": "Error de procesamiento de archivo",
  "details": "Formato de audio no soportado. Usa mp3, ogg, wav o webm."
}
```

- **Respuesta de error - Archivo muy grande (400):**

```json
{
  "message": "Error en la subida del archivo de audio",
  "details": "File too large"
}
```

- **Respuesta de error - Rate Limit (429):**

```json
{
  "error": "Límite de transcripción excedido",
  "message": "Has alcanzado el límite de 5 transcripciones por minuto. El procesamiento de audio consume muchos recursos.",
  "retryAfter": "1 minuto",
  "resetTime": "2026-02-12T21:01:00.000Z"
}
```

## Rate Limiting

La API implementa varios niveles de protección mediante rate limiting para prevenir abuso y garantizar la disponibilidad del servicio.

### Límites Configurados

| Tipo | Límite | Ventana de Tiempo | Endpoints Afectados |
| ---- | ------ | ----------------- | ------------------- |
| Global | 100 peticiones | 15 minutos | Todos |
| Chat | 20 peticiones | 1 minuto | `/api/groq/chat` |
| Audio | 5 peticiones | 1 minuto | `/api/groq/audio` |

> **Nota:** El límite de audio es más restrictivo debido al mayor consumo de recursos en el procesamiento de archivos.

### Headers de Rate Limit

Cada respuesta incluye headers informativos sobre el estado del rate limiting:

```http
RateLimit-Limit: 20
RateLimit-Remaining: 15
RateLimit-Reset: 1644696060
```

- `RateLimit-Limit`: Número máximo de peticiones permitidas en la ventana de tiempo.
- `RateLimit-Remaining`: Número de peticiones restantes en la ventana actual.
- `RateLimit-Reset`: Timestamp Unix indicando cuándo se resetea el contador.

### Códigos de Estado HTTP

| Código | Descripción |
| ------ | ----------- |
| 200 | Petición exitosa |
| 400 | Error de validación o datos incorrectos |
| 404 | Endpoint no encontrado |
| 429 | Límite de peticiones excedido |
| 500 | Error interno del servidor |

## Pruebas

### Usando el archivo test.http

Si usas Visual Studio Code con la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client), puedes usar el archivo `test.http` incluido en el proyecto:

```http
### Probar endpoint de chat
POST http://localhost:3000/api/groq/chat
Content-Type: application/json

{
  "message": "Hola, ¿cómo estás?"
}

### Probar endpoint de audio
POST http://localhost:3000/api/groq/audio
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="audio.ogg"
Content-Type: audio/ogg

< /ruta/a/tu/audio.ogg

------WebKitFormBoundary--
```

### Usando HTTPie

HTTPie es una herramienta de línea de comandos amigable para hacer peticiones HTTP.

**Instalación:**

```bash
sudo apt install httpie
# o
pip install httpie
```

**Ejemplos de uso:**

```bash
# Probar endpoint de chat
http POST :3000/api/groq/chat message="Hola, ¿cómo estás?"

# Ver headers de rate limit
http --headers POST :3000/api/groq/chat message="test"

# Probar endpoint de audio
http --form POST :3000/api/groq/audio file@/ruta/a/tu/audio.ogg
```

### Script de prueba de Rate Limiting

El proyecto incluye un script bash para probar el rate limiting:

```bash
./test-rate-limit.sh
```

Este script enviará 22 peticiones consecutivas al endpoint de chat y mostrará cuándo se alcanza el límite de 20 peticiones por minuto.

**Requisito:** HTTPie debe estar instalado.

## Estructura del Proyecto

```text
groq-ia/
├── src/
│   ├── app.js                    # Configuración de Express
│   ├── controllers/              # Lógica de controladores
│   │   ├── groq.controller.js
│   │   └── index.controller.js
│   ├── services/                 # Comunicación con API externa
│   │   ├── groq.service.js
│   │   └── index.service.js
│   ├── routes/                   # Definición de rutas
│   │   ├── groq.routes.js
│   │   └── index.router.js
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── rateLimiter.middleware.js
│   │   ├── multerErrorHandler.middleware.js
│   │   └── notFount.middleware.js
│   └── utils/                    # Utilidades
│       ├── upload.multer.js
│       └── validator.util.js
├── server.js                     # Punto de entrada
├── .env                          # Variables de entorno (NO SUBIR A GIT)
├── .gitignore                    # Archivos ignorados por Git
├── axample.env                   # Ejemplo de variables de entorno
├── package.json
├── test.http                     # Pruebas con REST Client
├── test-rate-limit.sh            # Script de prueba de rate limiting
└── README.md
```

## Seguridad

La API implementa las siguientes medidas de seguridad:

- **Protección de credenciales**: API Key almacenada en variables de entorno, nunca en el código.
- **Rate limiting**: Protección contra abuso y ataques de denegación de servicio.
- **Validación de entrada**: Todos los datos de entrada son validados antes de procesarse.
- **CORS configurado**: Control de acceso desde diferentes orígenes.
- **Límites de tamaño de archivo**: Máximo 25MB para archivos de audio.
- **Filtrado de tipos de archivo**: Solo se aceptan formatos de audio válidos.

### Recomendaciones de Seguridad

1. **Nunca subas el archivo `.env` a Git**: El archivo `.gitignore` ya está configurado para protegerlo.
2. **Rota tu API Key periódicamente**: Genera nuevas claves en [console.groq.com](https://console.groq.com/).
3. **Usa HTTPS en producción**: Configura certificados SSL/TLS en tu servidor.
4. **Monitorea el uso**: Revisa los logs para detectar patrones de abuso.

## Deployment en Vercel

Este proyecto está desplegado en [Vercel](https://vercel.com/), una plataforma de hosting optimizada para aplicaciones Node.js.

### Pasos para desplegar

1. Crea una cuenta en [Vercel](https://vercel.com/) si no tienes una.

2. Instala Vercel CLI:

```bash
npm install -g vercel
```

1. Inicia sesión en Vercel:

```bash
vercel login
```

1. Despliega el proyecto:

```bash
vercel
```

1. Configura las variables de entorno en el dashboard de Vercel:
   - `GROQ_API_KEY`: Tu API Key de Groq
   - `URL_GROQ_API`: `https://api.groq.com/openai/v1/chat/completions`
   - `URL_AUDIO_GROQ_API`: `https://api.groq.com/openai/v1/audio/transcriptions`

2. Vercel se encargará automáticamente de:
   - Construir y desplegar tu aplicación
   - Asignar un dominio HTTPS
   - Configurar el entorno de producción

> **Nota:** Vercel detectará automáticamente que es un proyecto Node.js y configurará el entorno adecuadamente.

### Deploy automático desde GitHub

1. Conecta tu repositorio de GitHub a Vercel desde el dashboard
2. Cada push a la rama `main` desplegará automáticamente
3. Los pull requests generarán previews automáticas

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución de JavaScript
- **Express** - Framework web minimalista
- **Groq API** - Modelos de IA (Llama 3.3 70B, Whisper Large V3)
- **Axios** - Cliente HTTP para peticiones a APIs externas
- **Multer** - Middleware para manejo de archivos multipart/form-data
- **Express Validator** - Validación de datos de entrada
- **Express Rate Limit** - Middleware de rate limiting
- **Morgan** - Logger de peticiones HTTP
- **Dotenv** - Gestión de variables de entorno
- **CORS** - Middleware para habilitar CORS
- **Form Data** - Construcción de formularios multipart para Node.js

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Autor

Sergio Devs

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al autor.
