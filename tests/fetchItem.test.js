require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fetchItem', () => {
  it('checks if "fetchItem" is a function', () => {
    expect.assertions(1);
    expect(typeof fetchItem).toBe('function');
  });

  it('expect that fetch has been called', async () => {
    expect.assertions(1);
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
  });

  it('checks if fetch use the right endpoint', async () => {
    expect.assertions(1);
    const url = 'https://api.mercadolibre.com/items/MLB1615760527'
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledWith(url);
  });

  it('expect that the returned object is correct', async () => {
    expect.assertions(1);
    const response = await fetchItem('MLB1615760527');
    expect(response).toEqual(item);
  });

  it('checks when no argument is passed an error occurs', async () => {
    expect.assertions(1);
    const response = await fetchItem();
    expect(response).toEqual(new Error('You must provide an url'))
  })
});
