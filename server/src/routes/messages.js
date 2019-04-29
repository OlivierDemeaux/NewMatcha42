const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const ObjectId = require('mongoose').Types.ObjectId;
const sanitizeHtml = require('sanitize-html');

let UserModel = require('../models/user');
let messageModel = require('../models/messages');
let likeModel = require('../models/likes');
let blockModel = require('../models/block');

router.post('/getMessages', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let receiver = req.body.receiver;
  if (!receiver || !ObjectId.isValid(receiver))
    return res.status(203).send('Error');
  receiver = await UserModel.findOne({_id: receiver});
  if (!receiver)
    return res.status(203).send('User doesn\'t exist');
  let messages = await messageModel.find({
    $or: [
      {receiver: receiver._id, sender: userId},
      {receiver: userId, sender: receiver._id}
    ]
  }).sort({sentTime: 1});
  return res.status(200).send(messages);
}));

router.post('/sendMessage', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let unsanitizedText = req.body.text;
  if (!unsanitizedText)
    return res.status(203).send('Your message is empty');
  let text = sanitizeHtml(unsanitizedText);
  let receiver = req.body.receiver;
  if (!text || !receiver || !ObjectId.isValid(receiver))
    return res.status(203).send('Error');
  receiver = await UserModel.findOne({_id: receiver});
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user || !receiver)
    return res.status(203).send('User doesn\'t exist');
  const a = await likeModel.findOne({liker: receiver._id, liked: user._id});
  const b = await likeModel.findOne({liked: receiver._id, liker: user._id});
  if (!a || !b)
    return res.status(203).send('Error');
  const blockA = await blockModel.findOne({blocker: user._id, blocked: receiver._id});
  const blockB = await blockModel.findOne({blocker: receiver._id, blocked: user._id});
  if (blockA || blockB)
    return res.status(203).send('You or the user are blocked, you can\'t send a message');
  let message = new messageModel();
  message.sender = user;
  message.receiver = receiver;
  message.text = sanitizeHtml(text);
  await message.save();
  return res.status(200).send('message sent');
}));

module.exports = router;
