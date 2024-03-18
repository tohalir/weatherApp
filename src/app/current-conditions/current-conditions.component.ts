import { Component, computed, effect, inject, Signal } from '@angular/core';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { LocationService } from "../location.service";
import { WeatherService } from "../weather.service";
import { LocalStorageService } from 'app/local-storage.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private weatherService = inject(WeatherService);
  private locationService = inject(LocationService);

  protected locations: Signal<string[]> = this.locationService.getLocations();
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditionsAsSignal();
  protected tabs = computed(() => 
    this.locations()
      .map(l => {
        const currentCondition = this.currentConditionsByZip().find(currentCondition => currentCondition.zip === l);
        return {label: `${currentCondition?.data.name} (${currentCondition?.zip})`, id: currentCondition?.zip}})
      .filter(val => !!val.id)
  );

  protected localStorageExpirationTime: number = this.localStorageService.getLocalStorageExpiration();

  constructor(
    private localStorageService: LocalStorageService
  ){
    effect(() => {
      const locs = this.locations()
      //if no conditions loaded yet -> load all
      if(this.weatherService.getCurrentConditionsValue().length === 0){
        locs.forEach(l => this.weatherService.addCurrentConditions(l));
        return;
      }
      //load last added location
      const last = locs[locs.length - 1];
      if(!last){return;}
      this.weatherService.addCurrentConditions(last);
    },
    {allowSignalWrites: true}
   );
  }

  onTabRemoved(id: string): void {
    this.locationService.removeLocation(id);
  }

  onExpirationTimeChange(time: number): void {
    this.localStorageService.setLocalStorageExpiration(time);
  }
}

