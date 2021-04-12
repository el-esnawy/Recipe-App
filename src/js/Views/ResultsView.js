import View from './View.js';
import PreviewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found for your query! please try again :)`;
  _successMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
