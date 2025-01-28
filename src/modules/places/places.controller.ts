import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Places } from 'src/utils/interfaces/places.interface';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('search')
  async searchCities(@Query('q') query: string): Promise<CityWeather[]> {
    try {
      if (!query) {
        return [{ message: 'Query parameter "q" is required' }] as any;
      }
      const cities = await this.placesService.getCities(query);
      return cities!;
    } catch (error) {
      return error;
    }
  }
}
