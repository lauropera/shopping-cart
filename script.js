const cartItems = document.querySelector('.cart__items');
const totalPrices = document.querySelector('.total-price');
const itemsList = document.querySelector('.items');
const storageProducts = JSON.parse(getSavedCartItems());
let costumerProducts = getSavedCartItems() !== null ? storageProducts : [];

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const brlPrice = (value) => value
  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const createProductItemElement = ({ id, title, thumbnail, price }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(
    createCustomElement('div', 'item__price', brlPrice(price))
    );
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  itemsList.appendChild(section);
};

const getSkuFromProductItem = (item) =>
  item.querySelector('span.item__sku').innerText;

const round = (sum) => Math.round(((sum)) * 100) / 100;

const productsPrice = () => {
  const values = costumerProducts.map(({ price }) => price);
  const total = values.reduce((acc, value) => round(acc + value), 0);
  totalPrices.innerText = brlPrice(total);
};

const cartItemClickListener = (event) => {
  const product = event.target;
  const id = product.innerText.split(' ').find((word) => word.includes('MLB'));
  const itemToRemove = costumerProducts.find((item) => item.id === id);
  costumerProducts.splice(costumerProducts.indexOf(itemToRemove), 1);
  saveCartItems(JSON.stringify(costumerProducts));
  product.remove();
};

const createCartItemElement = ({ id, title, price, thumbnail }) => {
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.src = thumbnail;
  img.className = 'item__image';
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', () => productsPrice());
  img.addEventListener('click', (event) => event.target.parentNode.remove());
  li.appendChild(img);
  cartItems.appendChild(li);
  return { id, title, price, thumbnail };
};

const addToCart = () => {
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((btn) => btn.addEventListener('click', async () => {
    const productId = getSkuFromProductItem(btn.parentNode);
    const product = await fetchItem(productId);
    costumerProducts.push(createCartItemElement(product));
    saveCartItems(JSON.stringify(costumerProducts));
    productsPrice();
  }));
};

const loadingAPI = () => {
  const loading = createCustomElement('div', 'loading', '...carregando');
  itemsList.appendChild(loading);
};

const showProducts = async () => {
  const { results } = await fetchProducts('computador');
  const allProducts = results.map((product) => product);
  allProducts.forEach((product) => createProductItemElement(product));
  itemsList.querySelector('.loading').remove();
  addToCart();
};

const canClearCart = () => {
  const cleartCartBtn = document.querySelector('.empty-cart');
  cleartCartBtn.addEventListener('click', () => {
    cartItems.textContent = '';
    localStorage.removeItem('cartItems');
    costumerProducts = [];
    productsPrice()
  });
};

const restoreCostumerCart = () => {
  costumerProducts.forEach((product) => createCartItemElement(product));
  productsPrice();
};

const btnMobile = document.querySelector('#btn-mobile');
btnMobile.addEventListener('click', () => {
  const cart = document.querySelector('.cart');
  cart.classList.toggle('active');
});

window.onload = () => {
  loadingAPI();
  showProducts();
  canClearCart();
  restoreCostumerCart();
};
