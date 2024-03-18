import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Tab } from './tab.type';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {

  @Input() set tabs(value: Tab[]) {
    if(value){
      value.filter(newTab => !this._tabs.some(tab => tab.id === newTab.id)).forEach(newTab => this._tabs.push(newTab));
      if(!this.activeTab){
        this.onSelectTab(this._tabs[0]?.id);
      }
    }
  }
  @Input() tabTemplate: TemplateRef<ElementRef>;
  @Input() tabContent: TemplateRef<ElementRef>;
  @Input() activeTab: string;
  @Output() onTabRemoved = new EventEmitter<string>()
  protected _tabs: Tab[] = [];

  constructor() { }

  onSelectTab(id: string): void {
    this.activeTab = id;
  }

  onRemoveTab(id: string): void {
    if(id === this.activeTab){
      this.resolveActiveTabAfterDelete(id);
    }
    this._tabs = this._tabs.filter(t => t.id !== id);
    this.onTabRemoved.emit(id)
  }

  private resolveActiveTabAfterDelete(id: string): void {
    const activeTabIndex = this._tabs.findIndex(t => t.id === id);
    const nextTab = this._tabs[activeTabIndex + 1]?.id
    if(nextTab){
      this.onSelectTab(nextTab)
      return;
    }
    const prevTab = this._tabs[activeTabIndex - 1]?.id;
    if(prevTab){
      this.onSelectTab(prevTab)
      return
    }
    this.onSelectTab(null);
  }

}
