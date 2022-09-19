import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Hereda del Document de mongoose todas las propiedades y metodos
@Schema()
export class Pokemon extends Document {
  // id: no se especifica porque mongo lo define solo es
  @Prop({
    unique: true, // especifica que el elemento sea unico en la base de datos
    index: true, // genera un indice para mejorar la busqueda
  })
  name: string; // nombre del Pokemon

  @Prop({
    unique: true, // especifica que el elemento sea unico en la base de datos
    index: true, // genera un indice para mejorar la busqueda
  })
  no: number; // numero del Pokemon
}

// Exportamos un schema para que cuando inicie la base de datos, esta entienda qomo estara formada la tabla, cuales seran las reglas a usar, etc...
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
