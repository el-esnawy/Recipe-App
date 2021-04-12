import * as model from './model.js';
import RecipeView from './Views/RecipeView.js';
import SearchView from './Views/SearchView.js';
import ResultsView from './Views/ResultsView.js';
import BookmarksView from './Views/BookmarksView.js';
import PaginationView from './Views/PaginationView.js';
import AddRecipeView from './Views/AddRecipeView.js';
import { MODAL_CLOSE_TIME } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return RecipeView.renderMessage();
    RecipeView.renderSpinner();

    ResultsView.update(model.getSearchResultsPage());

    BookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    RecipeView.render(model.state.recipe);
  } catch (error) {
    RecipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();
    const query = SearchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);

    ResultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons

    PaginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlServings = function (newServings) {
  // update recipe servings
  model.updateServings(newServings);
  //update the recipe view
  // RecipeView.render(model.state.recipe);
  RecipeView.update(model.state.recipe);
};

const controlPagination = function (page) {
  model.state.search.page = page;
  ResultsView.render(model.getSearchResultsPage(page));
  PaginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  //add or remove booksmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  //update recipe view
  RecipeView.update(model.state.recipe);

  //render bookamrks
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    AddRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    RecipeView.render(model.state.recipe);

    AddRecipeView.renderMessage();

    BookmarksView.render(model.state.bookmarks);

    setTimeout(() => {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIME * 1000);
    //change ID In the url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (error) {
    console.error(error.message, '😒');
    AddRecipeView.renderError(error.message);
  }
};
const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const init = function () {
  BookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
