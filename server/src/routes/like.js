const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const ObjectId = require('mongoose').Types.ObjectId;

let UserModel = require('../models/user');
let likeModel = require('../models/likes');
let blockModel = require('../models/block');

router.post('/like', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let receiver = req.body.receiver;
  if (!receiver || !ObjectId.isValid(receiver))
    return res.status(203).send('Error');
  receiver = await UserModel.findOne({_id: receiver});
  if (!receiver)
    return res.status(203).send('User doesn\'t exist');
  let like = await likeModel.findOne({liker: userId, liked: receiver._id});
  if (like) {
    await likeModel.deleteOne({liker: userId, liked: receiver._id});
    let userLiked = await UserModel.findOne({_id: receiver});
    userLiked.popularity -= 1;
    await userLiked.save();
    return res.status(200).send('false');
  }
  else {
    let block = await blockModel.findOne({
      $or: [
        {blocker: receiver._id, blocked: userId},
        {blocker: userId, blocked: receiver._id}
      ]
    });
    if (block)
        return res.status(203).send('Error, you were blocked by this person');
    like = new likeModel();
    like.liker = userId;
    like.liked = receiver._id;
    await like.save();
    let userLiked = await UserModel.findOne({_id: receiver});
    userLiked.popularity += 1;
    await userLiked.save();
  }
  return res.status(200).send('true');
}));

router.post('/checkLike', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let receiver = req.body.receiver;
  if (!receiver || !ObjectId.isValid(receiver))
    return res.status(203).send('Error');
  receiver = await UserModel.findOne({_id: receiver});
  if (!receiver)
    return res.status(203).send('User doesn\'t exist');
  let like = await likeModel.findOne({liker: userId, liked: receiver._id});
  if (!like)
    return res.status(200).send('false');
  else
    return res.status(200).send('true');
}));

router.post('/blockUser', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let userToBlock = req.body.userToBlock;

  if (!userToBlock || !ObjectId.isValid(userToBlock))
    return res.status(203).send('Error');
  userToBlock = await UserModel.findOne({_id: userToBlock});
  if (!userToBlock)
    return res.status(203).send('User to block wasn\' found');
  let block = await blockModel.findOne({blocker: userId, blocked: userToBlock._id});
  if (block) {
    await blockModel.deleteOne({blocker: userId, blocked: userToBlock._id});
    return res.status(200).send('notBlocked');
  }
  else {
    block = new blockModel();
    block.blocker = userId;
    block.blocked = userToBlock._id;
    await block.save();
  }
  return res.status(200).send('blocked');
}));

router.post('/checkIfBlocked', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let userBlocked = req.body.userBlocked;
  if (!userBlocked || !ObjectId.isValid(userBlocked))
    return res.status(203).send('Error');
  userBlocked = await UserModel.findOne({_id: userBlocked});
  if (!userBlocked)
    return res.status(203).send('User doesn\'t exist');
  let blocked = await blockModel.findOne({blocker: userId, blocked: userBlocked._id});
  let blocked2 = await blockModel.findOne({blocker: userBlocked._id, blocked: userId});
  if (!blocked && !blocked2)
    return res.status(200).send('notBlocked');
  else
    return res.status(200).send('blocked');
}));

module.exports = router;
