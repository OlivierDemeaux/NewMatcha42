const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const ObjectId = require('mongoose').Types.ObjectId;
const sanitizeHtml = require('sanitize-html');

let UserModel = require('../models/user');
let TagModel = require('../models/tag');
let LinkModel = require('../models/link');

router.post('/add', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let tag = req.body.tag;
  if (!tag)
    return res.status(203).send('Error');
  tag = sanitizeHtml(tag.toString());
  let tagExists = await TagModel.findOne({tag: tag});
  if (!tagExists) {
    tagExists = new TagModel();
    tagExists.tag = tag;
    await tagExists.save();
  }
  let linkExists = await LinkModel.findOne({user: userId, tag: tagExists._id});
  if (linkExists)
    return res.status(203).send('Error');
  let link = new LinkModel();
  link.tag = tagExists._id;
  link.user = userId;
  await link.save();
  return res.status(200).send('OK');
}));

router.post('/remove', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let tag = req.body.tag;
  if (!tag)
    return res.status(203).send('Error');
  tag = sanitizeHtml(tag.toString());
  let tagExists = await TagModel.findOne({tag: tag});
  if (!tagExists)
    return res.status(203).send('that tag doesn\'t exists');
  let linkExists = await LinkModel.findOne({user: userId, tag: tagExists._id});
  if (!linkExists)
    return res.status(203).send('the link wasn\'t found');
  await linkExists.remove();
  linkExists = await LinkModel.findOne({tag: tagExists._id});
  if (!linkExists)
    await tagExists.remove();
  return res.status(200).send('Deleted');
}));

module.exports = router;
