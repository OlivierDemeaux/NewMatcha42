const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const ObjectId = require('mongoose').Types.ObjectId;

let UserModel = require('../models/user');
let likeModel = require('../models/likes');
let blockModel = require('../models/block');

router.post('/block', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let receiver = req.body.receiver;
  if (!receiver || !ObjectId.isValid(receiver))
    return res.status(203).send('Error');
  receiver = await UserModel.findOne({_id: receiver});
  if (!receiver)
    return res.status(203).send('User doesn\'t exist');
  let block = await blockModel.find({blocker: userId, blocked: receiver._id});
  if (block)
    await block.remove();
  else {
    await likeModel.deleteOne({liker: userId, liked: receiver._id});
    await likeModel.deleteOne({liked: userId, liker: receiver._id});
    block = new blockModel();
    block.blocker = userId;
    block.blocked = receiver._id;
    await block.save();
  }
  return res.status(200).send('OK');
}));

module.exports = router;
