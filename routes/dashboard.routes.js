const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
router.get('/lists/users', dashboardController.getUsers);
router.get('/lists', dashboardController.getDashboard);
