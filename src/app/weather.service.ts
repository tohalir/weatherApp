import {Injectable, Signal} from '@angular/core';
import {BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import { LocalStorageItem } from './shared/type/local-storage-item.type';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = new BehaviorSubject<ConditionsAndZip[]>([]);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService) {}

  addCurrentConditions(zipcode: string): void {
    const conditions = this.localStorageService.getFromLocalStorage<LocalStorageItem<CurrentConditions>[]>('conditions')?.find((loc) => loc.id === zipcode);
    if(conditions && this.localStorageService.isLocalStorageDataValid<CurrentConditions>(conditions)){
      this.updateCurrentConditions({data: conditions.data, zip: conditions.id}, false)
      return;
    }
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
      .subscribe(data => this.updateCurrentConditions({data, zip: zipcode}));
  }

  private updateCurrentConditions(condition: ConditionsAndZip, updateLocalStorage = true): void {
    const filteredConditions = this.currentConditions.value.filter(c => c.zip !== condition.zip)
    this.currentConditions.next([...filteredConditions, condition]);
    if(updateLocalStorage){
      this.localStorageService.saveToLocalStorage<CurrentConditions>('conditions', {...condition, id: condition.zip, timestamp: new Date().getTime()});
    }
  }

  getCurrentConditionsValue(): ConditionsAndZip[] {
    return this.currentConditions.value;
  }

  getCurrentConditionsAsSignal(): Signal<ConditionsAndZip[]> {
    return toSignal(this.currentConditions)
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const allForecasts = this.localStorageService.getFromLocalStorage<LocalStorageItem<Forecast>[]>('forecast');
    const forecast = allForecasts?.find((forecast: LocalStorageItem<Forecast>) => forecast.id === zipcode);
    if(forecast && this.localStorageService.isLocalStorageDataValid<Forecast>(forecast)){
      return of(forecast.data)
    }
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`).pipe(
      tap(forecast => {
        const newForecast: LocalStorageItem<Forecast> = {
          data: forecast,
          timestamp: new Date().getTime(),
          id: zipcode,
        };
        this.localStorageService.saveToLocalStorage<Forecast>('forecast', newForecast);
      }),
    );
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }
}
