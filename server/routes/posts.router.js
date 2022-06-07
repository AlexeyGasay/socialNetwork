const Router = require("express");
const postsController = require("../controllers/posts.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.get("/postsAll", postsController.getAllPosts); 
router.get("/loadMorePosts", postsController.loadMorePosts); 
router.get("/postsLiked", postsController.getLikedPosts); // лайкнутые посты опред юзера
router.get("/postLikes", postsController.getLikesPost); // лайки поста

router.get("/userPosts", postsController.getUserPosts); // посты опред юзера

router.post("/likePost", postsController.likePost); 
router.delete("/dislikePost", postsController.dislikePost);


router.get("/postFiles", postsController.getPostFiles); // файлы поста


router.post("/post", authMiddleware, postsController.createPost);









module.exports = router;
