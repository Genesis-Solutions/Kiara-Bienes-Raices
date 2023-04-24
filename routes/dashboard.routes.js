const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
router.get('/dashboard/get_users', dashboardController.getUsers);
router.get('/dashboard', dashboardController.getDashboard);
