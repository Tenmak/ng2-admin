import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import { Routes, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { Ng2SmartTableModule } from 'ng2-smart-table/ng2-smart-table.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgaModule } from 'app/theme/nga.module';

import { PagesComponent } from './../../pages.component';
import { TablesComponent } from './../tables.component';
import { ProfileComponent } from './profiles.component';
import { Profile } from './profiles.interface';

import { ProfileService } from './profiles.service';

const mockRoutes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      { path: 'tables', component: TablesComponent }
    ]
  }
];

class ProfileServiceStub {
  getAllProfiles(): Observable<Profile[]> {
    const profiles: Profile[] = [
      {
        id: 1,
        libelle: 'test',
        typeProfilId: 1,
        typeProfilLibelle: 'test'
      }
    ];

    return Observable.of(profiles);
  }
}

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Ng2SmartTableModule,
        TranslateModule.forRoot(),
        NgaModule.forRoot()
      ],
      declarations: [ProfileComponent],
      providers: [
        {
          provide: ProfileService, useClass: ProfileServiceStub
        }
      ]
    })
    // .compileComponents();  // Not needed with Webpack (from Angular-CLI)
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ProfileComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load data in the smart-table datasource', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.source.count()).toBeGreaterThan(0);
  }));
});
