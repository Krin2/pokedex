import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); // agrega el prefijo api a todas las rutas (http://localhost:3000/api/v2)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Permite que se transformen los parametros recibidos
      transformOptions: {
        enableImplicitConversion: true, // Trata de transformar los datos segun esta especificado en ts
      },
    }),
  );

  await app.listen(process.env.PORT); // aca esta escuchando en el puerto configurado en el .env no usa la configuracion del app.config
}
bootstrap();
