export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'tables',
        data: {
          menu: {
            title: 'general.menu.tables',
            icon: 'ion-ios-list-outline',
            selected: false,
            expanded: false,
            order: 600,
          }
        }
      },
      // {
      //   path: 'maps/esrimaps',
      //   data: {
      //     menu: {
      //       title: 'general.menu.esri_maps',
      //       icon: 'ion-ios-location-outline',
      //       selected: false,
      //       expanded: false,
      //       order: 600,
      //     }
      //   },
      // },
    ]
  }
];