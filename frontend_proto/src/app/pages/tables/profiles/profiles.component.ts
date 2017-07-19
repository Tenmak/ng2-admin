import { Component, OnInit } from '@angular/core';

import { ProfileService } from './profiles.service';
import { LocalDataSource } from 'ng2-smart-table';

import { Profile } from './profiles.interface';

@Component({
  selector: 'reflex-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfileComponent implements OnInit {

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

  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.profileService.getAllProfiles().subscribe((profiles: Profile[]) => {
      // console.log(profiles);
      this.source.load(profiles);
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
