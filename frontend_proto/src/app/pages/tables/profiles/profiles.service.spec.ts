import { async, TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { Profile } from './profiles.interface';
import { ProfileService } from './profiles.service';

describe('ProfileService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ProfileService,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  it('should create ProfileService', inject([ProfileService], (profileService) => {
    expect(profileService).toBeTruthy();
  }));

  describe('getAllProfiles()', () => {

    it('should return an Observable<Profile[]>', inject([ProfileService, XHRBackend], (profileService, mockBackend) => {
      const mockResponse: Profile[] = [
        {
          id: 1,
          libelle: 'test1',
          typeProfilId: 1,
          typeProfilLibelle: 'test1'
        },
        {
          id: 2,
          libelle: 'test2',
          typeProfilId: 2,
          typeProfilLibelle: 'test2'
        }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      profileService.getAllProfiles().subscribe((profiles) => {
        expect(profiles).toBeDefined();
        expect(profiles.length).toBe(2);
        expect(profiles[0].libelle).toEqual('test1');
        expect(profiles[1].libelle).toEqual('test2');
      });
    }));
  });
});
