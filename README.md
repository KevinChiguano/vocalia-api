# ⚽ Vocalia API

Backend para la **gestión de torneos de fútbol**, incluyendo partidos, vocalías, goles y estadísticas.

El proyecto está diseñado con una **arquitectura en capas**, orientada a facilitar el mantenimiento, la escalabilidad y una correcta documentación técnica del sistema.

Este backend forma parte de un **proyecto de tesis** y también se desarrolla como **proyecto personal / portafolio**.

---

## 🧩 Tecnologías utilizadas

- Node.js (18+)
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Zod (validaciones)
- JSON Web Token (JWT)
- Argon2 (hashing)
- Vitest (pruebas unitarias)
- Docker (Redis)

---

## 🏗️ Arquitectura

El sistema sigue una **arquitectura en capas**, separando responsabilidades de forma clara:

```
Controller → Service → Repository
```

- **Controller**: recibe las peticiones HTTP y retorna las respuestas.
- **Service**: contiene la lógica de negocio y las reglas del dominio.
- **Repository**: gestiona el acceso a datos mediante Prisma ORM.

Adicionalmente, el sistema incluye:

- Middlewares de validación y seguridad
- Uso de transacciones Prisma en operaciones críticas
- Caché con Redis para optimizar consultas de estadísticas

---

## 📁 Estructura del proyecto

```txt
src/
├─ modules/
│  ├─ tournaments/
│  │  ├─ tournament.controller.ts
│  │  ├─ tournament.service.ts
│  │  ├─ tournament.repository.ts
│  │  ├─ tournament.routes.ts
│  │  └─ tournament.schema.ts
│  └─ ...
├─ config/
├─ middlewares/
├─ utils/
└─ server.ts
```

Cada módulo sigue la misma estructura, lo que facilita la escalabilidad y el mantenimiento del código.

---

## ⚙️ Requisitos previos

- Node.js **18 o superior**
- PostgreSQL (entorno local)
- Redis (local o mediante Docker)

---

## 🚀 Instalación y ejecución

### 1️⃣ Instalar dependencias

```bash
npm install
```

### 2️⃣ Levantar Redis con Docker

```bash
docker-compose up -d
```

### 3️⃣ Configurar la base de datos

Ejecutar las migraciones de Prisma:

```bash
npx prisma migrate dev
```

Opcionalmente, abrir Prisma Studio:

```bash
npx prisma studio
```

### 4️⃣ Ejecutar el servidor en desarrollo

```bash
npm run dev
```

---

## 🧪 Pruebas

Ejecutar pruebas unitarias:

```bash
npm test
```

Ejecutar pruebas en modo ejecución directa:

```bash
npm run test:run
```

---

## 📚 Documentación

### 🔹 Endpoints (Swagger / OpenAPI)

> **Pendiente de implementación**  
> Estará disponible en:
>
> `http://localhost:PORT/api/docs`

### 🔹 Documentación técnica y lógica de negocio

Disponible en la carpeta `/docs`:

- `docs/architecture.md`
- `docs/modules/`
- `docs/testing.md`
- `docs/decisions.md`
