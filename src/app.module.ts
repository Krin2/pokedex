// Se suelen ordenar los paketes por importacnia
import { join } from 'path'; // Los paquetes de node suelen ir primero
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './common/config/app.config';
import { JoiValidationSchema } from './common/config/joi.validation';

@Module({
  imports: [
    // Agregado del modulo de configuracion de nestjs
    // Es importante que este se importe antes de cualquier otro modulo que use las variables de entorno
    ConfigModule.forRoot({
      load: [EnvConfiguration], // ejecuta la funcion EnvConfiguration al levantar la aplicacion
      validationSchema: JoiValidationSchema, // este validador de esquema puede funcionar en conjunto con el load (basicamente estan haciendo lo mismo)
    }),
    // Agregado de un prefijo "global" a todas las rutas
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // Se agrega la referencia a la base de datos
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
