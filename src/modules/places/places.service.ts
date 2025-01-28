import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Places } from 'src/utils/interfaces/places.interface';

@Injectable()
export class PlacesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCitiesByName(query: string) {
    try {
      const placesApiURL = this.configService.get('PLACES_API_URL');
      const response = await this.httpService
        .get(`${placesApiURL}`, { params: { q: query } })
        .toPromise();

      const data = response?.data;

      // Filter by result type 'city' and transform the data to Places Interface
      const cities: Places[] = data.filter(
        (place: Places) => place.result_type === 'city',
      );

      return cities;
    } catch (error) {
      return error;
    }
  }
}
