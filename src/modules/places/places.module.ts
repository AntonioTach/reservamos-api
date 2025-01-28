import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { HttpModule } from '@nestjs/axios';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [HttpModule, WeatherModule],
  providers: [PlacesService],
  controllers: [PlacesController]
})
export class PlacesModule {}
