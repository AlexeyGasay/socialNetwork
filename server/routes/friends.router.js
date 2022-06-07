const Router = require("express");
const friendsController = require("../controllers/friends.controller");
const router = new Router();


router.post("/friendRequest", friendsController.sendFriendRequest);
router.get("/getMyFriendsAndRequests", friendsController.getMyFriendsAndRequests);
router.patch("/acceptOrDeclineFriendRequest", friendsController.acceptOrDeclineFriendRequest);
// router.delete("/user/:id", userController.deleteUser);





module.exports = router;



