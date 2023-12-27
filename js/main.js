const API = "https://rickandmortyapi.com/api/character";
const API2 = "http://localhost:8000/characters";

// Запросы. Домашняя работа

/* Задание №1.1. 
Сделайте запрос на адрес 'https://rickandmortyapi.com/api/character'.
Используйте fetch или ajax. Отобразите на странице имена персонажей из 
Рика и Морти в list. 
let block1 = $('.block1');
let list = $('.list');
(Вы можете стилизовать страницу по желанию.)
*/

let block1 = document.querySelector(".block1");
let list = document.querySelector(".list");
let block2 = document.querySelector(".block-2");
let list2 = document.querySelector(".list2");

async function readNames() {
  const res = await fetch(API);
  const data = await res.json();
  // console.log(data);
  // console.log(data.results);
  list.innerHTML = "";
  data.results.forEach((elem) => {
    list.innerHTML += `
    <div>
      <p class="paraName" >${elem.name}</p>
      <img class="imgRick" src="${elem.image}" />
      
    </div>   
  `;
  });
}
readNames();

/* Задание №1.2. 
Рядом с именами отобразите все изображения
которые вы получили вместе с остальными данными из сервера.
*/

// Сделано выше

/* Задание №1.3. 
Создайте файл db.json и запустите локальный сервер.
Данные которые вы получили во втором задании, сохраните 
в локальном сервере db.json, в массиве под 
названием "characters".
Подсказка: как только ваши данные сохранились в db.json
функцию, которая отправляет запрос на db.json стоит закомментировать.
*/

// let newData = [];

// async function readNames2() {
//   const res = await fetch(API);
//   const data = await res.json();
//   data.results.forEach((item) => {
//     newData.push({ charName: item.name, charImage: item.image });
//   });
//   postfromExternal(newData);
// }
// readNames2();

// function postfromExternal(newData2) {
//   console.log(newData2);
//   newData2.forEach((elem) => {
//     // console.log(elem);
//     fetch(API2, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json; charset=utf-8",
//       },
//       body: JSON.stringify({
//         chName: elem.charName,
//         chImg: elem.charImage,
//       }),
//     });
//   });
// }

// Задание №1.4.
// А теперь сделайте запрос на локальный сервер.
// Во второй блок с классом 'block-2', отобразите имена, которые
// вы получили (стянули) с db.json.

async function readNamesfromLocal() {
  const res = await fetch(API2);
  const data = await res.json();
  console.log(data);
  list2.innerHTML = "";
  data.forEach((elem) => {
    list2.innerHTML += `
    <div>
      <p class="paraName" >${elem.chName}</p>
      <img class="imgRick" src="${elem.chImg}" />

    </div>
  `;
  });
}
readNamesfromLocal();

/* Задание №1.5. 
К именам добавьте картинки персонажей.
В итоге у вас должна получиться точная копия первых двух тасков.
Отличие которых лишь в базе данных.
*/

//Сделано выше
