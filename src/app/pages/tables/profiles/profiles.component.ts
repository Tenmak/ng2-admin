import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { Profile } from './profiles.interface';

import { ProfileService } from './profiles.service';

@Component({
  selector: 'reflex-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfileComponent implements OnInit {
  temp = true;
  query = '';

  settings = {
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number'
      },
      libelle: {
        title: 'Libelle',
        type: 'string'
      },
      typeProfilLibelle: {
        title: 'Type Profil',
        type: 'string'
      },
      typeProfilId: {
        title: 'Type Profil ID',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  loader = 1;

  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    if (this.temp) {
      this.loader = 0;
      this.source.load(this.addMockData());
    } else {
      this.profileService.getAllProfiles().subscribe(
        (profiles: Profile[]) => {
          // console.log(profiles);
          this.source.load(profiles);
          this.loader = 0;
        },
        () => {
          console.error('Unable to load data in the smartTable');
          this.loader = 0;
        });
    }
  }

  addMockData(): Profile[] {
    return [
      {
        id: 1,
        libelle: 'toto',
        typeProfilId: 1,
        typeProfilLibelle: 'toto'
      },
      {
        id: 2,
        libelle: 'tata',
        typeProfilId: 2,
        typeProfilLibelle: 'tata'
      }
    ];
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
