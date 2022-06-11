const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('3 - Teste a função saveCartItems', () => {
  it('checks if "localStorage.setItem" method has been called', () => {
    expect.assertions(1);
    const item = '<ol><li>Item</li></ol>'
    saveCartItems(item);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('checks if "localStorage.setItem" is called with two arguments', () => {
    expect.assertions(1);
    const item = '<ol><li>Item</li></ol>'
    saveCartItems(item);
    expect(localStorage.setItem)
      .toHaveBeenCalledWith('cartItems', item);
  });
});
