import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

// La idea de este adaptador es que sea un envoltorio de axios,
// para que si en algun momento axios cambia, solo tengamos que modificar esta clase
// y no buscar en todo el codigo donde hay que modificar.
@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url); // 'https://pokeapi.co/api/v2/pokemon?limit=650',
      return data;
    } catch (error) {
      throw new Error('This is an error - Check logs');
    }
  }
}
