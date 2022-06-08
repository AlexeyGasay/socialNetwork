const Router = require("express");
const friendsController = require("../controllers/friends.controller");
const router = new Router();


router.post("/friendRequest", friendsController.sendFriendRequest);
router.get("/getMyFriendsAndRequests", friendsController.getMyFriendsAndRequests);
router.get("/searchPeople", friendsController.searchPeople);
router.get("/getUserInfo", friendsController.getUserInfo);
router.patch("/acceptOrDeclineFriendRequest", friendsController.acceptOrDeclineFriendRequest);





module.exports = router;



