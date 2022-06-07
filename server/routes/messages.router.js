const Router = require("express");
const messagesController = require("../controllers/messages.controller");
const router = new Router();


router.get("/getMyContacts", messagesController.getContacts);
router.get("/getMessages", messagesController.getOlderMessages);
router.get("/getLastMessages", messagesController.getLastMessages);
router.post("/sendMessage", messagesController.sendMessage);
// router.patch("/acceptOrDeclineFriendRequest", messagesController.acceptOrDeclineFriendRequest);
// router.delete("/user/:id", userController.deleteUser);





module.exports = router;



