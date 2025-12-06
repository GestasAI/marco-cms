# 🔧 Guía de Solución de Problemas (Troubleshooting)

Esta guía recopila errores comunes encontrados durante el desarrollo y sus soluciones probadas.

## 1. Error 504 Gateway Timeout

**Síntoma:**
El frontend o `curl` devuelve `504 Gateway Timeout` al intentar acceder a un plugin o al sistema.

**Causa:**
El servicio backend está caído o reiniciándose constantemente (Crash Loop).

**Verificación:**
```bash
docker ps --filter "name=gestas_plugin_name"
# Si dice "Restarting (1)", está en bucle de reinicio.
```

**Solución Común:**
Falta una dependencia en `package.json`.
1. Revisar logs: `docker logs gestas_plugin_name`
2. Si el error es `Error: Cannot find module 'yaml'`, falta instalar `yaml`.
3. Añadir `"yaml": "^2.3.4"` a `package.json`.
4. Reconstruir: `docker-compose up --build -d plugin-name`

## 2. Error 404 Not Found (Configuración)

**Síntoma:**
Al intentar configurar un plugin, devuelve 404.

**Causa:**
El plugin no tiene implementadas las rutas de configuración `/api/config`.

**Solución:**
1. Crear `src/routes/config.routes.js` (ver `plugin_development_v2.md`).
2. Registrar rutas en `src/index.js`.
3. Asegurar que `app.use(configRoutes)` está presente.

## 3. Error ECONNREFUSED (Gateway)

**Síntoma:**
El Gateway devuelve `Bad Gateway` con `ECONNREFUSED`.

**Causa:**
El Gateway no puede conectar con el contenedor del plugin.
1. El plugin no está corriendo.
2. El puerto configurado en `manifest.json` no coincide con el puerto interno del contenedor (`src/index.js`).
3. El nombre del host en `manifest.json` no coincide con el `container_name` en `docker-compose.yml`.

**Solución:**
Verificar que `port` en `index.js` == `port` en `manifest.json` (network) == puerto expuesto (si aplica).

## 4. Problemas de DNS (ENOTFOUND)

**Síntoma:**
Gateway devuelve `ENOTFOUND gestas_plugin_name`.

**Causa:**
El Gateway no puede resolver el nombre del contenedor.

**Solución:**
1. Asegurar que ambos contenedores están en la misma red (`gestas_network`).
2. Reiniciar el Gateway: `docker-compose restart backend-gateway`.

## 5. Error de Sintaxis en JSON

**Síntoma:**
El contenedor falla al iniciar con `SyntaxError`.

**Causa:**
Edición manual incorrecta de `package.json` o `manifest.json` (comas faltantes, llaves duplicadas).

**Solución:**
Validar el JSON en un validador online o revisar cuidadosamente la estructura.
