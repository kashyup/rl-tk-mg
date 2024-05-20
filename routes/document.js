const express = require('express');
const documentController = require('../controllers/documentController');
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post('/documents', authenticateToken, documentController.createDocument);
router.post('/documents/addUserRole', authenticateToken, documentController.addUserRoleToDocument);

module.exports = router;