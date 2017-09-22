import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';

import { Ng2SmartTableModule } from 'ng2-smart-table/ng2-smart-table.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgaModule } from 'app/theme/nga.module';

import { ProfileComponent } from './profiles.component';
import { Profile } from './profiles.interface';

import { ProfileService } from './profiles.service';

export class ProfileServiceStub {
  getAllProfiles(): Observable<Profile[]> {
    const profiles: Profile[] = [
      {
        id: 1,
        libelle: 'test',
        typeProfilId: 1,
        typeProfilLibelle: 'test'
      },
      {
        id: 2,
        libelle: 'test2',
        typeProfilId: 2,
        typeProfilLibelle: 'test2'
      }
    ];
    return observableDelay(profiles, 1000);
    // return Observable.of(profiles);
  }
}

function observableDelay(value: any, delayMs: number) {
  return Observable.interval(delayMs).take(1).map(() => value);
}

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;

  // async beforeEach
  beforeEach(async(() => {
    // TestBed.compileComponents();  // Not needed with Webpack (from Angular-CLI)
  }));

  // synchronous beforeEach
  beforeEach(() => {
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
      ],
      schemas: [
        // NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ProfileComponent', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Using Jasmine's 'done()' function to catch the delay of the observable. FakeAsync() and tick() don't work
   */
  xit('should load data in the smart-table datasource', (done) => {
    expect(component.source.count()).toBe(0);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.source.count()).toBeGreaterThan(0);
      done();
    });
  });
});
