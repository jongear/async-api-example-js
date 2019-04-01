const asyncMiddleware = require('../middleware/asyncMiddleware');
const TodoController = require('../controllers/todoController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = new TodoController();

router
  .get(
    '/',
    asyncMiddleware(async (req, res, next) => {
      return ctrl.list(req, res, next);
    })
  )
  .post(
    '/',
    asyncMiddleware(async (req, res, next) => {
      return ctrl.create(req, res, next);
    })
  )
  .get(
    '/:todoId',
    asyncMiddleware(async (req, res, next) => {
      return ctrl.findOne(req, res, next);
    })
  )
  .put(
    '/:todoId',
    asyncMiddleware(async (req, res, next) => {
      return ctrl.update(req, res, next);
    })
  )
  .delete(
    '/:todoId',
    asyncMiddleware(async (req, res, next) => {
      return ctrl.delete(req, res, next);
    })
  );

module.exports = router;
