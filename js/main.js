const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.pageYOffset;
    
 sections.forEach((current) => {
   const sectionHeight = current.offsetHeight,
         sectionTop = current.offsetTop - 50,
         sectionId = current.getAttribute('id');
   if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
     document
       .querySelector('.nav__item a[href*=' + sectionId + ']') 
       .classList.add('active__link');
    } else {
       document
       .querySelector('.nav__item a[href*=' + sectionId + ']')
       .classList.remove('active__link');
    }
   });
}

window.addEventListener('scroll', scrollActive);

// cart

let shop = document.getElementById("shop");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let generateShop = () => {
  return (shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, price, desc, img } = x;
      let search = basket.find((x) => x.id === id) || [];
      return `
    <div id=product-id-${id} class="item itc-slider__item">
      <div class="item__wrapper">
          <img src=${img} alt="product-logo">
          <div class="details">
            <h3>${name}</h3>
            <p>${desc}</p>
            <button class="btn" data-path="${id}">Подробнее</button>
            <div class="price-quantity">
              <h2>${price} руб.</h2>
              <div class="buttons">
                <span onclick="decrement(${id})" class="bi bi-dash-lg"></span>
                <div id=${id} class="quantity">
                ${search.item === undefined ? 0 : search.item}
                </div>
                <span onclick="increment(${id})" class="bi bi-plus-lg"> Добавить</span>
              </div>
            </div>
          </div>
        </div>
    </div>
    `;
    })
    .join(""));
};
generateShop();
//__________modal___________
let modalsContainer = document.querySelector(".modal-overlay");

let generateModals = () => {

  let modalContent = (modalsContainer.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, price, desc, img, videoId } = x;
      //let search = basket.find((x) => x.id === id) || [];
      return `
    <div class="modal modal-${id}" data-target="${id}">
      <button class='btn-close bi bi-x-lg'></button>

      ${videoId ? 
        `
        <div class="video">
          <a class="video__link" href="https://youtu.be/${videoId}">
              <picture>
                  <source srcset="https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp" type="image/webp">
                  <img class="video__media" src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg" alt="${name}">
              </picture>
          </a>
          <button class="video__button" aria-label="Запустить видео">
              <svg width="68" height="48" viewBox="0 0 68 48"><path class="video__button-shape" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path class="video__button-icon" d="M 45,24 27,14 27,34"></path></svg>
          </button>
        </div>
        `
        : ''}
      
      <div class="modal__description">
        <p>${name}</p>
        <p>${desc}</p>
        <p>Цена ${price} руб.</p>
        
      </div>
    </div>
    `;
    })
    .join(""));
    
  return modalContent;
};
generateModals();
//__________________________
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

  // console.log(basket);
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
  // console.log(basket);
  localStorage.setItem("data", JSON.stringify(basket));
};
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  // console.log(search.item);
  document.getElementById(id).innerHTML = search.item;
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();

//-------------modal-------------
const btns = document.querySelectorAll('.btn');
const modalOverlay = document.querySelector('.modal-overlay ');
const modals = document.querySelectorAll('.modal');
const closeBtn = document.querySelectorAll('.btn-close'); 

btns.forEach((el) => {
	el.addEventListener('click', (e) => {
		let path = e.currentTarget.getAttribute('data-path');

		modals.forEach((el) => {
			el.classList.remove('modal--visible');
		});

		document.querySelector(`[data-target="${path}"]`).classList.add('modal--visible');
        /* scroll-lock when modal visible */
        document.querySelector('html').classList.add('stop-scroll');
      /* ------------------------------ */
		modalOverlay.classList.add('modal-overlay--visible');
    closeBtn.forEach( (el) => {
      el.addEventListener('click', function modalCloser() {
          closeModal(modalCloser);
      });
    });

	});
});

modalOverlay.addEventListener('click', (e) => {
	if (e.target == modalOverlay) {
		closeModal();
	}
});
const closeModal = (modalCloser) => {
    let iframes = document.querySelectorAll('iframe');
    for (iframe of iframes){
      iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    }
    modalOverlay.classList.remove('modal-overlay--visible');
     /* scroll-unlock when modal unvisible */
    document.querySelector('html').classList.remove('stop-scroll');
    /*----------------------- */
		modals.forEach((el) => {
			el.classList.remove('modal--visible');
		});
    closeBtn.forEach( (el) => {
      el.removeEventListener('click', modalCloser);
    })
};
