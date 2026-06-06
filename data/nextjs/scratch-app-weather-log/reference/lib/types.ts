export interface WeatherEntry {
  id: string;
  date: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  notes: string;
}

export interface Settings {
  unit: 'celsius' | 'fahrenheit';
}

export type Route = 'home' | 'log' | 'charts' | 'settings';
