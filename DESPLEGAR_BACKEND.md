# Desplegar Backend en Render - URGENTE

## Problema Actual
❌ **Tu backend NO está desplegado** - solo corre en tu computadora local
❌ Las respuestas se pierden cuando apagas tu PC
❌ El frontend apunta a `localhost:8000` que solo funciona localmente

## Solución: Desplegar Backend + Base de Datos PostgreSQL

### Pasos para Desplegar:

## 1. Preparar el Código
Los archivos ya están actualizados:
- ✅ `render.yaml` - Configuración para backend + PostgreSQL
- ✅ `backend/requirements.txt` - Agregado soporte PostgreSQL
- ✅ `backend/main.py` - Soporte para PostgreSQL y SQLite

## 2. Subir los Cambios a GitHub
```bash
git add .
git commit -m "Agregar backend y PostgreSQL para Render"
git push origin main
```

## 3. Desplegar en Render

### Opción A: Usar render.yaml (Recomendado)
1. Ve a tu Dashboard de Render: https://dashboard.render.com
2. Click en **"New +"** → **"Blueprint"**
3. Conecta tu repositorio de GitHub
4. Render detectará el `render.yaml` automáticamente
5. Click en **"Apply"**
6. Espera que se creen 3 recursos:
   - `encuesta-db` (PostgreSQL)
   - `encuesta-backend` (Web Service)
   - `encuesta-frontend` (Static Site)

### Opción B: Manual (Si blueprint falla)

#### Paso 1: Crear la Base de Datos
1. En Render Dashboard → **"New +"** → **"PostgreSQL"**
2. Configuración:
   - **Name:** `encuesta-db`
   - **Database:** `encuestas`
   - **User:** `encuestas_user`
   - **Plan:** Free
3. Click **"Create Database"**
4. **IMPORTANTE:** Guarda la "Internal Database URL" (la usarás en el backend)

#### Paso 2: Crear el Backend
1. En Render Dashboard → **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name:** `encuesta-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `.` (dejar vacío o punto)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

4. **Variables de Entorno:**
   - Click **"Add Environment Variable"**
   - `DATABASE_URL` = [Pega la Internal Database URL de tu PostgreSQL]
   - `CORS_ORIGINS` = `https://tu-frontend.onrender.com` (actualiza con tu URL real)

5. Click **"Create Web Service"**

#### Paso 3: Actualizar el Frontend
1. En Render Dashboard, encuentra tu servicio `encuesta-frontend`
2. Ve a **"Environment"**
3. Agregar/Actualizar variables:
   - `VITE_API_URL` = `https://encuesta-backend.onrender.com` (tu URL del backend)
   - `VITE_ADMIN_PASSWORD` = `tesis1234` (o tu password)

4. Ve a **"Settings"** → Click **"Manual Deploy"** → **"Clear build cache & deploy"**

## 4. Verificar el Despliegue

### Probar el Backend:
```bash
# Debería responder con JSON
curl https://encuesta-backend.onrender.com/

# Debería mostrar "healthy"
curl https://encuesta-backend.onrender.com/health
```

### Probar el Frontend:
1. Abre tu sitio: `https://tu-frontend.onrender.com`
2. Llena la encuesta
3. Ve al panel de admin
4. ✅ Las respuestas deben aparecer ahí

## 5. Recuperar Respuestas Perdidas (Si las tienes localmente)

Si tienes respuestas en tu `backend/encuesta.db` local:

### Opción A: Script de Migración
```python
# migrate_to_postgres.py
import sqlite3
import psycopg2
import json
import os

# Conectar a SQLite local
sqlite_conn = sqlite3.connect('backend/encuesta.db')
sqlite_cursor = sqlite_conn.cursor()

# Conectar a PostgreSQL en Render
postgres_url = "tu_postgres_url_aqui"  # De Render
postgres_conn = psycopg2.connect(postgres_url)
postgres_cursor = postgres_conn.cursor()

# Leer datos de SQLite
sqlite_cursor.execute("SELECT id, respuestas FROM respuestas")
rows = sqlite_cursor.fetchall()

# Insertar en PostgreSQL
for row in rows:
    postgres_cursor.execute(
        "INSERT INTO respuestas (respuestas) VALUES (%s)",
        (row[1],)
    )

postgres_conn.commit()
print(f"Migradas {len(rows)} respuestas")

sqlite_conn.close()
postgres_conn.close()
```

### Opción B: Manual desde el Admin Panel
1. Ejecuta localmente: `cd backend && uvicorn main:app --reload`
2. Abre: http://localhost:8000/api/respuestas
3. Copia todas las respuestas
4. Usa un script para reenviarlas al nuevo endpoint

## Problemas Comunes

### Backend no inicia:
- Verifica los logs en Render Dashboard
- Asegúrate que `DATABASE_URL` esté configurada correctamente
- Verifica que el comando de inicio sea correcto

### Frontend no se conecta al backend:
- Verifica que `VITE_API_URL` tenga la URL correcta del backend
- Verifica CORS_ORIGINS en el backend incluya la URL del frontend
- Haz "Clear build cache & deploy" después de cambiar variables

### Base de datos vacía:
- El backend crea las tablas automáticamente al iniciar
- Si no se crean, revisa los logs del backend

## Notas Importantes

⚠️ **Plan Free de Render:**
- Backend se duerme después de 15 minutos de inactividad
- Primera petición después de dormir tarda ~30 segundos
- Base de datos PostgreSQL free tiene límite de 256 MB
- Ver `MANTENER_ACTIVO.md` para evitar que se duerma

⚠️ **URLs Importantes:**
- Actualiza todas las URLs después del despliegue
- Backend URL en las variables del frontend
- Frontend URL en CORS del backend

## Siguiente Paso
Una vez desplegado todo, configura UptimeRobot (ver `MANTENER_ACTIVO.md`) para que el servicio no se duerma.
