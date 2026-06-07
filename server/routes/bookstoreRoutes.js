const express = require('express');
const controller = require('../controllers/_bookstoreController');
const authController = require('../controllers/authController');
const collectBookstoreRouter = require('./collectBookstoreRoutes');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.use(authController.restrictTo(['admin', 'dev', 'representative']));

router.use('/:bookstoreId/collect-bookstore', collectBookstoreRouter);

router
  .route('/')
  .get(controller.getDataByFilter, controller.getAll)
  .post(controller.createOne);

router.route('/all').get(controller.getAllNoPagination);

router
  .route('/:id')
  .get(controller.getOne)
  .patch(controller.updateOne)
  .delete(controller.deleteOne);

module.exports = router;
