export interface WeatherForecast {
 date: string;
 tempMin: number;
 tempMax: number;      
 weatherCondition: string;
}

export interface CityWeatherDetails {
 city: string;          
 country: string;        
 forecast: WeatherForecast[]; 
}

// Return endpoint
export interface CityWeatherDetailsForecast {
 city: string;
 country: string;
 id: number;
 forecast: WeatherForecast[];
}