const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const ObjectId = require('mongoose').Types.ObjectId;

let UserModel = require('../models/user');
let NotificationModel = require('../models/notification');
let BlockModel = require('../models/block');

router.post('/sendNotification', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let receiver = req.body.receiver;
  let text = req.body.text;
  if (!receiver || !ObjectId.isValid(receiver))
    return res.status(203).send('Error');
  receiver = await UserModel.findOne({_id: receiver});
  if (!receiver)
    return res.status(203).send('User doesn\'t exist');
  let block = await BlockModel.findOne({
    $or: [
      {blocker: receiver._id, blocked: userId},
      {blocker: userId, blocked: receiver._id}
    ]
  });
  if (block)
      return res.status(203).send('Error, you were blocked by this person');
  let notification = new NotificationModel();
  notification.notifier = userId;
  notification.notified = receiver._id;
  notification.notification = text;
  notification.seen = false;
  await notification.save();
  return res.status(200).send('true');
}));

router.post('/checkNotifications', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('Error');
  user.last_log = Date.now();
  await user.save();
  let notifications = await NotificationModel.find({notified: userId, seen: false});
  return res.status(200).send(notifications);
}));

router.post('/readNotification', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let notification = req.body.notification;

  let notificationRead = await NotificationModel.findOne({_id: notification})
  notificationRead.seen = true;
  await notificationRead.save();
  return res.status(200).send('read');
}));

module.exports = router;
