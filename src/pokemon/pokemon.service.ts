import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  // Se crea una variable privada para incorporar los datos del config
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name) // Se usa este inyectable porque pokemonModel no es un provider. Pokemon.name es el nombre del modelo que va a buscar en mongo
    private readonly pokemonModel: Model<Pokemon>, // se define a pokemonModel como un modelo importado de mongo cuyos datos son de tipo Pokemon

    private readonly configService: ConfigService,
  ) {
    // En este punto, los valores por defecto los pusimos distintos para ver cual de ellos esta tomando por defecto.
    // en el .env esta en 5 pero lo estamos comentando
    // en app.config está en 7
    // en joi.validation esta en 8
    // La aplicacion toma este último valor, ya que el joi.validation se ejecuta antes y otorga al valor de .env el valor por defecto de 8.
    // luego, en app.config, el valor process.env.DEFAULT_LIMIT, ya viene con el valor 8 por lo que toma este valor en vez de usar el seteado aca por defecto
    this.defaultLimit = configService.get<number>('defaultLimit'); // a esta variable privada, se le asigna el valor del configService en el constructor para que pueda ser usada en toda la clase
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto; // al destructurarlo le doy valores por defecto

    return this.pokemonModel
      .find()
      .skip(offset) // Le indica que saltee los primeros 'offset' numero de datos
      .limit(limit) // Le indica que muestre solo 'limit' datos en cada consulta
      .sort({ no: 1 }) // Le indica que los ordene de forma ascentende segun el 'no'
      .select('-__v'); // Le indica que no se quiere mostrar el campo '__v'
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto); //   aca actualiza la db
      return { ...pokemon.toJSON(), ...updatePokemonDto }; // aca se esparsen las propiedades de pokemon y luego se las sobreescribe con los valores de updatedPokemon
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // pokemon.deleteOne();
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return;
  }

  handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exist on db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error.message);
    throw new InternalServerErrorException(
      `Can't create a pokemon - Check server logs`,
    );
  }
}
