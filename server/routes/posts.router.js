const Router = require("express");
const postsController = require("../controllers/posts.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.get("/postsAll", postsController.getAllPosts); 
router.get("/loadMorePosts", postsController.loadMorePosts); // загрузить больше постов в ленте
// router.get("/searchPosts", postsController.searchPosts); // Поиск постов 


// router.get("/loadMoreUserPosts", postsController.loadMoreUserPosts); // загрузить больше постов опред юзера

router.get("/postComments", postsController.getPostComments);
router.post("/postComment", postsController.sendPostComment);
router.get("/loadMorePostComments", postsController.getMorePostComments);

router.get("/postsLiked", postsController.getLikedPosts); // лайкнутые посты опред юзера
router.get("/postsLikedId", postsController.getLikedPostsId); // лайкнутые посты опред юзера (Id)
router.get("/postLikes", postsController.getLikesPost); // лайки поста
router.post("/likePost", postsController.likePost); 
router.delete("/dislikePost", postsController.dislikePost);


router.get("/userPosts", postsController.getUserPosts); // посты опред юзера

router.get("/postFiles", postsController.getPostFiles); // файлы поста

router.post("/post", authMiddleware, postsController.createPost);









module.exports = router;
