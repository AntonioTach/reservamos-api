import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { WeatherResponse } from 'src/utils/interfaces/weather.interface';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getCurrentWeather(lat: string, lon: string): Promise<WeatherResponse> {
    try {
      const weatherApiURL = this.configService.get('WEATHER_API_URL');
      const weatherApiKey = this.configService.get('WEATHER_API_KEY');

      // Get the current weather for the city in celcius
      const url = `${weatherApiURL}forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
      const response = await lastValueFrom(this.httpService.get(url));
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
