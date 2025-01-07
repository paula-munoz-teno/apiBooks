const {Router} = require ("express")
const router = Router();
const usersCtrl = require("../controller/user.controller")

router.post("/register", usersCtrl.postRegister);
router.post("/login", usersCtrl.postLogin);

module.exports = router;