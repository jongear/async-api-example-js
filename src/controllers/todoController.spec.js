const mockTodo = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: params => {
    return null;
  }
};

jest.mock('../models', () => ({
  Todo: mockTodo
}));

const TodoController = require('./todoController');
const mockRes = {
  json: jest.fn()
};
const mockNext = jest.fn();
const resSpy = jest.spyOn(mockRes, 'json');

describe('TodoController', () => {
  beforeAll(async () => {
    mockTodo.findAll.mockClear();
    mockTodo.findOne.mockClear();
    mockRes.json.mockClear();
    mockNext.mockClear();
    resSpy.mockClear();
  });

  describe('list', () => {
    const todoModelFindAllSpy = jest.spyOn(mockTodo, 'findAll');

    beforeAll(async () => {
      todoModelFindAllSpy.mockClear();
    });

    test('calling list with empty db, returns an empty array', async () => {
      const resultingVal = [];

      mockTodo.findAll.mockImplementationOnce(() => resultingVal);

      const target = new TodoController();

      await target.list({}, mockRes, mockNext);

      expect(resSpy).toHaveBeenCalled();
      expect(resSpy).toHaveBeenCalledWith(resultingVal);
    });
    test('calling list returns array of objects', async () => {
      const resultingVal = [
        {
          id: 1,
          text: 'first todo',
          complete: false
        }
      ];

      mockTodo.findAll.mockImplementationOnce(() => resultingVal);

      const target = new TodoController();

      await target.list({}, mockRes, mockNext);

      expect(resSpy).toHaveBeenCalled();
      expect(resSpy).toHaveBeenCalledWith(resultingVal);
    });
  });

  describe('findOne', () => {
    describe('given an invalid todoId parameter', () => {
      test('next is called with a status of 400', async () => {
        const target = new TodoController();

        const req = { params: { todoId: 'banana' } };
        await target.findOne(req, mockRes, mockNext);

        const expected = {
          status: 400,
          message: 'todoId is a required numeric parameter'
        };

        expect(mockNext).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(expected);
      });

      test('db.Todo.findOne is never ran', async () => {
        const target = new TodoController();

        const req = { params: { todoId: 'banana' } };
        await target.findOne(req, mockRes, mockNext);

        const expected = {
          status: 400,
          message: 'todoId is a required numeric parameter'
        };

        expect(mockTodo.findOne).not.toHaveBeenCalled();
      });
    });
  });

  describe('create', () => {});
});
