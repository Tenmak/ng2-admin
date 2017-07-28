import { Component } from '@angular/core';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled = false;

  constructor() {
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
}
