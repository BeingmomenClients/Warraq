const express = require('express');
const controller = require('../controllers/_bookController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/all').get(controller.getAllNoPagination);

router
  .route('/')
  .get(controller.getAll)
  .post(
    authController.protect,
    authController.restrictTo(['admin', 'dev']),
    controller.createOne
  );

router
  .route('/for-representative')
  .get(
    authController.protect,
    authController.restrictTo(['representative']),
    controller.getDataByFilter,
    controller.getAllForRepresentative
  );

router
  .route('/:id')
  .get(controller.getOne)
  .patch(
    authController.protect,
    authController.restrictTo(['admin', 'dev']),
    controller.updateOne
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin', 'dev']),
    controller.deleteOne
  );

module.exports = router;
