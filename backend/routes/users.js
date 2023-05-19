const router = require("express").Router();
const user = require("../models/User");
const User = require("../models/User");

//ユーザ情報更新
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });

            return res.status(200).json("ユーザー情報が更新されました。");
        } catch(err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("これはあなたのアカウントではありません");
    }
});
//ユーザ情報削除
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("ユーザー情報が削除されました。");
        } catch(err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("これはあなたのアカウントではありません");
    }
});
//ユーザ情報取得
// router.get("/:id", async(req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         const { password, updatedAt, ...other} = user._doc;
//         return res.status(200).json(other);
//     } catch(err) {
//         return res.status(500).json(err);
//     }
// });

// クエリでユーザ情報を取得
router.get("/", async(req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId 
            ? await User.findById(userId) 
            : await User.findOne({ username: username});
            console.log(user);
            const { password, updatedAt, ...other} = user._doc;
        
        return res.status(200).json(other);
    } catch(err) {
        return res.status(500).json(err);
    }

});

// ユーザーのフォロー
router.put("/:id/follow", async(req, res) => {
    // フォローできる条件
    // 自分自身でない
    // 
    if(req.body.userId !== req.params.id) {
        try {
            const followUser = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            //フォロワーに自身がいなければフォロー可能
            if(!followUser.followers.includes(req.body.userId)) {
                await followUser.updateOne({ 
                    $push: {
                        followers: req.body.userId,
                    },
                });
                
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォローに成功しました。");
            } else {
                return res.status(403).json("あなたはすでにこのユーザをフォロー済みです。");
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身はフォローできません。");
    }
});

// ユーザーのフォローを外す
router.put("/:id/unfollow", async(req, res) => {
    // フォロー解除できる条件
    // 自分自身でない
    // 
    if(req.body.userId !== req.params.id) {
        try {
            const followUser = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            //フォロワーに存在したらフォロー解除可能
            if(followUser.followers.includes(req.body.userId)) {
                await followUser.updateOne({ 
                    $pull: {
                        followers: req.body.userId,
                    },
                });
                
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォロー解除しました。");
            } else {
                return res.status(403).json("このユーザをフォロー解除できません。");
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身はフォロー解除できません。");
    }
});

// router.get("/", (req, res) => {
//     res.send("user router");
// });

module.exports = router;