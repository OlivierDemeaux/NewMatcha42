const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');

let UserModel = require('../models/user');
let TagModel = require('../models/tag');
let LinkModel = require('../models/link');

router.post('/', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let tags = [];
  let links = await LinkModel.find({user: user._id});
  for (let i = 0; i < links.length; i++) {
    let tag = await TagModel.findOne({_id: links[i].tag});
    if (tag)
      tags.push(tag.tag);
  }
  user.tags = tags;
  return res.status(200).send(user);
}));

module.exports = router;
