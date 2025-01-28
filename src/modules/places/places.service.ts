import { WeatherService } from './../weather/weather.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { lastValueFrom } from 'rxjs';
import { Places } from 'src/utils/interfaces/places.interface';

@Injectable()
export class PlacesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly weatherService: WeatherService,
  ) {}

  // Get cities from the Places API and get the weather for each city
  async getCities(query: string) {
    try {
      const placesApiURL = this.configService.get('PLACES_API_URL');
      const response = await lastValueFrom(
        this.httpService.get(placesApiURL, { params: { q: query } })
      );

      const data = response?.data;

      // Filter by result type 'city' and transform the data to Places Interface
      const cities: Places[] = data.filter(
        (place: Places) => place.result_type === 'city',
      );

      // Get the weather for each city
      const citiesWithWeather = [] as CityWeather[];
      for (const city of cities) {
        if (city.lat && city.long) {
          const weather = await this.weatherService.getCurrentWeather(city.lat, city.long);
          citiesWithWeather.push({
            city: city.city_name,
            state: city.state,
            country: city.country,
            temperature: weather.list[0].main.temp,
            feelsLike: weather.list[0].main.feels_like,
            weather_description: weather.list[0].weather[0].description,
            wind_speed: weather.list[0].wind.speed,
            lat: city.lat,
            lon: city.long,
          });
        }
      }
      return citiesWithWeather;
    } catch (error) {
      return error;
    }
  }
}
