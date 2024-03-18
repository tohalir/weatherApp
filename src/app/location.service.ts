import { Injectable, Signal, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageItem } from './shared/type/local-storage-item.type';

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  private locations = signal<string[]>([]);

  constructor(
    private localStorageService: LocalStorageService,
  ) {
    const locations = this.localStorageService.getFromLocalStorage<LocalStorageItem<string>[]>('locations')
    if (locations){
      locations.forEach(loc => this.addLocation(loc.data));
    }
    }

  getLocations(): Signal<string[]> {
    return this.locations.asReadonly();
  }

  addLocation(zipcode : string) {
    if(this.locations().includes(zipcode)){return}
    this.locations.update(locations => [...locations, zipcode]);
    this.localStorageService.saveToLocalStorage<string>('locations', {data: zipcode, id: zipcode, timestamp: new Date().getTime()})
  }

  removeLocation(zipcode : string) {
    const locs = this.locations();
    let index = locs.indexOf(zipcode);
    if (index !== -1){
      locs.splice(index, 1);
      this.locations.update(locations => locs);
      this.localStorageService.removeFromLocalStorage('locations', zipcode);
    }
  }
}
