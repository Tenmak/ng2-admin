import { Injectable } from '@angular/core';

import { Feed } from './feed.interface';

@Injectable()
export class FeedService {

  private _data: Feed[] = [
    {
      text: `Migration de la plateforme effectuée avec succès.
      Merci de penser à changer vos paramètres FTP !
      Pour toute question ou problème merci de contacter : administrateur.reflex@stif.info`,
      time: '13/02/2017',
      ago: '4 months ago',
      expanded: false
    }
  ];

  getData() {
    return this._data;
  }
}
