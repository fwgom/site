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
        <div class="modal__media"> 
        <iframe class="modal__video" src="https://www.youtube.com/embed/${videoId}?autoplay=0" frameborder="0" allowfullscreen></iframe>
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
      iframe.src = iframe.src;
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
