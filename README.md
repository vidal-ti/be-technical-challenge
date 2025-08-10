# BE Technical Challenge

Backend desarrollado con Node.js, Express.js y TypeScript, siguiendo buenas prácticas de arquitectura limpia, validaciones, manejo de errores y documentación con Swagger.

Este proyecto expone una API REST para gestionar tareas, incluyendo autenticación con JWT y operaciones CRUD completas.

---

## Requisitos previos

- Node.js **>=18**
- npm **>=9**
- Git instalado
- Firebase CLI instalado y autenticado:

```bash
npm install -g firebase-tools
firebase login
```

---

## Estructura del proyecto

```
functions/
├── src/
│   ├── application/        # Casos de uso y lógica de negocio
│   ├── domain/              # Modelos y entidades
│   ├── infrastructure/      # Integraciones externas y repositorios
│   ├── presentation/        # Controladores, middlewares y rutas
│   │    ├── routes/         # Definición de endpoints con Swagger
│   │    ├── controllers/    # Lógica para manejar requests/responses
│   │    ├── middlewares/    # Autenticación, validaciones, errores
│   ├── index.ts             # Configuración principal de Express y Swagger
├── package.json
├── tsconfig.json
└── ...
```

## Configuración del Proyecto

Crear un archivo `.env` dentro de `functions/` con las variables necesarias:

```env
PORT=
JWT_SECRET=
NODE_ENV=
FIREBASE_SERVICE_ACCOUNT=
```

**Nota:** En Cloud Functions no necesitas `FIREBASE_SERVICE_ACCOUNT`, ya que `admin.initializeApp()` se encarga de la autenticación automática.

## Instalación

1. **Clonar el repositorio:**

```bash
git clone <url-repositorio>
cd <carpeta-proyecto>
```

2. **Instalar dependencias:**

```bash
npm install
```

## Ejecución del Proyecto

```bash
# Modo desarrollo con reinicio automático
npm run start:dev

# Modo producción (compilado)
npm run build
npm run start:prod
```

**El servidor estará disponible en:**
- Aplicación: http://localhost:3000
- Documentación Swagger local: http://localhost:3000/docs

## Despliegue en Firebase Functions

1. **Compilar el proyecto:**

```bash
npm run build
```

2. **Desplegar solo la función api:**

```bash
firebase deploy --only functions:api
```

## Pruebas

La documentación de Swagger incluye ejemplos y permite ejecutar los endpoints directamente desde el navegador.

**Flujo de prueba recomendado:**

1. **Registrar usuario** → `POST /api/auth/register`
2. **Iniciar sesión** → `POST /api/auth/login` → obtener token JWT
3. **Autorizar en Swagger** usando el token (botón "Authorize")
4. **Probar endpoints de Tasks:**
   - `GET /api/tasks`
   - `POST /api/tasks`
   - `PUT /api/tasks/{id}`
   - `DELETE /api/tasks/{id}`

## Notas

- La autenticación es obligatoria para todas las rutas de tareas.
- El token JWT debe enviarse en el encabezado: `Authorization: Bearer <token>`
- La API sigue el estándar OpenAPI 3.0 y está documentada para facilitar la integración.