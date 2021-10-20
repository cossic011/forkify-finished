import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchview';
import resultsview from './views/resultsview.js';
import paginationview from './views/paginationview.js';
import bookmarksview from './views/bookmarksview.js';
import addRecipeview from './views/addRecipeview.js';

//////////////////////////////////
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeview from './views/addRecipeview.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update resultws view to mark selected search result
    resultsview.update(model.getSearchResultPage());

    // Updating bookmarks view
    bookmarksview.update(model.state.bookmarks);

    // 1. Loading Recipe
    await model.loadRecipe(id);
    // 2. Rendering recipe
    recipeView.render(model.state.recipe);

    // TEST
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsview.renderSpinner();
    console.log(resultsview);

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    // resultsview.render(model.state.search.results);
    resultsview.render(model.getSearchResultPage(1));

    // 4. Render initial pagination buttons
    paginationview.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3. Render new results
  // resultsview.render(model.state.search.results);
  resultsview.render(model.getSearchResultPage(goToPage));

  // 4. Render new initial pagination buttons
  paginationview.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksview.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksview.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeview.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeview.renderMessage();

    // Render bookmark view
    bookmarksview.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeview.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeview.renderError(err.message);
  }
};

const init = function () {
  bookmarksview.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationview.addHandlerClick(controlPagination);
  addRecipeview.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};
init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
