import { WeatherService } from './../weather/weather.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { count } from 'console';

import { lastValueFrom } from 'rxjs';
import { Places } from 'src/utils/interfaces/places.interface';
import { CityWeatherDetailsForecast, WeatherForecast } from 'src/utils/interfaces/weather-forecast.interface';

@Injectable()
export class PlacesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly weatherService: WeatherService,
  ) {}

  // Get cities from the Places API
  private async getWeatherForCities(query: string) {
    const placesApiURL = this.configService.get('PLACES_API_URL');
    const response = await lastValueFrom(
      this.httpService.get(placesApiURL, { params: { q: query } })
    );

    const data = response?.data;

    return data.filter((place: Places) => place.result_type === 'city');
  }

  // Get cities from the Places API and get the weather for each city
  async getCities(query: string) {
    try {
      const cities = await this.getWeatherForCities(query);
      const citiesWithWeather = [] as CityWeather[];

      for (const city of cities) {
        if (city.lat && city.long) {
          const weather = await this.weatherService.getCurrentWeather(city.lat, city.long);
          citiesWithWeather.push({
            id: city.id,
            city: city.city_name,
            state: city.state,
            country: city.country,
            temperature: weather.list[0].main.temp,
            weather_description: weather.list[0].weather[0].description,
          });
        }
      }
      return citiesWithWeather;
    } catch (error) {
      return error;
    }
  }

  async getCityDetailsById(id: string, query: string) {
    try {
      const cities = await this.getWeatherForCities(query);
      const city = cities.find((place: Places) => place.id === parseInt(id));
      if (!city) throw new Error('City not found');

      // Get the weather for the city
      const weather = await this.weatherService.getCurrentWeather(city.lat!, city.long!);

      // Map the weather forecast to the WeatherForecast Interface
      const forecast: WeatherForecast[] = weather.list.map((item) => ({
        date: item.dt_txt,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        weatherCondition: item.weather[0].description,
      }));

      const cityWeatherDetailsForecast: CityWeatherDetailsForecast = {
        city: city.city_name,
        country: city.country,
        id: city.id,
        forecast
      };

      return cityWeatherDetailsForecast;
    } catch (error) {
      return error;
    }
  }
}
