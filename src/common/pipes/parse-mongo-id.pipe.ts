/* Creacion de un pipe personalizado
1. Creacion de un modulo comun para toda la aplicacion

```
nest g mo common
```
2. Creacion del pipe mediante nest-cli
```
nest g pi common/pipes/parseMongoId --no-spec
```
# Notas:
- cuando creamos un pipe, no hace falta ponerle ...Pipe al nombre porque nest-cli se lo agrega solo
- los pipes creados no se enlazan a ningun módulo
*/

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoID`);
    }

    return value;
  }
}
