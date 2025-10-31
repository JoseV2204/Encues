# 📋 Instrucciones para Subir a GitHub

## ✅ Estado Actual
El proyecto está completamente preparado y listo para subirse a GitHub:
- ✅ Código completo y funcional
- ✅ Variables de entorno configuradas (.env en .gitignore)
- ✅ Archivos .env.example creados para referencia
- ✅ README.md completo con documentación
- ✅ .gitignore configurado correctamente
- ✅ Commit realizado con todos los cambios

## 🚀 Pasos para Subir a GitHub

### Opción 1: Crear un Nuevo Repositorio

1. **Ve a GitHub** y crea un nuevo repositorio:
   - Ve a https://github.com/new
   - Nombre sugerido: `encuesta-matricula-up`
   - Descripción: "Sistema de encuestas para evaluación del proceso de matrícula - Universidad de Panamá"
   - ⚠️ **NO inicialices con README, .gitignore o licencia** (ya los tenemos)
   - Elige si será **público** o **privado**

2. **Conecta tu repositorio local con GitHub**:
   ```bash
   cd C:\proyecto\Pagina_web_encuesta
   git remote add origin https://github.com/TU_USUARIO/encuesta-matricula-up.git
   ```

3. **Sube el código**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Opción 2: Usar un Repositorio Existente

Si ya tienes un repositorio remoto configurado:

```bash
cd C:\proyecto\Pagina_web_encuesta
git push origin dev
```

## ⚙️ Configuración Post-Push

### 1. Configurar Secrets en GitHub (Opcional)
Si quieres usar GitHub Actions, ve a:
- Settings → Secrets and variables → Actions
- Agrega los secrets necesarios:
  - `ADMIN_PASSWORD`
  - `DATABASE_URL` (para producción)

### 2. Actualizar URLs de Producción
Cuando despliegues a producción, actualiza:

**Frontend (.env.production)**
```env
VITE_API_URL=https://tu-api-produccion.com
VITE_ADMIN_PASSWORD=tu_password_seguro
```

**Backend (.env en servidor)**
```env
DATABASE_URL=postgresql://... # si usas PostgreSQL
CORS_ORIGINS=https://tu-frontend-produccion.com
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE: Archivos NO Subidos a Git
Estos archivos están en .gitignore y NO se subirán (correcto):
- `frontend/.env` (contiene contraseña real)
- `backend/.env` (contiene configuración local)
- `backend/encuesta.db` (base de datos local)
- `node_modules/` (dependencias)
- `__pycache__/` (cache de Python)
- `frontend_src_backup/` (respaldo temporal)

### ✅ Archivos SÍ Subidos
- `.env.example` (plantillas sin datos sensibles)
- Todo el código fuente
- Documentación
- Archivos de configuración

## 📝 Checklist Pre-Push

Antes de hacer push, verifica:

- [ ] Los archivos `.env` NO están en el repositorio
- [ ] Los archivos `.env.example` SÍ están incluidos
- [ ] El README.md está actualizado
- [ ] La base de datos (.db) NO está incluida
- [ ] node_modules/ NO está incluida
- [ ] El .gitignore está correctamente configurado

## 🌐 Despliegue Sugerido

### Backend (Railway - Gratis)
1. Conecta tu repositorio de GitHub a Railway
2. Selecciona la carpeta `backend`
3. Railway detectará FastAPI automáticamente
4. Configura las variables de entorno en Railway
5. Railway te dará una URL pública

### Frontend (Vercel - Gratis)
1. Importa tu repositorio en Vercel
2. Configura:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Agrega variables de entorno en Vercel:
   - `VITE_API_URL` = URL de tu backend en Railway
   - `VITE_ADMIN_PASSWORD` = tu contraseña segura
4. Vercel te dará una URL pública

## 🎯 Comandos Rápidos de Referencia

```bash
# Ver estado actual
git status

# Ver branches
git branch

# Cambiar a main
git branch -M main

# Agregar remote (solo primera vez)
git remote add origin URL_DE_TU_REPO

# Ver remotes configurados
git remote -v

# Push a main
git push -u origin main

# Push a otra rama
git push origin nombre-rama

# Pull cambios
git pull origin main
```

## 📞 Soporte

Si necesitas ayuda:
1. Revisa el README.md para documentación completa
2. Verifica que las variables de entorno estén bien configuradas
3. Asegúrate de que ambos servidores (backend y frontend) estén corriendo

## ✨ Próximos Pasos Opcionales

Después de subir a GitHub, puedes:
- [ ] Agregar GitHub Actions para CI/CD
- [ ] Configurar análisis de código (CodeQL)
- [ ] Agregar badges al README (build status, etc.)
- [ ] Configurar dependabot para actualizaciones automáticas
- [ ] Agregar issues templates
- [ ] Crear un CHANGELOG.md

---

**¡Listo para subir! Cuando estés list@, ejecuta los comandos según la Opción 1 o 2.**
