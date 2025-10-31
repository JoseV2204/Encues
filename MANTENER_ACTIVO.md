# Mantener el Servicio Activo en Render

## Problema
Los servicios gratuitos de Render se duermen después de 15 minutos de inactividad.

## Solución: Endpoint de Health Check

He agregado un endpoint `/health` que verifica la conexión a la base de datos.

### Opciones para mantener el servicio activo:

## 1. UptimeRobot (Recomendado - Gratis)
1. Regístrate en https://uptimerobot.com (plan gratuito)
2. Crea un nuevo monitor:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Encuesta Health Check
   - **URL:** `https://tu-servicio.onrender.com/health`
   - **Monitoring Interval:** 5 minutos (máximo en plan gratuito)
3. Guarda el monitor

## 2. Cron-job.org (Alternativa Gratis)
1. Regístrate en https://cron-job.org
2. Crea un nuevo cron job:
   - **Title:** Keep Alive Encuesta
   - **URL:** `https://tu-servicio.onrender.com/health`
   - **Schedule:** Cada 10 minutos
3. Activa el job

## 3. BetterStack (Alternativa con más features)
1. Regístrate en https://betterstack.com/uptime
2. Crea un nuevo monitor con tu URL `/health`
3. Configura para ping cada 5-10 minutos

## 4. GitHub Actions (Si tienes el código en GitHub)
Crea `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Render Service Alive

on:
  schedule:
    # Ejecutar cada 10 minutos
    - cron: '*/10 * * * *'
  workflow_dispatch: # Permitir ejecución manual

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping health endpoint
        run: |
          curl -f https://tu-servicio.onrender.com/health || exit 0
```

## 5. Actualizar a Plan Pagado
El plan Starter de Render ($7/mes) NO tiene hibernación automática.

## Notas Importantes
- El endpoint `/health` hace una consulta simple a la BD para mantenerla activa
- No abuses de la frecuencia de pings (5-10 minutos es suficiente)
- UptimeRobot es la opción más popular y confiable en su plan gratuito
