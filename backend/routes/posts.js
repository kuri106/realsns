const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// 投稿
router.post("/", async(req, res) => {
    const newPost = new Post(req.body);

    try{
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch(err) {
        return res.status(500).json(err);
    }
});

// 投稿の更新
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // 編集対象の登録ユーザと更新ユーザが一致
        if(post.userId === req.body.userId) {
            await post.updateOne( {
                $set: req.body,
            });
            return res.status(200).json("投稿編集に成功しました。");
        } else {
            return res.status(403).json("これはあなたの投稿ではありません");
        }
    } catch(err) {
        return res.status(403).json(err);
    }
});

// 投稿の削除
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(req.body.isAdmin);
        // 編集対象の登録ユーザと更新ユーザが一致
        if(post.userId === req.body.userId || req.body.isAdmin) {
            await post.deleteOne();
            return res.status(200).json("投稿を削除しました。");
        } else {
            return res.status(403).json("これはあなたの投稿ではありません");
        }
    } catch(err) {
        return res.status(403).json(err);
    }
});

// イイネ押下
router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //投稿にいいねが押されていないとき
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            return res.status(200).json("いいねを押しました。");
        } else {
            // いいね解除
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                },
            });
            return res.status(200).json("いいねを外しました。");
        }
        
    } catch(err) {
        return res.status(500).json(err);
    }
});

// 投稿の取得
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch(err){
        return res.status(500).json(err);
    }
});

// プロフィール専用のタイムライン取得
router.get("/profile/:username", async(req, res) => {
    try {
        // 自分の投稿を取得
        const user = await User.findOne({username: req.params.username});
        const posts = await Post.find({userId: user._id});

        // スプリット構文
        return res.status(200).json(posts);
    } catch(err) {
        return res.status(500).json(err);
    }
});

// タイムラインの投稿を取得
router.get("/timeline/:userId", async(req, res) => {
    try {
        // 自分の投稿を取得
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});

        //フォローユーザの投稿を取得
        const friendsPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        // スプリット構文
        return res.status(200).json(userPosts.concat(...friendsPosts));
    } catch(err) {
        return res.status(500).json(err);
    }
});
// router.get("/", (req, res) => {
//     res.send("posts router");
// });

module.exports = router;