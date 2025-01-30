import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Places } from 'src/utils/interfaces/places.interface';
import { CityWeatherDetailsForecast } from 'src/utils/interfaces/weather-forecast.interface';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('search')
  async searchCities(@Query('q') query: string): Promise<CityWeather[]> {
    try {
      if (!query) {
        throw new HttpException(
          { message: 'Query parameter "q" is required' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const cities = await this.placesService.getCities(query);
      return cities!;
    } catch (error) {
      return error;
    }
  }

  @Get('details/:id')
  async getCityDetailsById(@Param('id') id: string, @Query('q') query: string): Promise<CityWeatherDetailsForecast> {
    try {
      if (!id) {
        return [{ message: 'City "id" is required' }] as any;
      }
      const city = await this.placesService.getCityDetailsById(id, query);
      return city!;
    } catch (error) {
      return error;
    }
  }
}
