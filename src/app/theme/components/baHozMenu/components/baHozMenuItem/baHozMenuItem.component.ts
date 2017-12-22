import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'ba-hoz-menu-item',
  templateUrl: './baHozMenuItem.component.html',
  styleUrls: ['./baHozMenuItem.component.scss']
})
export class BaHozMenuItemComponent implements OnChanges {
  @Input() menuItem: any;
  @Output() itemHover = new EventEmitter<any>();

  constructor() {

  }

  ngOnChanges() {
    if (this.menuItem) {
      console.log('menuItem => ', this.menuItem);
    }
  }

  public onHoverItem($event): void {
    this.itemHover.emit($event);
  }
}
