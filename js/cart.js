let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
let amount;

calculation();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return `
      <div class="cart-item">
        <img src=${search.img} alt="" />
        <div class="details">

          <div class="title-price-x">
              <h4 class="title-price">
                <p>${search.name}</p>
                <p class="cart-item-price">${search.price} руб. / шт.</p>
              </h4>
              <i onclick="removeItem(${id})" class="remove-icon bi bi-x-lg"></i>
          </div>

          <div class="buttons">
              <i onclick="decrement(${id})" class="decrement bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i onclick="increment(${id})" class="increment bi bi-plus-lg"></i>
          </div>
          <hr>
          <h3 class="total">${item * search.price} руб.</h3>
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Вы пока ничего не добавили</h2>
    `;
  }
};

generateCartItems();

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  // console.log(search.item);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

let removeItem = (id) => {
  let selectedItem = id;
  // console.log(selectedItem.id);
  basket = basket.filter((x) => x.id !== selectedItem.id);
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
  basket = [];
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};
let order = () => {
  let nameField = document.querySelector('#name').value;
  let regular = /^\+375\d{2}\d{7}/;
  let phoneField = document.querySelector('#phone').value;
  
  if(nameField.trim().length > 1 && nameField.trim().length < 25){
    if(phoneField.trim().length !== 0 && regular.test(phoneField) && phoneField.length === 13){
      const TOKEN = '6113579328:AAHZY13MenQYfRSkaqM901gzdN7DHpTgHrI';
      const CHAT_ID = '-1001829262127';
      const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
      let orderMessage = `
            <b>Имя:</b>     ${nameField}

            <a href="tel:${phoneField}">${phoneField}</a>
            `;

          orderMessage += basket
          .map((x) => {
            let { id, item } = x;
            let search = shopItemsData.find((y) => y.id === id) || [];
            return `
            ---------позиция-------
            <b>Название:</b> ${search.name}
            <b>Цена за 1 :</b> ${search.price} руб.
            <b>Количество:</b> ${item} шт.
            <b>Цена за ${item} шт. :</b> ${item * search.price} руб.
          `;
          })
          .join("");
          orderMessage += `__________________________
          <b>Цена за всё:</b> ${amount} руб.
          `;

          axios.post(URL_API, {
              chat_id: CHAT_ID,
              parse_mode: 'html',
              text: orderMessage,
          })
          .then((res) => {
            clearCart();
            label.innerHTML = `
            <h2>Заявка отправлена! В ближайшее время с Вами свяжутся.</h2>
            <a href="index.html">
              <button class="HomeBtn">Вернуться</button>
            </a>
            `;
          })
          .catch((err) => {
              console.warn(err);
          })
          .finally(() => {
              console.log('Готово!');
          }); 
    } else {
      window.alert('Проверьте, верно ли введён номер');
    }
    return;
  } else {
    window.alert('Проверьте, верно ли введёно имя');
  }
};
let TotalAmount = () => {
  if (basket.length !== 0) {
    amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];

        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    // console.log(amount);
    label.innerHTML = `
    <h2 class="total-amount">Общая сумма: ${amount} руб.</h2>
    <div class="order-form">
      <div class="order-form__name">
        <label for="name">Введите Ваше имя:</label>
        <input type="text" id="name" name="name" required
          minlength="2" maxlength="12">
      </div>
      <div class="order-form__phone">
        <label for="phone">Введите Ваш номер телефона:</label>
        <input type="tel" id="phone" name="phone" placeholder="+375XXYYYYYYY" value="+375">
      </div>
      <button class="checkout" id="confirmOrder">Отправить заявку</button>
      <button onclick="clearCart()" class="removeAll">Очистить всю корзину</button>
    </div>
    `;
    document.querySelector('#confirmOrder').addEventListener('click', order);
  } else return;
};

TotalAmount();
