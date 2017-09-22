import { browser, by, element } from 'protractor';

describe('Tables Module test suite', () => {
  beforeAll(() => {
    browser.get('/pages/tables');

    // browser.manage().logs().get('browser').then((browserLog) => {
    //   console.log('log: ' + require('util').inspect(browserLog));
    // });
  });

  it('should test something on the table', () => {
    const tableFirstRow = element.all(by.css('ng2-smart-table-cell')).first();
    const tableFirstCellData = tableFirstRow.$('table-cell-view-mode').$('div').$('div').getText()
      .then((value) => {
        expect(value).toBe('1');
      });
  });
});
