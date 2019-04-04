const asyncMiddleware = require('./asyncMiddleware');

test('pass error to callback', async () => {
  const mockCallback = jest.fn();

  const fn = asyncMiddleware(async (event, context, callback) => {
    throw Error('broken');
  });

  await fn(null, null, mockCallback);

  expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('no error should not cause callback to be called', async () => {
  const mockCallback = jest.fn();

  const fn = asyncMiddleware(async (event, context, callback) => {});

  await fn(null, null, mockCallback);

  expect(mockCallback).not.toHaveBeenCalled();
});
