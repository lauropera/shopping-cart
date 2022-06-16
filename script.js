const cartItems = document.querySelector('.cart__items');
const totalPrices = document.querySelector('.total-price');
const itemsList = document.querySelector('.items');
const storageProducts = JSON.parse(getSavedCartItems());
let costumerCart = getSavedCartItems() !== null ? storageProducts : [];

const createProductImageElement = (imageSource, title) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  img.alt = `Imagem do produto ${title}`
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  if (innerText !== undefined) e.innerText = innerText;
  return e;
};

const brlPrice = (value) => value
  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const createProductItemElement = ({ id, title, thumbnail, price }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(
    createCustomElement('span', 'item__price', brlPrice(price))
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

const badgeIcon = (action, quantity) => {
  const badges = document.querySelectorAll('.badge');
  badges.forEach((badge) => {
    action !== 'refresh' ? badge.classList.remove('active') :
    badge.classList.add('active');
    badge.innerHTML = quantity;
  });
}

const productsPrice = () => {
  const values = costumerCart.map(({ price }) => price);
  const total = values.reduce((acc, value) => round(acc + value), 0);
  totalPrices.innerText = brlPrice(total);
};

const cartItemClickListener = (event) => {
  const product = event.target.parentNode;
  const id = product.innerText.split(' ').find((word) => word.includes('MLB'));
  const itemToRemove = costumerCart.find((item) => item.id === id);
  costumerCart.splice(costumerCart.indexOf(itemToRemove), 1);
  saveCartItems(JSON.stringify(costumerCart));
  badgeIcon('refresh', costumerCart.length);
  if (costumerCart.length === 0) badgeIcon('empty-cart');
  product.remove();
};

const createCartItemElement = ({ id, title, price, thumbnail }) => {
  const li = createCustomElement('li', 'cart__item');
  const img = createProductImageElement(thumbnail, title);
  const info = createCustomElement(
      'div', 'cart__item-info', `${title} \n ${brlPrice(price)}`
    )
  const remove = createCustomElement('i', 'material-icons', 'highlight_off');
  remove.classList.add('cart__remove')
  remove.addEventListener('click', cartItemClickListener);
  remove.addEventListener('click', () => productsPrice());
  li.appendChild(img);
  li.appendChild(info);
  li.appendChild(remove);
  cartItems.appendChild(li);
  return { id, title, price, thumbnail };
};

const addToCart = () => {
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((btn) => btn.addEventListener('click', async () => {
    const productId = getSkuFromProductItem(btn.parentNode);
    const product = await fetchItem(productId);
    costumerCart.push(createCartItemElement(product));
    saveCartItems(JSON.stringify(costumerCart));
    productsPrice();
    badgeIcon('refresh', costumerCart.length);
  }));
};

const loadingAPI = () => {
  const loading = createCustomElement('div', 'loading', 'Carregando...');
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
    costumerCart = [];
    productsPrice()
    badgeIcon('empty-cart');
  });
};

const restoreCostumerCart = () => {
  costumerCart.forEach((product) => createCartItemElement(product));
  if (costumerCart.length > 0) badgeIcon('refresh', costumerCart.length);
  productsPrice();
};

const btnMobile = document.querySelector('#btn-mobile');
btnMobile.addEventListener('click', () => {
  document.querySelector('.cart').classList.toggle('active');
});

window.onload = () => {
  loadingAPI();
  showProducts();
  canClearCart();
  restoreCostumerCart();
};
