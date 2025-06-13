// Ініціалізація масиву для товарів у кошику
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Оновлюємо іконку кошика
const cartIcon = document.querySelector('#cart-count');
const addToCartButton = document.querySelector('.add-to-cart');
const cartContainer = document.getElementById('cart-container');

// Функція для оновлення кількості товарів в кошику
function updateCartIcon() {
  let cartCount = cart.length;
  if (cartCount > 0) {
    cartIcon.style.display = 'inline';
    cartIcon.textContent = cartCount;
  } else {
    cartIcon.style.display = 'none';
  }
}

// Додаємо товар в кошик
if (addToCartButton) {
  addToCartButton.addEventListener('click', () => {
    const productTitle = document.querySelector('.product-title').textContent;
    const productPrice = document.querySelector('.product-price').textContent;
    const productImage = document.querySelector('.product-page-image').src;

    const product = {
      title: productTitle,
      price: productPrice,
      image: productImage,
      quantity: 1,
    };

    cart.push(product);

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
  });
}

// Виведення товарів у кошику
function renderCartItems() {
  if (cart.length === 0) {
    cartContainer.classList.add("empty");
    document.getElementById("cart-items").innerHTML = "<p class='empty-cart'>Ваш кошик порожній</p>";
    updateTotalPrice();
    return;
  } else {
    cartContainer.classList.remove("empty");
  }

  cartContainer.innerHTML = '';  // Очищаємо контейнер

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.title}" />
      </div>
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>${item.price}</p>
      </div>
      <div class="cart-item-actions">
        <button class="decrease-quantity">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increase-quantity">+</button>
        <button class="remove-item">Видалити</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);

    // Збільшення кількості товару
    cartItem.querySelector('.increase-quantity').addEventListener('click', () => {
      item.quantity++;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartItems();
      updateCartIcon();
    });

    // Зменшення кількості товару
    cartItem.querySelector('.decrease-quantity').addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartIcon();
      }
    });

    // Видалення товару з кошика
    cartItem.querySelector('.remove-item').addEventListener('click', () => {
      cart = cart.filter(cartProduct => cartProduct.title !== item.title);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartItems();
      updateCartIcon();
    });
  });

  // Оновлення підсумків
  const subtotal = document.getElementById('subtotal');
  const total = document.getElementById('total');
  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('₴', '')) * item.quantity, 0);

  subtotal.textContent = `₴${totalPrice}`;
  total.textContent = `₴${totalPrice}`;
}

// Виведення товарів на сторінці кошика
renderCartItems();
updateCartIcon();

function changeShirtColor(color) {
    var shirtImage = document.getElementById('shirtImage');
    if(color === 'blue') {
        shirtImage.src = "pic/blue-shirt.PNG"; // Заміна на синю футболку
    } else if(color === 'black') {
        shirtImage.src = "pic/black-shirt.PNG"; // Заміна на чорну футболку
    } else if(color === 'white') {
        shirtImage.src = "pic/white-shirt.PNG"; // Заміна на білу футболку
    }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('show');
}

function applyPromoCode() {
  const promoInput = document.getElementById("promo-code").value.trim().toLowerCase();
  let discount = 0;

  if (promoInput === "vitzane10") {
    discount = 0.10;
  } else if (promoInput === "vitzane20") {
    discount = 0.20;
  } else {
    alert("Невірний промокод");
    return;
  }

  const subtotalText = document.getElementById("subtotal").textContent.replace("₴", "");
  const subtotal = parseFloat(subtotalText);
  const discountAmount = subtotal * discount;
  const discountedTotal = subtotal - discountAmount;

  document.getElementById("total").textContent = `₴${discountedTotal.toFixed(2)}`;

  // Додаткове виведення суми знижки
  const discountInfo = document.getElementById("discount-info");
  if (discountInfo) {
    discountInfo.textContent = `Знижка: -₴${discountAmount.toFixed(2)} (${discount * 100}%)`;
  } else {
    const info = document.createElement("div");
    info.id = "discount-info";
    info.style.marginTop = "10px";
    info.style.color = "green";
    info.textContent = `Знижка: -₴${discountAmount.toFixed(2)} (${discount * 100}%)`;
    document.querySelector(".cart-summary").appendChild(info);
  }

  alert(`Знижка ${discount * 100}% застосована!`);
}






