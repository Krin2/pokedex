// Este archivo esta relacionado a la configuracion de variables de entorno
// Con el mismo lo que se pretende es levantar una configuracion inicial ya sea mediante el env o usando valores por defaultClearTimeout

export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: +process.env.PORT || 3002, // esta configuracion no esta afectando a puerto que escucha la aplicacion
  defaultLimit: +process.env.DEFAULT_LIMIT || 7, // se debe convertir el valor a number porque lo trae como string
});
