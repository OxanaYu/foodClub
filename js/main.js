document.addEventListener("DOMContentLoaded", () => {
  const API = "http://localhost:8000/recipes";

  const divRecipe = document.querySelector(".recipe");
  let prevBtn = document.querySelector(".pagination__btn--prev");
  let nextBtn = document.querySelector(".pagination__btn--next");
  let currentPage = 1;
  let countPage = 1;
  let searchValue = "";
  let inpSearch = document.querySelector(".search__field");
  let resultsList = document.querySelector(".results");
  let searchBtn = document.querySelector(".search__btn");
  let listItem;
  let inpTitle = document.querySelector(".inpTitle");
  let inpUrl = document.querySelector(".inpUrl");
  let inpImg = document.querySelector(".inpImg");
  let inpPublisher = document.querySelector(".inpPublisher");
  let inpTime = document.querySelector(".inpTime");
  let inpServings = document.querySelector(".inpServings");
  let inpIngr1 = document.querySelector(".inpIngr1");
  let inpIngr2 = document.querySelector(".inpIngr2");
  let inpIngr3 = document.querySelector(".inpIngr3");
  let inpIngr4 = document.querySelector(".inpIngr4");
  let inpIngr5 = document.querySelector(".inpIngr5");
  let inpIngr6 = document.querySelector(".inpIngr6");
  let btnCloseModal = document.querySelector(".btn--close-modal");
  let btnDelete = document.querySelector(".btnDelete");
  let editBtn;

  let elId;

  //! =======================READ======================

  async function readRecipe(test = currentPage) {
    const res = await fetch(`${API}?q=${searchValue}&_page=${test}&_limit=10`);
    const data = await res.json();

    // Очищаем предыдущие результаты
    resultsList.innerHTML = "";

    // Обновляем список результатов
    data.forEach((recipe) => {
      //console.log(recipe.id);
      listItem = document.createElement("li");
      listItem.classList.add("preview");
      listItem.classList.add("result_item");

      listItem.innerHTML = `
      <a class="preview__link" href="#${recipe.recipe.id}" id="${recipe.id}" data-id="${recipe.id}"  >
        <figure id="${recipe.id}"   class="preview__fig">
          <img id="${recipe.id}"  src="${recipe.recipe.image_url}" alt="${recipe.recipe.title}" />
        </figure>
        <div id="${recipe.id}"  class="preview__data">
          <h4 id="${recipe.id}"  class="preview__title">${recipe.recipe.title}</h4>
          <p id="${recipe.id}"  class="preview__publisher">${recipe.recipe.publisher}</p>
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
    readRecipe(currentPage);
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

    readRecipe(currentPage);
  });

  // !====================Detailed view====================================

  // Обработчик события на результаты поиска

  resultsList.addEventListener("click", (event) => {
    // Проверяем, был ли клик на элементе с классом "preview__link"
    const clickedListItem = event.target.closest(".preview__link");
    //console.log(clickedListItem);
    // btnDelete = document.querySelector(".btnDelete");
    // btnEdit = document.querySelector(".btnEdit");

    if (clickedListItem) {
      // Получаем id рецепта из атрибута данных data-id
      const recipeId = clickedListItem.dataset.id;
      //console.log(recipeId);

      // Убеждаемся, что recipeId не пустой
      if (recipeId) {
        showRecipeDetails(recipeId);
      }
    }

    // btnDelete = document.querySelector(".btnDelete");
    // btnEdit = document.querySelector(".btnEdit");
  });

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
        //console.log(data);
        // Проверяем, есть ли данные перед их использованием
        if (data.recipe) {
          // Очищаем содержимое divRecipe
          divRecipe.innerHTML = "";
          divRecipe.setAttribute("id", `${data.id}`);
          //console.log(data.id);

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
        </div>
      
        
        `;
          let divBtns = document.createElement("div");
          divBtns.classList.add("btns_container");
          btnDelete = document.createElement("button");
          btnDelete.classList.add("delete");
          btnDelete.classList.add("btnDelete");
          btnDelete.innerText = "DELETE";
          editBtn = document.createElement("button");
          editBtn.classList.add("edit");
          editBtn.classList.add("btnEdit");
          editBtn.innerText = "EDIT";
          divRecipe.append(divBtns);
          divBtns.append(btnDelete);
          divBtns.append(editBtn);
          btnDelete.setAttribute("id", `${data.id}`);
          editBtn.setAttribute("id", `${data.id}`);
          editBtn.setAttribute("data-id", data.id);
          // const localbtnEdit = document.querySelector(".btnEdit");
          const localbtnEdit = document.querySelector(".btnEdit");
          editBtn = localbtnEdit;

          console.log(editBtn);

          editBtn.addEventListener("click", () => {
            editRecipeModal.style.display = "block";
            overlayEdit.style.display = "block";
          });
        } else {
          console.error(`Recipe data not found for id ${recipeId}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching recipe details:", error);
      });
  }

  // ! =============Create==== Добавляем рецепт =============================

  const addRecipeButton = document.querySelector(".nav__btn--add-recipe");
  const addRecipeWindow = document.querySelector(".add-recipe-window");
  const overlay = document.querySelector(".overlay");

  function createReceipe(newRecipe) {
    fetch(API, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(newRecipe),
    });
  }

  addRecipeButton.addEventListener("click", () => {
    addRecipeWindow.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  });

  overlay.addEventListener("click", () => {
    addRecipeWindow.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  btnCloseModal.addEventListener("click", () => {
    addRecipeWindow.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  });

  const recipeForm = document.querySelector(".upload");

  recipeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let newRecipe = {
      recipe: {
        publisher: inpPublisher.value,
        ingredients: [
          {
            quantity: inpIngr1.value,
            unit: inpIngr1.value,
            description: inpIngr1.value,
          },
          {
            quantity: inpIngr2.value,
            unit: inpIngr2.value,
            description: inpIngr2.value,
          },
          {
            quantity: inpIngr3.value,
            unit: inpIngr3.value,
            description: inpIngr3.value,
          },
          {
            quantity: inpIngr4.value,
            unit: inpIngr4.value,
            description: inpIngr4.value,
          },
          {
            quantity: inpIngr5.value,
            unit: inpIngr5.value,
            description: inpIngr5.value,
          },
          {
            quantity: inpIngr6.value,
            unit: inpIngr6.value,
            description: inpIngr6.value,
          },
        ],
        source_url: inpUrl.value,
        image_url: inpImg.value,
        title: inpTitle.value,
        servings: inpServings.value,
        cooking_time: inpTime.value,
      },
    };
    createReceipe(newRecipe);
    readRecipe(currentPage);
  });

  // ! ================DELETE=================================

  document.addEventListener("click", (e) => {
    let del_id = e.target.id;
    //console.log(e.target.id);
    let del_class = [...e.target.classList];

    if (del_class.includes("btnDelete")) {
      // Remove the recipe from the database
      fetch(`${API}/${del_id}`, {
        method: "DELETE",
      }).then(() => readRecipe());

      // Clear the detailed view
      divRecipe.innerHTML = "";
    }
  });

  //! ===========================EDIT============================
  const overlayEdit = document.querySelector("#overlay");
  const editRecipeModal = document.querySelector("#editRecipeModal");
  const btnCloseEditModal = document.querySelector("#btnCloseEditModal");
  const btnEditSave = document.querySelector(".btnEditSave");

  // Обработчик события для кнопки редактирования
  document.addEventListener("click", (e) => {
    let edit_class = [...e.target.classList];
    console.log(e.target.id);
    let id = e.target.id;
    if (edit_class.includes("btnEdit")) {
      // Получаем данные рецепта по id
      fetch(`${API}/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Recipe with id ${id} not found`);
          }
          return res.json();
        })
        .then((data) => {
          // Заполняем форму редактирования данными рецепта
          document.querySelector(".inpEditTitle").value = data.recipe.title;
          document.querySelector(".inpEditUrl").value = data.recipe.source_url;
          document.querySelector(".inpEditImg").value = data.recipe.image_url;
          document.querySelector(".inpEditPublisher").value =
            data.recipe.publisher;
          document.querySelector(".inpEditTime").value =
            data.recipe.cooking_time;
          document.querySelector(".inpEditServings").value =
            data.recipe.servings;

          // Заполняем ингредиенты
          document.querySelector(".inpEditIngr1").value =
            data.recipe.ingredients[0].description;
          document.querySelector(".inpEditIngr2").value =
            data.recipe.ingredients[1].description;
          document.querySelector(".inpEditIngr3").value =
            data.recipe.ingredients[2].description;
          document.querySelector(".inpEditIngr4").value =
            data.recipe.ingredients[3].description;
          document.querySelector(".inpEditIngr5").value =
            data.recipe.ingredients[4].description;
          document.querySelector(".inpEditIngr6").value =
            data.recipe.ingredients[5].description;

          // Устанавливаем id для кнопки сохранения изменений
          btnEditSave.setAttribute("data-id", data.id);

          console.log(data.id);
        })
        .catch((error) => {
          console.error("Error fetching recipe details:", error);
        });
    }
  });

  btnEditSave.addEventListener("click", (event) => {
    event.preventDefault();
    let editRecipe = {
      publisher: document.querySelector(".inpEditPublisher").value,
      ingredients: [
        { description: document.querySelector(".inpEditIngr1").value },
        { description: document.querySelector(".inpEditIngr2").value },
        { description: document.querySelector(".inpEditIngr3").value },
        { description: document.querySelector(".inpEditIngr4").value },
        { description: document.querySelector(".inpEditIngr5").value },
        { description: document.querySelector(".inpEditIngr6").value },
      ],
      source_url: document.querySelector(".inpEditUrl").value,
      image_url: document.querySelector(".inpEditImg").value,
      title: document.querySelector(".inpEditTitle").value,
      servings: document.querySelector(".inpEditServings").value,
      cooking_time: document.querySelector(".inpEditTime").value,
    };

    console.log("Edit Recipe Data:", editRecipe);
    console.log("Recipe ID:", btnEditSave.id);

    editRecipeFunc(editRecipe, btnEditSave.id);
    console.log(btnEditSave.id);
  });

  function editRecipeFunc(editRecipe, id) {
    console.log(`${API}/${id}`);
    fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editRecipe),
    }).then(() => readRecipe(currentPage));
  }

  // editBtn.addEventListener("click", () => {
  //   editRecipeModal.style.display = "block";
  //   overlayEdit.style.display = "block";
  // });
  // Обработчик события для кнопки закрытия модального окна редактирования
  btnCloseEditModal.addEventListener("click", () => {
    editRecipeModal.style.display = "none";
    overlayEdit.style.display = "none";
  });
});
