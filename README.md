"# 🎓 Sistema de Encuestas - Universidad de Panamá

Sistema web completo para realizar encuestas estudiantiles sobre el proceso de matrícula en la Universidad de Panamá. Incluye frontend en React con TypeScript y backend en FastAPI con Python.

## 📋 Características

### Frontend
- ✅ Encuesta interactiva con 13 preguntas
- ✅ Diseño responsive y atractivo
- ✅ Validación de campos en tiempo real
- ✅ Guardado automático en localStorage
- ✅ Barra de progreso animada
- ✅ Lógica condicional (salto de preguntas)
- ✅ Panel de administración protegido por contraseña

### Backend
- ✅ API REST con FastAPI
- ✅ Base de datos SQLite
- ✅ CORS configurado
- ✅ Endpoints para guardar y consultar respuestas

### Panel de Administración
- ✅ Vista de todas las respuestas
- ✅ Estadísticas en tiempo real
- ✅ Exportación a CSV
- ✅ Vista detallada de cada respuesta
- ✅ Diseño moderno y profesional

## 🚀 Instalación

### Requisitos previos
- Node.js 18+ y npm
- Python 3.8+
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Pagina_web_encuesta
```

### 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env (copiar de .env.example)
copy .env.example .env  # Windows
# cp .env.example .env    # Linux/Mac

# Editar .env con tus configuraciones si es necesario
```

### 3. Configurar el Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env (copiar de .env.example)
copy .env.example .env  # Windows
# cp .env.example .env    # Linux/Mac

# Editar .env y configurar la contraseña del admin
```

## 🎮 Uso

### Iniciar el Backend
```bash
cd backend
# Asegúrate de tener el entorno virtual activado
python -m uvicorn main:app --reload
```
El backend estará disponible en `http://localhost:8000`

### Iniciar el Frontend
```bash
cd frontend
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

## 🌐 Rutas

- **Encuesta**: `http://localhost:5173/`
- **Panel Admin**: `http://localhost:5173/admin`
- **API Backend**: `http://localhost:8000`
- **Docs API**: `http://localhost:8000/docs`

## 🔐 Configuración

### Variables de Entorno - Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_ADMIN_PASSWORD=tu_contraseña_aqui
```

### Variables de Entorno - Backend (.env)
```env
DATABASE_URL=sqlite:///./encuesta.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📊 Estructura del Proyecto

```
Pagina_web_encuesta/
├── backend/
│   ├── main.py              # API principal
│   ├── models.py            # Modelos de datos
│   ├── requirements.txt     # Dependencias Python
│   ├── .env                 # Variables de entorno (no incluido en git)
│   └── .env.example         # Ejemplo de variables de entorno
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Componente de encuesta
│   │   ├── Admin.tsx        # Panel de administración
│   │   ├── App.css          # Estilos de encuesta
│   │   ├── Admin.css        # Estilos de admin
│   │   ├── index.css        # Estilos globales
│   │   └── main.tsx         # Punto de entrada
│   ├── .env                 # Variables de entorno (no incluido en git)
│   ├── .env.example         # Ejemplo de variables de entorno
│   └── package.json         # Dependencias Node
├── .gitignore               # Archivos ignorados por git
├── diseno.md                # Documento de diseño UI
└── README.md                # Este archivo
```

## 🎨 Diseño

El diseño sigue las guías especificadas en `diseno.md`:
- Paleta de colores inspirada en la Universidad de Panamá
- Azul primario: #0A3D91
- Dorado/amarillo: #F2C94C
- Responsive mobile-first
- Animaciones suaves
- Accesibilidad WCAG AA

## 📝 Preguntas de la Encuesta

1. Facultad
2. Situación académica
3. Completó matrícula
4. Intentos necesarios (condicional)
5. Contactó soporte (condicional)
6. Problemas experimentados (condicional)
7. Problema más grave
8. Nivel de frustración (escala 1-5)
9. Satisfacción general (escala 1-5)
10. Recomendación NPS (escala 0-10)
11. Utilidad del soporte
12. Sugerencias de mejora (texto libre)
13. Sugerencias para otros (texto libre)

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript
- React Router DOM
- Vite
- CSS3 con animaciones

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Python 3
- Uvicorn

## 📈 Funcionalidades del Panel Admin

- **Login seguro** con contraseña
- **Dashboard** con métricas clave:
  - Total de respuestas
  - Satisfacción promedio
  - NPS promedio
  - Nivel de frustración promedio
  - Porcentaje que completó matrícula
  - Porcentaje que contactó soporte
- **Lista de respuestas** individuales con preview
- **Vista detallada** de cada respuesta en modal
- **Exportación a CSV** de todas las respuestas
- **Actualización en tiempo real**

## 🔒 Seguridad

- Contraseña del admin configurable por variables de entorno
- CORS configurado para dominios específicos
- Base de datos local (no expuesta)
- Variables sensibles en archivos .env (no versionados)

## 🚧 Desarrollo

### Instalar dependencias de desarrollo
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### Limpiar base de datos
```bash
cd backend
rm encuesta.db
# La BD se recreará automáticamente al iniciar el servidor
```

## 📦 Despliegue

### Backend (Railway/Heroku)
1. Configurar variables de entorno en la plataforma
2. Cambiar DATABASE_URL a PostgreSQL si es necesario
3. Ajustar CORS_ORIGINS con el dominio del frontend

### Frontend (Vercel/Netlify)
1. Configurar variables de entorno VITE_*
2. Build command: `npm run build`
3. Output directory: `dist`
4. Actualizar VITE_API_URL con la URL del backend en producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso educativo para la Universidad de Panamá.

## ✨ Autor

Desarrollado para mejorar el proceso de matrícula en la Universidad de Panamá.

## 📞 Soporte

Para preguntas o problemas, contacta al administrador del sistema.
" 
