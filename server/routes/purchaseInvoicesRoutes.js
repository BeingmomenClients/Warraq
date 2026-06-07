const express = require('express');
const controller = require('../controllers/_purchaseInvoicesController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(controller.getAll)
  .post(
    authController.protect,
    authController.restrictTo(['representative']),
    controller.startTransaction,
    controller.checkBookStockAndCalculateTotal,
    controller.prepareInvoice,
    controller.generateSerialNumber,
    controller.createOne,
    controller.updateBookstore,
    controller.updateUserOrRepresentative,
    controller.adjustBookQuantity,
    controller.commitTransactionAndRespond,
    controller.handleTransactionError
  );

router
  .route('/:id')
  .get(controller.getOne)
  .patch(
    authController.protect,
    authController.restrictTo(['representative']),
    controller.startTransaction,
    controller.getOldInvoice,
    controller.checkBookStockAndCalculateTotal,
    controller.prepareInvoice,
    controller.updateOne,
    controller.updateBookstore,
    controller.updateUserOrRepresentative,
    controller.adjustBookQuantity,
    controller.commitTransactionAndRespond,
    controller.handleTransactionError
  )
  .delete(
    authController.protect,
    authController.restrictTo(['representative']),
    controller.startTransaction,
    controller.deleteOne,
    controller.revertAllChanges,
    controller.commitTransactionAndRespond,
    controller.handleTransactionError
  );

module.exports = router;
