const express = require('express');
const controller = require('../controllers/_statisticsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/',
  authController.protect,
  authController.restrictTo(['admin', 'dev']),
  controller.getStatistics
);

router.get(
  '/:id',
  authController.protect,
  authController.restrictTo(['admin', 'dev', 'representative']),
  controller.getIndividualRepresentativeStatistics
);

module.exports = router;
