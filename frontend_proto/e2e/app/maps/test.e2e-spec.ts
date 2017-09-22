import { browser, by, element } from 'protractor';

describe('Map Module test suite', () => {
  beforeAll(() => {
    browser.get('/pages/maps/esrimaps');

    // browser.manage().logs().get('browser').then((browserLog) => {
    //   console.log('log: ' + require('util').inspect(browserLog));
    // });
  });

  it('should test something on the map', () => {
    // Prevents breaking for long async tasks (such as navigation with lazy-load)
    browser.waitForAngularEnabled(false);

    const map = element(by.className('esri-maps'));
    map.getAttribute('data-loaded')
      .then((result) => {
        console.log(result);
        expect(result).toBeDefined();
      });
  });
});
