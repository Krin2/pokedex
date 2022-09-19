# # especifica la version de node y el sistema operativo(y su)version) que se va a usar en este contenedor (node 18, alpine 3.15 (linux))
# FROM node:18-alpine3.15

# # Set working directory
# # -crea una carpeta dentro de este contenedor en la ruta /var/www/pokedex
# RUN mkdir -p /var/www/pokedex
# # - selecciona la ruta anterior como directorio raiz
# WORKDIR /var/www/pokedex

# # Copiar el directorio y su contenido
# # - Copia todo (.) desde donde se encuentra este archivo hacia la direccion destino ./var/www/pokedex
# COPY . ./var/www/pokedex
# # - Copia todo estos archivos a la direccion destino ./var/www/pokedex
# COPY package.json tsconfig.json tsconfig.build.json /var/www/pokedex/
# # - ejecuto el comando para instalar (unicamente) todas las dependencias de produccion
# RUN yarn install --prod
# # - Ejecuta el build de la aplicacion
# RUN yarn build


# # Dar permiso para ejecutar la applicación
# # - Crea un nuevo usuario para no usar el usuario root por defecto y se le deshabilita elpassword
# RUN adduser --disabled-password pokeuser
# # - Se le da acceso al usuario creado al directorio recien creado (solamente a este sitio, no puede modificar nada afuera de ahi)
# RUN chown -R pokeuser:pokeuser /var/www/pokedex
# # - Usa el usuario recien creado
# USER pokeuser

# # Limpiar el caché
# # - Con esto eliminamos cosas que no esten siendo usadas
# RUN yarn cache clean --force

# # - Expone el puerto 3000 para nuestra aplicacion
# EXPOSE 3000

# # - Ejecuta el comando yarn start
# CMD [ "yarn","start" ]

#-------
# Install dependencies only when needed
# - Este bloque "FROM", crea una imagen unicamente con las dependencias de la aplicacion y la nombra "deps"
# - Se puede ver que solo copia el package.json y el yarn.lock y ejecuta la instalacion de las dependencias
# - Separar esta imagen del resto acelera el build de la apicacion ya que solo instala las dependencias si no hay o si hay actualizaciones.
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
# - Esta segunda imagen se encargara del build de la aplicacion y la nombra "builder"
# - Lo que hace es seleccionar el directorio /app, y copiar todo el directorio node_modules de la imagen de dependencias "deps", en esta imagen, en el directorio node_modules tambeien
# - luego copia todo lo que esta en el directorio donde se encuentra nuestro dockerfile en /app de esta imagen.
# - fnalmente ejecuta el yarn build para buildear la aplicacion.
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# Production image, copy all the files and run next
# - Esta última imagen, se va a encargar de correr la aplicacion y la nombra "runner"
# - copia el package.json y el yarn.lock al directorio /usr/src/app de la imagen
# - instala las dependencias de produccion unicamente de
# - copia de la imagen "builder", el directorio dist con el codigo buildeado.
# - Los comentarios siguientes son configuraciones opcionales para este proyecto en particular
# - Por último, ejecuta el comando node dist/main en la imagen, para correr la aplicacion

FROM node:18-alpine3.15 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD [ "node","dist/main" ]