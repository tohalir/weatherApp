import { Injectable } from '@angular/core';
import { LocalStorageItem } from './shared/type/local-storage-item.type';

export type LocalStorageKey = 'conditions' | 'forecast' | 'locations'

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

private localStorageExpiration = 7200000;

constructor() { }

getLocalStorageExpiration(): number {
  return this.localStorageExpiration;
}

setLocalStorageExpiration(time: number): void {
  this.localStorageExpiration = time;
}

getFromLocalStorage<T>(key: LocalStorageKey): T {
  return JSON.parse(localStorage.getItem(key))
}

//works for array data, in future expand for other types
saveToLocalStorage<T>(key: LocalStorageKey, data: LocalStorageItem<T>): void {
  const savedData = localStorage.getItem(key);
  if(!savedData){
    localStorage.setItem(key, JSON.stringify([data]));
    return;
  }
  const storedConditionsParsed = JSON.parse(savedData);
  if(Array.isArray(storedConditionsParsed)){
    localStorage.setItem(key, JSON.stringify([...storedConditionsParsed.filter(c => c.id !== data.id), data]));
  }
}

//works for array data, in future expand for other types
removeFromLocalStorage(key: LocalStorageKey, id: string): void {
  const savedData = localStorage.getItem(key);
  if(!savedData){return;}
  const savedDataParsed = JSON.parse(savedData)
  if(Array.isArray(savedDataParsed)){
    localStorage.setItem(key, JSON.stringify(savedDataParsed.filter(d => d.id !== id)));
  }
}

//return false if data is older then expiration time
isLocalStorageDataValid<T>(data: LocalStorageItem<T>): boolean {
  if(!data?.timestamp){return false}
  return new Date().getTime() - data.timestamp < this.localStorageExpiration;
}

}
