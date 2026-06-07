const express = require('express');
const controller = require('../controllers/_collectRepresentativeController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(controller.getDataByFilter, controller.getAll)
  .post(
    authController.protect,
    authController.restrictTo(['admin', 'dev']),
    controller.startTransaction,
    controller.createOne,
    controller.updateUserOrRepresentative,
    controller.commitTransactionAndRespond,
    controller.handleTransactionError
  );

router
  .route('/:id')
  .get(controller.getOne)
  .patch(
    authController.protect,
    authController.restrictTo(['admin', 'dev']),
    controller.startTransaction,
    controller.getOldCollect,
    controller.updateOne,
    controller.updateUserOrRepresentative,
    controller.commitTransactionAndRespond,
    controller.handleTransactionError
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin', 'dev']),
    controller.startTransaction,
    controller.deleteOne,
    controller.revertAllChanges,
    controller.commitTransactionAndRespond,
    controller.handleTransactionError
  );

module.exports = router;
