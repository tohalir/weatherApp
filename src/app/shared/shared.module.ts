import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../environments/environment';
import { routing } from "../app.routing";
import { TabComponent } from './component/common/tab/tab.component';
import { CurrentConditionTabComponent } from './component/weather/current-condition-tab/current-condition-tab.component';

const components = [
  TabComponent,
  CurrentConditionTabComponent,
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ]
})
export class SharedModule { }
