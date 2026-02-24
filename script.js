const products = [
  {
    id: 1,
    name: 'Wireless Earbuds',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Classic Sneakers',
    price: 54.5,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Smart Watch',
    price: 79.0,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Minimal Backpack',
    price: 44.25,
    image:
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80',
  },
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const readCart = () => JSON.parse(localStorage.getItem('shopvia-cart') || '[]');
const writeCart = (cart) => localStorage.setItem('shopvia-cart', JSON.stringify(cart));

function addToCart(productId) {
  const cart = readCart();
  const found = cart.find((item) => item.id === productId);
  if (found) found.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  writeCart(cart);
  syncCartCount();
}

function updateQty(productId, change) {
  const cart = readCart()
    .map((item) =>
      item.id === productId ? { ...item, qty: Math.max(0, item.qty + change) } : item
    )
    .filter((item) => item.qty > 0);

  writeCart(cart);
  syncCartCount();
  renderCartPage();
  renderCheckoutSummary();
}

function detailedCart() {
  return readCart()
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.id),
    }))
    .filter((item) => item.product);
}

function cartTotal() {
  return detailedCart().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function syncCartCount() {
  const count = readCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach((el) => {
    el.textContent = count;
  });
}

function renderProductsPage() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${currency.format(product.price)}</p>
        <button class="button" data-add="${product.id}">Add to cart</button>
      </article>
    `
    )
    .join('');

  container.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.add)));
  });
}

function renderCartPage() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container || !totalEl) return;

  const items = detailedCart();
  if (items.length === 0) {
    container.innerHTML = '<p>Your cart is empty. Add some products first.</p>';
    totalEl.textContent = currency.format(0);
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.product.name}</strong>
          <p>${currency.format(item.product.price)} each</p>
        </div>
        <div class="qty-controls">
          <button data-change="-1" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button data-change="1" data-id="${item.id}">+</button>
        </div>
      </div>
    `
    )
    .join('');

  totalEl.textContent = currency.format(cartTotal());

  container.querySelectorAll('[data-change]').forEach((button) => {
    button.addEventListener('click', () => {
      updateQty(Number(button.dataset.id), Number(button.dataset.change));
    });
  });
}

function renderCheckoutSummary() {
  const list = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');
  const form = document.getElementById('checkout-form');
  const message = document.getElementById('checkout-message');

  if (!list || !totalEl || !form || !message) return;

  const items = detailedCart();
  list.innerHTML = items.length
    ? items
        .map((item) => `<p>${item.product.name} × ${item.qty}</p>`)
        .join('')
    : '<p>No items in cart.</p>';

  totalEl.textContent = currency.format(cartTotal());

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (items.length === 0) {
      message.textContent = 'Your cart is empty. Add products before placing order.';
      return;
    }

    form.reset();
    writeCart([]);
    syncCartCount();
    renderCheckoutSummary();
    message.textContent = 'Order placed! Next step: connect this form to your payment gateway.';
  });
}

syncCartCount();
renderProductsPage();
renderCartPage();
renderCheckoutSummary();
