document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let selectedSize = null;

  const cartIcon = document.querySelector('#cart-count');
  const addToCartButton = document.querySelector('.add-to-cart');
  const cartContainer = document.getElementById('cart-container');

  function updateCartIcon() {
    let cartCount = cart.length;
    if (cartCount > 0) {
      cartIcon.style.display = 'inline';
      cartIcon.textContent = cartCount;
    } else {
      cartIcon.style.display = 'none';
    }
  }

  // Обробка вибору розміру
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.getAttribute('data-size');
      console.log('Обрано розмір:', selectedSize);
    });
  });

  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
      const selectedSizeBtn = document.querySelector('.size-btn.selected');
      if (!selectedSizeBtn) {
        alert('Будь ласка, оберіть розмір перед додаванням до кошика.');
        return;
      }

      const productTitle = document.querySelector('.product-title').textContent;
      const productPrice = document.querySelector('.product-price').textContent;
      const productImage = document.querySelector('.product-page-image').src;
      const size = selectedSizeBtn.getAttribute('data-size');

      const product = {
        title: productTitle,
        price: productPrice,
        image: productImage,
        size: size,
        quantity: 1,
      };

      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartIcon();
      alert(`Додано до кошика розмір: ${size}`);
    });
  }

  function renderCartItems() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
  
    if (cart.length === 0) {
      cartContainer.classList.add("empty");
      cartContainer.innerHTML = "<p class='empty-cart'>Ваш кошик порожній</p>";
  
      const subtotal = document.getElementById('subtotal');
      const total = document.getElementById('total');
      if (subtotal && total) {
        subtotal.textContent = "₴0";
        total.textContent = "₴0";
      }
  
      return;
    }
    
    else {
      cartContainer.classList.remove("empty");
    }

    cartContainer.innerHTML = '';

    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');

      cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.title}" />
      </div>
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>Ціна: ${item.price}</p>
        <p>Розмір: <strong>${item.size}</strong></p>
      </div>
    
        <div class="cart-item-actions">
          <button class="decrease-quantity">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase-quantity">+</button>
          <button class="remove-item">Видалити</button>
        </div>
      `;

      cartContainer.appendChild(cartItem);

      cartItem.querySelector('.increase-quantity').addEventListener('click', () => {
        item.quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartIcon();
      });

      cartItem.querySelector('.decrease-quantity').addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCartItems();
          updateCartIcon();
        }
      });

      cartItem.querySelector('.remove-item').addEventListener('click', () => {
        cart = cart.filter(cartProduct => cartProduct.title !== item.title);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartIcon();
      });
    });

    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');
    if (subtotal && total) {
      const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('₴', '')) * item.quantity, 0);
      subtotal.textContent = `₴${totalPrice}`;
      total.textContent = `₴${totalPrice}`;
    }
  }

  updateCartIcon();
  renderCartItems();

  // Колір футболки
  window.changeShirtColor = function(color) {
    const shirtImage = document.getElementById('shirtImage');
    if (color === 'blue') {
      shirtImage.src = "pic/blue-shirt.png";
    } else if (color === 'black') {
      shirtImage.src = "pic/black-shirt.png";
    } else if (color === 'white') {
      shirtImage.src = "pic/white-shirt.png";
    }
  }

  // Мобільне меню
  window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('show');
  }

  // Промокоди
  window.applyPromoCode = function () {
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
});

const checkoutBtn = document.getElementById('checkout-btn');

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    alert('Дякуємо за покупку!');

    // Очищаємо кошик: і в localStorage, і в пам'яті
    localStorage.removeItem('cart');
    cart = [];

    // Оновлюємо вміст сторінки одразу
    if (typeof renderCartItems === 'function') renderCartItems();
    if (typeof updateCartIcon === 'function') updateCartIcon();
  });
}




