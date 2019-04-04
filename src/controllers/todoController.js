const db = require('../models');

class TodoController {
  async list(req, res, next) {
    const dbTodo = await db.Todo.findAll({});

    return res.json(dbTodo);
  }

  async create(req, res, next) {
    const dbTodo = await db.Todo.create({
      text: req.body.text,
      complete: req.body.complete
    });

    return res.json(dbTodo);
  }

  async findOne(req, res, next) {
    const todoId = +req.params.todoId;

    if (!todoId) {
      return next({
        status: 400,
        message: 'todoId is a required numeric parameter'
      });
    }

    const dbTodo = await db.Todo.findOne({
      where: {
        id: todoId
      }
    });

    if (!dbTodo) {
      return next({
        status: 404,
        message: 'Not found'
      });
    }

    return res.json(dbTodo);
  }

  async update(req, res, next) {
    const dbTodo = await db.Todo.update(
      {
        text: req.body.text,
        complete: req.body.complete
      },
      {
        where: {
          id: req.params.todoId
        }
      }
    );

    return res.json(dbTodo);
  }

  async update2(req, res, next) {
    const dbTodo = await db.Todo.update(
      {
        text: req.body.text,
        complete: req.body.complete
      },
      {
        where: {
          id: req.params.todoId
        }
      }
    );

    return res.json(dbTodo);
  }

  async delete(req, res, next) {
    const dbTodo = await db.Todo.destroy({
      where: {
        id: req.params.id
      }
    });

    return res.json(dbTodo);
  }
}

module.exports = TodoController;
