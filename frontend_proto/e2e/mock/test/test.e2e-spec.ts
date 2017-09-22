import { browser, by, element } from 'protractor';

xdescribe('Protractor testing suite with TypeScript', () => {
  beforeAll(() => {
    browser.get('/');

    browser.manage().logs().get('browser').then((browserLog) => {
      console.log('log: ' + require('util').inspect(browserLog));
    });
  });

  describe('Protractor first test suite', () => {
    it('should navigate to the tables', () => {
      const navigationTablesButton = element(by.id('general.menu.tables'));
      navigationTablesButton.click();

      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          return url.includes('tables');
        })
      })
        .then((resolved) => {
          expect(resolved).toBeTruthy();
          browser.waitForAngularEnabled(true);
        })
        .then(() => {
          const tableFirstRow = element.all(by.css('ng2-smart-table-cell')).first();
          const tableFirstCellData = tableFirstRow.$('table-cell-view-mode').$('div').$('div').getText()
            .then((value) => {
              expect(value).toBe('1');
            });
        });
    });

    it('should navigate to the map', () => {
      // Prevents breaking for long async tasks (such as navigation with lazy-load)
      browser.waitForAngularEnabled(false);

      const navigationMapButton = element(by.id('general.menu.esri_maps'));
      navigationMapButton.click();

      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          return url.includes('esrimaps');
        })
      })
        .then((resolved) => {
          expect(resolved).toBeTruthy();
        })
        .then(() => {
          const map = element(by.className('esri-maps'));
          map.getAttribute('data-loaded')
            .then((result) => {
              console.log(result);
              expect(result).toBeDefined();
            });
        });
    });
  });
});
