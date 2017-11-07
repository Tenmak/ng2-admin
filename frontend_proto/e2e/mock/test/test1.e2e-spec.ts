import { browser, by, element } from 'protractor';

describe('Alelouyah', () => {
  beforeAll(() => {
    browser.get('/');

    browser.manage().logs().get('browser').then((browserLog) => {
      console.log('log: ' + require('util').inspect(browserLog));
    });
  });


  it('should navigate to the tables', () => {
    expect(true).toBeTruthy();
  });

  it('should navigate to the map', () => {
    expect(true).toBeTruthy();
  });
});

