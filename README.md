# 📚 Explora UNISON - Sistema de Revista Académica

Sistema web completo para la gestión y visualización de contenido académico de la revista **Explora UNISON**. Incluye artículos científicos, noticias institucionales y videos educativos con panel administrativo para gestión de contenido.

![Stack Tecnológico](https://img.shields.io/badge/Frontend-React%2019-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![Base de Datos](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Deploy](https://img.shields.io/badge/Deploy-Railway%20%2B%20Vercel-000000)

## 🎓 Información Académica

**Proyecto de Servicio Social Universitario**  
Universidad de Sonora - Ingeniería en Sistemas de Información

**Responsable del proyecto:**  
Dra. Tatliana Mercedes Icedo Zamora

**Prestadores de SSU:**  
- **2024-2**: Lizardi Díaz Alan Gilberto, Miranda Díaz Luis Alberto  
- **2025-1**: Lizardi Díaz Alan Gilberto, Miranda Díaz Luis Alberto, Albino Espíndola Jesús David

---

## 🌟 Características Principales

### 📖 **Portal Público**
- Visualización de artículos académicos con descarga de PDFs
- Sección de noticias institucionales con imágenes
- Galería de videos educativos embebidos de YouTube
- Sistema de búsqueda avanzada
- Diseño responsive y moderno

### 🔐 **Panel Administrativo**
- Autenticación JWT segura
- Gestión CRUD completa de artículos, noticias y videos
- Upload de archivos PDF e imágenes
- Organización por volúmenes y números (artículos)
- Actualización automática de contenido sin recargar

### 🚀 **Tecnología**
- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Node.js + Express.js + JWT
- **Base de Datos**: PostgreSQL con connection pooling
- **Storage**: Base64/Bytea para archivos
- **Deploy**: Railway (Backend) + Vercel (Frontend)

---

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#-requisitos-del-sistema)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Instalación y Configuración](#-instalación-y-configuración)
4. [Variables de Entorno](#-variables-de-entorno)
5. [Base de Datos](#-base-de-datos)
6. [Desarrollo Local](#-desarrollo-local)
7. [Despliegue](#-despliegue)
8. [API Endpoints](#-api-endpoints)
9. [Migración a Otros Servicios](#-migración-a-otros-servicios)
10. [Solución de Problemas](#-solución-de-problemas)

---

## 🛠 Requisitos del Sistema

### **Mínimos**
- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior  
- **PostgreSQL**: v13.0 o superior
- **RAM**: 512MB disponible
- **Espacio**: 1GB de disco libre

### **Recomendados**
- **Node.js**: v20.0.0 o superior
- **npm**: v10.0.0 o superior
- **PostgreSQL**: v15.0 o superior
- **RAM**: 2GB disponible
- **Espacio**: 5GB de disco libre

---

## 📁 Estructura del Proyecto

```
exploraunison/
├── 📁 client/                          # Frontend React
│   ├── 📁 public/                      # Archivos estáticos
│   │   ├── logo_nobg.png              # Logo de la aplicación
│   │   └── vite.svg                   # Favicon de Vite
│   ├── 📁 src/
│   │   ├── 📁 components/              # Componentes reutilizables
│   │   │   ├── AddContentModal.jsx    # Modal gestión contenido
│   │   │   ├── AdminHeader.jsx        # Header del admin
│   │   │   ├── Header.jsx             # Header público
│   │   │   ├── Footer.jsx             # Footer del sitio
│   │   │   ├── Layout.jsx             # Layout principal
│   │   │   └── SearchInput.jsx        # Barra de búsqueda
│   │   ├── 📁 pages/                  # Páginas principales
│   │   │   ├── Home.jsx               # Página de inicio
│   │   │   ├── Articles.jsx           # Lista de artículos
│   │   │   ├── ArticlePage.jsx        # Vista individual artículo
│   │   │   ├── Noticias.jsx           # Lista de noticias
│   │   │   ├── NoticiaPage.jsx        # Vista individual noticia
│   │   │   ├── Videos.jsx             # Lista de videos
│   │   │   ├── Admin.jsx              # Panel de administración
│   │   │   └── AdminLoginPage.jsx     # Login administrativo
│   │   ├── 📁 services/               # Servicios API
│   │   │   └── contentService.js      # Comunicación con backend
│   │   ├── App.jsx                    # Componente raíz
│   │   └── main.jsx                   # Punto de entrada
│   ├── package.json                   # Dependencias frontend
│   ├── vite.config.js                 # Configuración Vite
│   ├── vercel.json                    # Config Vercel (eliminar si migras)
│   └── eslint.config.js               # Configuración ESLint
├── 📁 server/                         # Backend Node.js
│   ├── 📁 src/
│   │   ├── 📁 controllers/            # Lógica de negocio
│   │   │   ├── articuloController.js  # CRUD artículos
│   │   │   ├── noticiaController.js   # CRUD noticias  
│   │   │   ├── videoController.js     # CRUD videos
│   │   │   └── usuarioController.js   # Gestión usuarios
│   │   ├── 📁 middlewares/            # Middleware personalizado
│   │   │   └── validarToken.js        # Autenticación JWT
│   │   ├── 📁 models/                 # Modelos base de datos
│   │   │   ├── db.js                  # Conexión PostgreSQL
│   │   │   ├── articulo.js            # Modelo artículos
│   │   │   ├── noticia.js             # Modelo noticias
│   │   │   ├── video.js               # Modelo videos
│   │   │   ├── usuario.js             # Modelo usuarios
│   │   │   ├── volumen.js             # Modelo volúmenes
│   │   │   └── numero.js              # Modelo números
│   │   ├── 📁 routes/                 # Rutas API
│   │   │   ├── articuloRoutes.js      # Endpoints artículos
│   │   │   ├── noticiaRoutes.js       # Endpoints noticias
│   │   │   ├── videoRoutes.js         # Endpoints videos
│   │   │   └── usuarioRoutes.js       # Endpoints usuarios
│   │   ├── 📁 files/                  # Archivos temporales upload
│   │   └── app.js                     # Servidor principal Express
│   └── package.json                   # Dependencias backend
├── railway.json                       # Config Railway (eliminar si migras)
├── package.json                       # Scripts del workspace
└── README.md                          # Este archivo
```

---

## ⚙️ Instalación y Configuración

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/alanliz/exploraunison.git
cd exploraunison
```

### **2. Instalar Dependencias**

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

**Raíz (opcional - para scripts del workspace):**
```bash
cd ..
npm install
```

### **3. Configurar PostgreSQL**

**Opción A: PostgreSQL Local**
```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE exploraunison;
CREATE USER admin_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE exploraunison TO admin_user;
\q
```

**Opción B: PostgreSQL en la Nube**
- **Railway**: Crear servicio PostgreSQL desde el dashboard
- **Heroku**: Agregar addon Heroku Postgres
- **DigitalOcean**: Usar Managed Database

---

## 🔐 Variables de Entorno

### **Backend** (`server/.env`)
```env
# Base de datos
DATABASE_URL=postgresql://usuario:password@host:puerto/database
# Ejemplo local: postgresql://admin_user:tu_password@localhost:5432/exploraunison
# Ejemplo Railway: postgresql://postgres:xxx@containers.railway.app:5432/railway

# Configuración del servidor
NODE_ENV=development                    # development | production
PORT=4000                              # Puerto del servidor (Railway lo asigna automáticamente)

# Autenticación JWT
SECRET_KEY=tu_clave_secreta_muy_segura # Cambiar en producción (mín. 32 caracteres)
```

### **Frontend** (`client/.env`)
```env
# URL del backend
VITE_API_URL=http://localhost:4000     # Desarrollo local
# VITE_API_URL=https://tu-backend.railway.app  # Producción Railway
```

### **Ejemplo de URLs por Entorno**

| Entorno | Backend | Frontend | Ejemplo |
|---------|---------|----------|---------|
| **Desarrollo** | `http://localhost:4000` | `http://localhost:3000` | Local |
| **Railway + Vercel** | `https://tu-app.railway.app` | `https://tu-app.vercel.app` | Producción |
| **Heroku + Netlify** | `https://tu-app.herokuapp.com` | `https://tu-app.netlify.app` | Alternativo |

---

## 🗄️ Base de Datos

### **Schema SQL Requerido**

La aplicación requiere las siguientes tablas en PostgreSQL:

```sql
-- Tabla de usuarios (administradores)
CREATE TABLE usuarios (
    idusuario SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100), 
    correo VARCHAR(100)
);

-- Tabla de volúmenes (años de publicación)
CREATE TABLE volumenes (
    idvolumen SERIAL PRIMARY KEY,
    anio INTEGER NOT NULL UNIQUE
);

-- Tabla de números (ediciones por año)
CREATE TABLE numeros (
    idnumero SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    idvolumen INTEGER REFERENCES volumenes(idvolumen),
    UNIQUE(numero, idvolumen)
);

-- Tabla de artículos
CREATE TABLE articulos (
    idarticulo SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    resumen TEXT,
    nopaginas INTEGER,
    fecha DATE,
    documento BYTEA,              -- PDF en formato binario
    idusuario INTEGER REFERENCES usuarios(idusuario),
    idnumero INTEGER REFERENCES numeros(idnumero)
);

-- Tabla de noticias
CREATE TABLE noticias (
    idnoticia SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    resumen TEXT,
    contenido TEXT,
    foto BYTEA,                   -- Imagen en formato binario
    fechanoticia DATE,
    idusuario INTEGER REFERENCES usuarios(idusuario)
);

-- Tabla de videos
CREATE TABLE videos (
    idvideo SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT,
    ruta VARCHAR(255),            -- ID del video de YouTube
    idusuario INTEGER REFERENCES usuarios(idusuario)
);

-- Crear usuario administrador inicial
INSERT INTO usuarios (username, password, nombre, apellido, correo) 
VALUES ('admin', '$2b$10$ejemplo_hash_password', 'Administrador', 'Sistema', 'admin@unison.mx');
```

### **Crear Usuario Administrador**

```bash
# Usar bcrypt para generar hash de password
node -e "console.log(require('bcrypt').hashSync('tu_password', 10))"

# Insertar en la base de datos (reemplazar HASH_GENERADO)
psql -d exploraunison -c "INSERT INTO usuarios (username, password, nombre, apellido, correo) VALUES ('admin', 'HASH_GENERADO', 'Admin', 'Sistema', 'admin@unison.mx');"
```

---

## 💻 Desarrollo Local

### **Ejecutar en Modo Desarrollo**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev        # Inicia con nodemon en puerto 4000
```

**Terminal 2 - Frontend:**
```bash
cd client  
npm run dev        # Inicia Vite dev server en puerto 3000
```

### **Verificar Funcionamiento**

1. **Backend**: http://localhost:4000/health
   ```json
   {"status":"OK","timestamp":"2025-01-04T..."}
   ```

2. **Frontend**: http://localhost:3000
   - Debe cargar la página principal
   - Verificar que no hay errores de CORS

3. **Admin**: http://localhost:3000/admin-login
   - Usar credenciales del usuario creado
   - Verificar acceso al panel administrativo

### **Scripts Disponibles**

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con hot reload |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build local |
| `npm run lint` | Linting con ESLint |
| `npm start` | Servidor producción (solo backend) |

---

## 🚀 Despliegue

### **Opción 1: Railway + Vercel (Actual)**

**Backend en Railway:**
1. Conectar repositorio en railway.app
2. Configurar variables de entorno
3. Railway detecta automáticamente `railway.json`
4. Deploy automático en cada push

**Frontend en Vercel:**
1. Conectar repositorio en vercel.com  
2. Configurar `VITE_API_URL` apuntando a Railway
3. Vercel detecta automáticamente el proyecto Vite
4. Deploy automático en cada push

### **Opción 2: Heroku + Netlify**

**Backend en Heroku:**
```bash
# Crear Procfile en la raíz
echo "web: node server/src/app.js" > Procfile

# Deploy
heroku create tu-app-backend
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
heroku config:set SECRET_KEY=tu_clave_secreta
git push heroku main
```

**Frontend en Netlify:**
```toml
# netlify.toml
[build]
  publish = "client/dist"
  command = "cd client && npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Opción 3: DigitalOcean App Platform**

```yaml
# .do/app.yaml
name: exploraunison
services:
- name: backend
  source_dir: server
  github:
    repo: tu-usuario/exploraunison
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: "production"
  - key: DATABASE_URL
    value: "${db.DATABASE_URL}"
- name: frontend
  source_dir: client
  github:
    repo: tu-usuario/exploraunison
    branch: main
  build_command: npm run build
  output_dir: dist
  envs:
  - key: VITE_API_URL
    value: "${backend.DOMAIN}"
databases:
- name: db
  engine: PG
  version: "15"
```

---

## 📡 API Endpoints

### **Autenticación**
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/login` | Login administrativo | ❌ |
| GET | `/api/validate-token` | Validar token JWT | ✅ |

### **Artículos**
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/articulos` | Listar artículos | ❌ |
| POST | `/api/articulos/upload` | Subir artículo con PDF | ✅ |
| PUT | `/api/articulos/:id` | Actualizar artículo | ✅ |
| GET | `/api/articulos/file/:filename` | Descargar PDF | ❌ |
| GET | `/api/articulos/volumenes` | Listar años disponibles | ❌ |
| GET | `/api/articulos/numeros` | Listar números por año | ❌ |
| POST | `/api/articulos/resolve-numero` | Resolver ID de número | ✅ |

### **Noticias**
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/noticias` | Listar noticias | ❌ |
| POST | `/api/noticias/upload` | Subir noticia con imagen | ✅ |
| GET | `/api/noticias/portada/:id` | Obtener imagen de portada | ❌ |

### **Videos**
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/videos` | Listar videos | ❌ |
| POST | `/api/videos` | Crear video | ✅ |

### **Sistema**
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | ❌ |

---

## 🔄 Migración a Otros Servicios

### **Archivos a Eliminar/Modificar**

**Eliminar configuraciones específicas:**
```bash
rm railway.json           # Solo para Railway
rm client/vercel.json     # Solo para Vercel
```

**Crear configuraciones nuevas según destino:**

| Servicio | Archivo Requerido | Contenido |
|----------|-------------------|-----------|
| **Heroku** | `Procfile` | `web: node server/src/app.js` |
| **Netlify** | `netlify.toml` | Build config para SPA |
| **AWS** | `amplify.yml` | Build spec para Amplify |
| **Google Cloud** | `Dockerfile` | Container config |

### **Variables de Entorno por Servicio**

| Variable | Railway | Heroku | Vercel | Netlify |
|----------|---------|--------|--------|---------|
| DATABASE_URL | ✅ Auto | ✅ Addon | ❌ N/A | ❌ N/A |
| PORT | ✅ Auto | ✅ Auto | ❌ N/A | ❌ N/A |  
| NODE_ENV | ✅ Manual | ✅ Manual | ❌ N/A | ❌ N/A |
| SECRET_KEY | ✅ Manual | ✅ Manual | ❌ N/A | ❌ N/A |
| VITE_API_URL | ❌ N/A | ❌ N/A | ✅ Manual | ✅ Manual |

### **Checklist de Migración**

- [ ] Exportar datos de PostgreSQL actual
- [ ] Configurar nueva base de datos en servicio destino
- [ ] Importar schema y datos
- [ ] Configurar variables de entorno
- [ ] Actualizar CORS origins en `app.js`
- [ ] Actualizar `VITE_API_URL` frontend
- [ ] Crear archivos de configuración específicos
- [ ] Probar deploy en entorno de staging
- [ ] Actualizar DNS si es necesario

---

## 🛠 Solución de Problemas

### **Errores Comunes**

**1. Error de CORS**
```
Access to fetch at 'https://backend.railway.app' from origin 'https://frontend.vercel.app' has been blocked by CORS policy
```
**Solución:**
```javascript
// server/src/app.js - Línea ~68
origin: process.env.NODE_ENV === 'production'
  ? 'https://TU-FRONTEND-CORRECTO.vercel.app'  // ⬅️ Actualizar esta URL
  : '*',
```

**2. Error de Conexión BD**
```
Error: getaddrinfo ENOTFOUND containers.railway.app
```
**Solución:**
- Verificar `DATABASE_URL` en variables de entorno
- Confirmar que la BD de Railway está activa
- Revisar firewall/conexiones de red

**3. Token JWT Inválido**
```
{"error":"Token inválido"}
```
**Solución:**
- Verificar que `SECRET_KEY` es igual en backend y generación
- Confirmar que el token no ha expirado (2h por defecto)
- Revisar formato del header: `Authorization: Bearer <token>`

**4. Upload de Archivos Falla**
```
Error: ENOENT: no such file or directory, open 'server/src/files'
```
**Solución:**
```bash
# Crear directorio manualmente si no existe
mkdir -p server/src/files
```

**5. Build Frontend Falla**
```
Error: Environment variable VITE_API_URL is not defined
```
**Solución:**
```bash
# Desarrollo
echo "VITE_API_URL=http://localhost:4000" > client/.env

# Producción (Vercel)
# Configurar en dashboard: VITE_API_URL=https://tu-backend.railway.app
```

### **Comandos de Debugging**

**Verificar conectividad backend:**
```bash
curl https://tu-backend.railway.app/health
# Debe retornar: {"status":"OK","timestamp":"..."}
```

**Verificar logs Railway:**
```bash
# En dashboard Railway > tu-servicio > Logs
# Buscar errores de conexión o startup
```

**Verificar variables de entorno:**
```bash
# Backend
node -e "console.log(process.env.DATABASE_URL ? 'DB OK' : 'DB Missing')"
node -e "console.log(process.env.SECRET_KEY ? 'Secret OK' : 'Secret Missing')"

# Frontend  
npm run build  # Si falla, revisar VITE_API_URL
```

**Test de endpoints:**
```bash
# Health check
curl https://tu-backend.railway.app/health

# Artículos públicos
curl https://tu-backend.railway.app/api/articulos

# Login (cambiar credenciales)
curl -X POST https://tu-backend.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"tu_password"}'
```

---

## 👥 Contribuir

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`  
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0