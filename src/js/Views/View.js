import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    console.log(data);
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const oldElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = oldElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        console.log(curEl);
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg><use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div><p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._successMessage) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

(function () {
  const bookmarkIcon = `<svg class="nav__icon"><use href="${icons}#icon-bookmark"></use></svg>`;
  const addRecipeIcon = `<svg class="nav__icon"><use href="${icons}#icon-edit"></use></svg>`;
  const searchIcon = `<svg class="search__icon"><use href="${icons}#icon-search"></use></svg>`;
  const uploadIcon = `<svg><use href="${icons}#icon-upload-cloud"></use></svg>`;

  document
    .querySelector('.nav__btn--bookmarks')
    .insertAdjacentHTML('afterbegin', bookmarkIcon);
  document
    .querySelector('.nav__btn--add-recipe')
    .insertAdjacentHTML('afterbegin', addRecipeIcon);
  document
    .querySelector('.search__btn')
    .insertAdjacentHTML('afterbegin', searchIcon);
  document
    .querySelector('.upload__btn')
    .insertAdjacentHTML('afterbegin', uploadIcon);
})();
