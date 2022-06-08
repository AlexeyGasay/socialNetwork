const Router = require("express");
const authController = require("../controllers/auth.controller");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");


router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.get('/users', authMiddleware, authController.getUsers);


module.exports = router;
