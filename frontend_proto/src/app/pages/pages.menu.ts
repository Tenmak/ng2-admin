export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'maps/esrimaps',
        data: {
          menu: {
            title: 'general.menu.esri_maps',
            icon: 'ion-ios-location-outline',
            selected: false,
            expanded: false,
            order: 600,
          }
        },
      },
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
      }
    ]
  }
];

// export const PAGES_MENU = [
//   {
//     path: 'pages',
//     children: [
//       {
//         path: 'tables',
//         data: {
//           menu: {
//             title: 'Profils et utilisateurs',
//             // icon: 'ion-android-home',
//             selected: false,
//             expanded: false,
//             order: 0
//           }
//         }
//       },
//       {
//         path: 'toto',
//         data: {
//           menu: {
//             title: 'Suivi et indicateurs',
//             // icon: 'ion-ios-location-outline',
//             selected: false,
//             expanded: false,
//             order: 600,
//           }
//         },
//       },
//       {
//         path: 'tutu',
//         data: {
//           menu: {
//             title: 'Alimentations',
//             // icon: 'ion-ios-list-outline',
//             selected: false,
//             expanded: false,
//             order: 600,
//           }
//         }
//       },
//       {
//         path: 'tote',
//         data: {
//           menu: {
//             title: 'Alertes et logs applicatifs',
//             // icon: 'ion-ios-list-outline',
//             selected: false,
//             expanded: false,
//             order: 600,
//           }
//         }
//       },
//       {
//         path: 'tete',
//         data: {
//           menu: {
//             title: 'Paramétrage applicatif',
//             // icon: 'ion-ios-list-outline',
//             selected: false,
//             expanded: false,
//             order: 600,
//           }
//         }
//       }
//     ]
//   }
// ];
