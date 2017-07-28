import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { BaMenuService } from '../../services';

@Component({
  selector: 'ba-hoz-menu',
  templateUrl: './baHozMenu.component.html',
  styleUrls: ['./baHozMenu.component.scss']
})
export class BaHozMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabset') tabset;
  public menuItems: any[];
  protected _menuItemsSub: Subscription;

  constructor(
    private _router: Router,
    private _service: BaMenuService,
  ) { }

  ngOnInit(): void {
    this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
  }

  ngAfterViewInit(): void {
    this.setCurrentActiveTab();
  }

  setCurrentActiveTab(): void {
    const activeRoute = this._service.getCurrentItem();
    this.tabset.select(activeRoute.title);
  }

  onTabChange($event: NgbTabChangeEvent): void {
    const selectedRoute = this.menuItems.find((menuItem) => menuItem.title === $event.nextId);
    if (selectedRoute) {
      this._router.navigateByUrl('pages/' + selectedRoute.route.path);
    }
  }

  updateMenu(newMenuItems) {
    this.menuItems = newMenuItems;
  }

  ngOnDestroy(): void {
    this._menuItemsSub.unsubscribe();
  }
}
