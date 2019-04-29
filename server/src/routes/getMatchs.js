const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const dateFormat = require('dateformat');

let UserModel = require('../models/user');
let LikesModel = require('../models/likes');
let LinkModel = require('../models/link');

router.post('/', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user)
    return res.status(203).send('User doesn\'t exist');

  let likes = await LikesModel.find({liker: user._id});
  let matchs = [];
  let profilUserMatched = [];
  for (let n = 0; n < likes.length; n++) {
    let liked = likes[n].liked;
    let matched = await LikesModel.findOne({liker: liked, liked: user._id});
    if (matched) {
      profilUserMatched = await UserModel.findOne({_id: matched.liker});
      if(profilUserMatched)
        matchs.push(profilUserMatched);
    }
  }

  return res.status(200).send(matchs);
}));

router.post('/checkIfMatch', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let receiver = req.body.receiver;
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let liked = await LikesModel.findOne({liker: receiver, liked: userId});
  if (liked) {
    let like = await LikesModel.findOne({liker: userId, liked: receiver});
    if (like) {
      return res.status(200).send('match');
    } else {
      return res.status(200).send('notMatch');
    }
  }
  else {
    return res.status(200).send('notMatch');
  }
}));

module.exports = router;
