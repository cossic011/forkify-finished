import View from './View';
import previewview from './previewview';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet! Find a nice recipe and bookmark it ;)`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewview.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
