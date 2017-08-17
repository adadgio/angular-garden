import { ElectronAngularPage } from './app.po';

describe('electron-angular App', () => {
  let page: ElectronAngularPage;

  beforeEach(() => {
    page = new ElectronAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
