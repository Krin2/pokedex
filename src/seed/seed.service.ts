import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  // se hace la inyeccion del modelo de mangoose para poder insertar los datos de los pokempns con la semilla
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    // Borro todos los valores antes de cargar le nuevo los mismos
    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    // Toma los datos de la url de pokemonapi con el filtro de 650 pokemons
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const pokemons: { name: string; no: number }[] = [];
    data.results.forEach(async ({ name, url }) => {
      // En este punto tenemos destructurado los resultados.
      // Para obtener el numero del pokemon, lo sacamos de la url
      const segment = url.split('/');
      const no: number = +segment[segment.length - 2]; // El + transforma el string en number

      pokemons.push({ name, no });
    });

    // Al haber injectado el model de mongoose, podemos usar directamente sus funciones para insertar el array de pokemons en la db
    this.pokemonModel.insertMany(pokemons);

    return 'Seed executed';
  }
}
