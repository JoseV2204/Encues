# Script de verificación de variables de entorno

## Frontend (.env)
print("Verificando Frontend .env:")
- VITE_API_URL: Debe apuntar a tu backend (ej: http://localhost:8000)
- VITE_ADMIN_PASSWORD: Contraseña del panel de administración

## Backend (.env)
print("Verificando Backend .env:")
- DATABASE_URL: Ruta de la base de datos (ej: sqlite:///./encuesta.db)
- CORS_ORIGINS: Orígenes permitidos separados por coma

## Cómo usar las variables:

### Frontend (Vite)
Las variables deben empezar con VITE_
Acceso en código: import.meta.env.VITE_NOMBRE_VARIABLE

### Backend (Python)
Las variables se leen con os.getenv()
Uso: os.getenv("NOMBRE_VARIABLE", "valor_por_defecto")

## Verificación rápida:

### Frontend:
1. Verifica que existe: frontend/.env
2. Contiene VITE_API_URL y VITE_ADMIN_PASSWORD
3. Reinicia el servidor de desarrollo después de cambiar .env

### Backend:
1. Verifica que existe: backend/.env
2. Contiene DATABASE_URL y CORS_ORIGINS
3. python-dotenv instalado: pip install python-dotenv
4. load_dotenv() llamado al inicio de main.py
5. Reinicia el servidor después de cambiar .env

## Testing:

### Probar Frontend:
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Password configurada:', import.meta.env.VITE_ADMIN_PASSWORD ? 'Sí' : 'No');

### Probar Backend:
En main.py, después de load_dotenv():
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
print(f"CORS_ORIGINS: {os.getenv('CORS_ORIGINS')}")
