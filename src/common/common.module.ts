import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
  providers: [AxiosAdapter], // Indica los inyectables que va a usar el módulo
  exports: [AxiosAdapter], // Hace visible el AxiosAdapter al resto de los módulos
})
export class CommonModule {}
