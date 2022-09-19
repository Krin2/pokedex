<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollos

1. Clonar repositorio
2. Ejecutar:
  ```
    yarn install
  ```

3. Instalar Nest-cli
  ```
    npm i -g @nestjs/cli
  ```

4. Levantar la base de datos
  ```
    docker-compose up -d
  ```

5. Clonar el archivo ```.env.template``` y renombrar la copia a ```.env```
6. LLenar las variables de entorno definidas en el ```.env```

7. Reconstruir la base de datos con la semilla
  ```
    http://localhost:3000/api/v2/seed
  ```

6. Ejecutar la aplicacion
   1. En modo desarrollo
 ```
    yarn start:dev
  ```
   2. en modo produccion
  ```
    yarn start
  ```

# Build de produccion
1. Crear archivo ```.env.prod```
2. Leenar las variables de entorno de produccion
3. Crear la nueva imagen
   ```
    docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
   ```

## Stack usado
* MongoDB
* Nest


# Notas:
  Heroku deployment sin cambios
  ```
  git commit --allow-empty -m 'Trigger heroku deploy'
  git push heroku <master | main>
  ```
