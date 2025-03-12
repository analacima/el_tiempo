# El Tiempo ☀️

Aplicación del tiempo que utiliza la API de AEMET para mostrar predicciones meteorológicas de municipios españoles.

## Tecnologías
- Frontend: React + Vite
- Backend: Node.js + Express
- UI: React Bootstrap
- API: AEMET OpenData

## Despliegue

### Frontend (GitHub Pages)
- URL: https://analacima.github.io/el_tiempo
- Despliegue: `npm install && npm run deploy`

### Backend
#### Local
- Puertos: 3001-3005 (fallback automático)
- Ejecución: `node server.js`

#### Producción (Render)
- URL: https://el-tiempo-server.onrender.com
- Build Command: `npm install`
- Start Command: `node server.js`

## Desarrollo
El proyecto utiliza Vite como bundler por su:
- Rápido tiempo de inicio
- Hot Module Replacement (HMR)
- Optimización de producción

