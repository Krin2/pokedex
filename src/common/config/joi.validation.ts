// Joi es una libreria que se usa para validar datos y esquemas
// se agrega mediante 2yarn add joi"
import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  // Aca vamos a validar cada uno de los datos del .env.

  MONGODB: Joi.required(),
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT: Joi.number().default(8),
});
