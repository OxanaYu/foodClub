const API = "http://localhost:8000/recipes";

const divRecipe = document.querySelector(".recipe");
let prevBtn = document.querySelector(".pagination__btn--prev");
let nextBtn = document.querySelector(".pagination__btn--next");
let currentPage = 1;
let countPage = 1;
let searchValue = "";
let inpSearch = document.querySelector(".search__field");
let resultsList = document.querySelector(".results");
const searchBtn = document.querySelector(".search__btn");
let listItem;

//! =======================READ======================

async function readRecipe(test = currentPage) {
  const res = await fetch(`${API}?q=${searchValue}&_page=${test}&_limit=10`);
  const data = await res.json();

  // Очищаем предыдущие результаты
  resultsList.innerHTML = "";

  // Обновляем список результатов
  data.forEach((recipe) => {
    console.log(recipe.id);
    listItem = document.createElement("li");
    listItem.classList.add("preview");
    listItem.classList.add("result_item");

    listItem.innerHTML = `
      <a class="preview__link" href="#${recipe.recipe.id}" data-id="${recipe.id}"  >
        <figure class="preview__fig">
          <img src="${recipe.recipe.image_url}" alt="${recipe.recipe.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.recipe.title}</h4>
          <p class="preview__publisher">${recipe.recipe.publisher}</p>
        </div>
      </a>
    `;

    resultsList.appendChild(listItem);
  });

  // Обновляем пагинацию
  pageFunc();
}

//! ===========================SEARCH=======================

let test = currentPage;

// Функция, которая будет вызываться при сабмите формы
function handleSearch(event) {
  event.preventDefault(); // Предотвращаем стандартное поведение формы
  searchValue = inpSearch.value.trim();
  currentPage = 1;
  inpSearch.value = "";
  readRecipe(currentPage);
}

// Обработчик события на кнопке поиска
searchBtn.addEventListener("click", handleSearch);

// Обработчик события на форме для обработки нажатия клавиши Enter
document.querySelector(".search").addEventListener("submit", handleSearch);

//! =========================PAGINATION===================
function pageFunc() {
  fetch(API)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 10);
    });
}
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  test++;
  readRecipe();
});

nextBtn.addEventListener("click", async () => {
  if (currentPage >= countPage) return;

  currentPage++;

  // Проверяем, есть ли еще результаты на следующей странице
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=10`
  );
  const data = await res.json();

  if (data.length === 0) {
    // Если результатов нет, не увеличиваем currentPage и завершаем функцию
    currentPage--;
    return;
  }

  readRecipe();
});

// !====================Detailed view====================================

// Обработчик события на результаты поиска

resultsList.addEventListener("click", (event) => {
  // Проверяем, был ли клик на элементе с классом "preview__link"
  const clickedListItem = event.target.closest(".preview__link");
  console.log(clickedListItem);

  if (clickedListItem) {
    // Получаем id рецепта из атрибута данных data-id
    const recipeId = clickedListItem.dataset.id;
    console.log(recipeId);

    // Убеждаемся, что recipeId не пустой
    if (recipeId) {
      showRecipeDetails(recipeId);
    }
  }
});

// Функция для отображения детального обзора рецепта
// Функция для отображения детального обзора рецепта
function showRecipeDetails(recipeId) {
  fetch(`${API}/${recipeId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Recipe with id ${recipeId} not found`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      // Проверяем, есть ли данные перед их использованием
      if (data.recipe) {
        // Очищаем содержимое divRecipe
        divRecipe.innerHTML = "";

        // Создаем элементы для отображения детального обзора
        divRecipe.innerHTML = `
        <figure class="recipe__fig">
          <img src="${
            data.recipe.image_url
          }" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${data.recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="./img/icons.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              data.recipe.cooking_time
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="./img/icons.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              data.recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="./img/icons.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="./img/icons.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${data.recipe.ingredients
              .map(
                (elem) =>
                  `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="./img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  elem.quantity !== null ? elem.quantity : ""
                }</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${elem.unit}</span> ${
                    elem.description
                  }
                </div>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              data.recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${data.recipe.source_url}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="./img/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;

        // Добавляем информацию о рецепте, используя data без .recipe
        // Например: data.publisher, data.ingredients и т.д.
      } else {
        console.error(`Recipe data not found for id ${recipeId}`);
      }
    })
    .catch((error) => {
      console.error("Error fetching recipe details:", error);
    });
}
