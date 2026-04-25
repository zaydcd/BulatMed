// Товары
const products = [
  {
    id: "flow1",
    name: "Мёд цветочный, 0.5 кг",
    price: "450₽",
    priceValue: 450,
    img: "img/honey-flower.jpg",
  },
  {
    id: "flow2",
    name: "Мёд цветочный, 1 кг",
    price: "850₽",
    priceValue: 850,
    img: "img/honey-flower.jpg",
  },
  {
    id: "flow3",
    name: "Мёд цветочный, 3 кг",
    price: "2400₽",
    priceValue: 2400,
    img: "img/honey-flower.jpg",
  },
  {
    id: "buck1",
    name: "Мёд гречишный, 0.5 кг",
    price: "490₽",
    priceValue: 490,
    img: "img/honey-buckwheat.jpg",
  },
  {
    id: "buck2",
    name: "Мёд гречишный, 1 кг",
    price: "890₽",
    priceValue: 890,
    img: "img/honey-buckwheat.jpg",
  },
  {
    id: "buck3",
    name: "Мёд гречишный, 3 кг",
    price: "2500₽",
    priceValue: 2500,
    img: "img/honey-buckwheat.jpg",
  },
  {
    id: "sun1",
    name: "Мёд подсолнечниковый, 0.5 кг",
    price: "420₽",
    priceValue: 420,
    img: "img/honey-sunflower.jpg",
  },
  {
    id: "sun2",
    name: "Мёд подсолнечниковый, 1 кг",
    price: "790₽",
    priceValue: 790,
    img: "img/honey-sunflower.jpg",
  },
  {
    id: "sun3",
    name: "Мёд подсолнечниковый, 3 кг",
    price: "2200₽",
    priceValue: 2200,
    img: "img/honey-sunflower.jpg",
  },
  {
    id: "comb",
    name: "Мёд в сотах (300 г)",
    price: "650₽",
    priceValue: 650,
    img: "img/honey-comb.jpg",
  },
  {
    id: "gift",
    name: "Подарочный набор (2 сорта + ложка)",
    price: "1200₽",
    priceValue: 1200,
    img: "img/honey-gift.jpg",
  },
  {
    id: "royal",
    name: "Маточное молочко, 10 г",
    price: "890₽",
    priceValue: 890,
    img: "img/royal-jelly.jpg",
  },
  {
    id: "propolis",
    name: "Прополис шарики, 20 г",
    price: "350₽",
    priceValue: 350,
    img: "img/propolis.jpg",
  },
  {
    id: "perga",
    name: "Перга гранулы, 50 г",
    price: "520₽",
    priceValue: 520,
    img: "img/perga.jpg",
  },
];

let cart = [];

// === НАСТРОЙКА ПРОСМОТРА ФОТО ===
function setupImageViewer() {
  const modal = document.getElementById("imageViewerModal");
  const modalImg = document.getElementById("imageViewerImg");
  const closeBtn = document.querySelector(".image-viewer-close");

  if (!modal || !modalImg) return;

  function openViewer(imgSrc) {
    modal.style.display = "block";
    modalImg.src = imgSrc;
    document.body.style.overflow = "hidden";
  }

  function closeViewer() {
    modal.style.display = "none";
    modalImg.src = "";
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeViewer);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeViewer();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") closeViewer();
  });

  return openViewer;
}

// === ТЕЛЕФОН ===
function setupPhoneMask() {
  const phoneInput = document.getElementById("userPhone");
  if (!phoneInput) return;

  phoneInput.addEventListener("focus", function () {
    if (this.value === "" || this.value === "+7") {
      this.value = "+7";
    }
  });

  phoneInput.addEventListener("input", function (e) {
    let value = this.value;
    if (!value.startsWith("+7")) {
      this.value = "+7";
      return;
    }
    let digits = value.substring(2).replace(/\D/g, "");
    if (digits.length > 10) digits = digits.substring(0, 10);
    let formatted = "+7";
    if (digits.length > 0) formatted += " " + digits.substring(0, 3);
    if (digits.length > 3) formatted += " " + digits.substring(3, 6);
    if (digits.length > 6) formatted += " " + digits.substring(6, 8);
    if (digits.length > 8) formatted += " " + digits.substring(8, 10);
    this.value = formatted.trim();
  });

  phoneInput.addEventListener("blur", function () {
    if (this.value === "+7" || this.value === "+7 ") {
      this.value = "";
    }
  });
}

// === РАСЧЁТ ОБЩЕЙ СУММЫ ===
function calculateTotal() {
  let totalItems = 0;
  let totalAmount = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
    totalAmount += item.priceValue * item.quantity;
  });

  return { totalItems, totalAmount };
}

// === ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ СУММЫ ===
function updateTotalDisplay() {
  const { totalItems, totalAmount } = calculateTotal();
  const totalItemsSpan = document.getElementById("totalItemsCount");
  const totalAmountSpan = document.getElementById("totalAmount");
  const cartCountSpan = document.getElementById("cartCount");
  const navCartCountSpan = document.getElementById("navCartCount");

  if (totalItemsSpan) totalItemsSpan.textContent = totalItems;
  if (totalAmountSpan) totalAmountSpan.textContent = totalAmount + " ₽";
  if (cartCountSpan) cartCountSpan.textContent = totalItems;
  if (navCartCountSpan) navCartCountSpan.textContent = totalItems;
}

// === ОБНОВЛЕНИЕ КОРЗИНЫ ===
function updateCartDisplay() {
  const container = document.getElementById("selectedList");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="empty-cart">Корзина пуста<br>📦 Нажмите «Каталог товаров», чтобы добавить</div>';
    updateTotalDisplay();
    return;
  }

  let html = "";
  cart.forEach((item, index) => {
    const itemTotal = item.priceValue * item.quantity;
    html += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} × ${item.quantity} = ${itemTotal}₽</div>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-remove" data-id="${item.id}">✖</button>
                    <input type="number" min="1" value="${item.quantity}" class="cart-item-qty" data-id="${item.id}">
                </div>
            </div>
        `;
  });
  container.innerHTML = html;

  document.querySelectorAll(".cart-item-qty").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = input.dataset.id;
      let newQty = parseInt(input.value);
      if (isNaN(newQty) || newQty < 1) newQty = 1;
      const cartItem = cart.find((i) => i.id === id);
      if (cartItem) {
        cartItem.quantity = newQty;
        updateCartDisplay();
        // Обновляем отображение в каталоге, если открыт
        updateCatalogItemDisplay(id, newQty);
      }
    });
  });

  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      cart = cart.filter((item) => item.id !== id);
      updateCartDisplay();
      // Убираем отображение в каталоге для этого товара
      updateCatalogItemDisplay(id, 0);
    });
  });

  updateTotalDisplay();
}

// === ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ КОНКРЕТНОГО ТОВАРА В КАТАЛОГЕ ===
function updateCatalogItemDisplay(productId, quantity) {
  const catalogModal = document.getElementById("catalogModal");
  if (catalogModal && catalogModal.style.display === "block") {
    const productCard = document.querySelector(
      `.product-card[data-id="${productId}"]`,
    );
    if (productCard) {
      const addedInfo = productCard.querySelector(".added-info");
      const product = products.find((p) => p.id === productId);
      if (product && quantity > 0) {
        const totalPrice = product.priceValue * quantity;
        addedInfo.innerHTML = `✅ В корзине: ${quantity} шт (${totalPrice}₽)`;
        addedInfo.style.color = "#2F6B2F";
      } else {
        addedInfo.innerHTML = "";
      }
    }
  }
}

// === ДОБАВЛЕНИЕ В КОРЗИНУ ИЗ КАТАЛОГА ===
function addToCartFromCatalog(productId, quantityToAdd) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantityToAdd;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      priceValue: product.priceValue,
      quantity: quantityToAdd,
    });
  }

  updateCartDisplay();

  // Обновляем отображение в каталоге
  updateCatalogItemDisplay(
    productId,
    existing ? existing.quantity : quantityToAdd,
  );
}

// === РЕНДЕРИНГ КАТАЛОГА В МОДАЛЬНОМ ОКНЕ ===
function renderCatalogModal(openImageViewerFn) {
  const container = document.getElementById("catalog");
  if (!container) return;

  container.innerHTML = "";
  products.forEach((product) => {
    // Находим текущее количество товара в корзине
    const cartItem = cart.find((item) => item.id === product.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    const totalPrice = product.priceValue * currentQty;

    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", product.id);
    card.innerHTML = `
            <div class="product-img">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price}</div>
                
                <div class="product-quantity-control">
                    <input type="number" min="1" value="1" class="catalog-qty-input" data-id="${product.id}" step="1">
                </div>
                
                <button class="btn-add-custom" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-pricevalue="${product.priceValue}">
                    🛒 Добавить в корзину
                </button>
                <div class="added-info">${currentQty > 0 ? `✅ В корзине: ${currentQty} шт (${totalPrice}₽)` : ""}</div>
            </div>
        `;
    container.appendChild(card);
  });

  // Обработчики для кнопки "Добавить в корзину"
  document.querySelectorAll(".btn-add-custom").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      const qtyInput = document.querySelector(
        `.catalog-qty-input[data-id="${id}"]`,
      );
      let qtyToAdd = qtyInput ? parseInt(qtyInput.value) : 1;
      if (isNaN(qtyToAdd) || qtyToAdd < 1) qtyToAdd = 1;

      addToCartFromCatalog(id, qtyToAdd);

      btn.textContent = "✓ Добавлено!";
      setTimeout(() => {
        btn.textContent = "🛒 Добавить в корзину";
      }, 1000);
    });
  });

  // Обработчики для фото
  if (openImageViewerFn) {
    document.querySelectorAll(".product-img").forEach((imgContainer) => {
      const img = imgContainer.querySelector("img");
      if (img) {
        imgContainer.addEventListener("click", (e) => {
          e.stopPropagation();
          if (img.src) openImageViewerFn(img.src);
        });
      }
    });
  }
}

// === МОДАЛЬНОЕ ОКНО КАТАЛОГА ===
function setupCatalogModal(openImageViewerFn) {
  const modal = document.getElementById("catalogModal");
  const openBtn = document.getElementById("openCatalogBtn");
  const closeBtn = document.getElementById("closeCatalogBtn");
  const closeX = modal.querySelector(".close-modal");

  function openModal() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    renderCatalogModal(openImageViewerFn);
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeX) closeX.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") closeModal();
  });
}

// === ПРОКРУТКА К КОРЗИНЕ ===
function setupCartScroll() {
  const cartBtn = document.getElementById("openCartBtn");
  const cartSection = document.getElementById("cartSection");

  if (cartBtn && cartSection) {
    cartBtn.addEventListener("click", () => {
      cartSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

// === ФОРМИРОВАНИЕ ЗАЯВКИ ===
function getOrderText() {
  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const { totalAmount } = calculateTotal();

  const orderLines = cart
    .map(
      (item) =>
        `- ${item.name} — ${item.quantity} шт × ${item.price} = ${item.priceValue * item.quantity}₽`,
    )
    .join("\n");
  const orderSection = orderLines === "" ? "- нет товаров -" : orderLines;

  let text = `🍯 ЗАКАЗ МЁДА 🍯\n\n`;
  text += `👤 Имя: ${name || "Не указано"}\n`;
  if (phone) text += `📞 Телефон: ${phone}\n`;
  if (email) text += `✉️ Email: ${email}\n`;
  text += `\n📦 Состав заказа:\n${orderSection}\n`;
  text += `\n💰 Итого к оплате: ${totalAmount} ₽\n\n`;
  text += `📍 Пасека: Татарстан, г. Бавлы, с. Новозареченск\n`;
  text += `🙏 Пожалуйста, свяжитесь со мной для подтверждения заказа.`;

  return text;
}

function validatePhone() {
  const phone = document.getElementById("userPhone").value.trim();
  if (phone && !phone.startsWith("+7")) {
    alert("⚠️ Телефон (если указан) должен начинаться с +7");
    return false;
  }
  return true;
}

function copyToBuffer() {
  const name = document.getElementById("userName").value.trim();
  if (!name) {
    alert("Пожалуйста, укажите ваше имя");
    return;
  }
  if (!validatePhone()) return;

  const text = getOrderText();
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("✅ Заявка скопирована в буфер обмена");
    })
    .catch(() => alert("❌ Ошибка копирования"));
}

function sendToEmail() {
  const name = document.getElementById("userName").value.trim();
  if (!name) {
    alert("Пожалуйста, укажите ваше имя");
    return;
  }
  if (!validatePhone()) return;

  const text = getOrderText();
  const subject = encodeURIComponent("🍯 Заказ мёда с пасеки | Татарстан");
  const body = encodeURIComponent(text);
  window.location.href = `mailto:med@bavly-tat.ru?subject=${subject}&body=${body}`;
  alert("✉️ Откроется почтовый клиент\nПолучатель: med@bavly-tat.ru");
}

function sendToMessenger() {
  const name = document.getElementById("userName").value.trim();
  if (!name) {
    alert("Пожалуйста, укажите ваше имя");
    return;
  }
  if (!validatePhone()) return;

  const text = getOrderText();
  const encoded = encodeURIComponent(text);
  const useWhatsApp = confirm(
    "📱 Отправить в WhatsApp?\n\nOK — WhatsApp\nОтмена — Telegram",
  );

  let url = useWhatsApp
    ? `https://wa.me/79991234567?text=${encoded}`
    : `https://t.me/share/url?url=${encodeURIComponent("Заказ мёда")}&text=${encoded}`;
  window.open(url, "_blank");
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener("DOMContentLoaded", () => {
  setupPhoneMask();
  const openImageViewer = setupImageViewer();
  setupCatalogModal(openImageViewer);
  setupCartScroll();
  updateCartDisplay();

  document.getElementById("copyBtn").addEventListener("click", copyToBuffer);
  document.getElementById("emailBtn").addEventListener("click", sendToEmail);
  document
    .getElementById("messengerBtn")
    .addEventListener("click", sendToMessenger);
});
