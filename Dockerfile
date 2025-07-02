# Etapa 1: Construir la aplicación con Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# El comando para construir en Vite es 'build'
RUN npm run build

# Etapa 2: Servir los archivos estáticos con Nginx
FROM nginx:stable-alpine
# Vite crea la carpeta 'dist', no 'build'
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx escucha en el puerto 80 por defecto
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]