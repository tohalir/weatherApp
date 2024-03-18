import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-current-condition-tab',
  templateUrl: './current-condition-tab.component.html',
  styleUrls: ['./current-condition-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionTabComponent {

  @Input() set activeLocation(value: string){
    this.resolveActiveLocation(value)
  }
  _activeLocation: ConditionsAndZip & {icon: string}

  constructor(
    private weatherService: WeatherService
  ) { }
  
  private resolveActiveLocation(id: string): void {
    if(!id){
      this._activeLocation = null;
      return;
    }
    const loc = this.weatherService.getCurrentConditionsValue().find(condition => condition.zip === id)
    if(!loc){return}
    this._activeLocation = {...loc, icon: this.weatherService.getWeatherIcon(loc.data.weather[0].id)};
  }

}
