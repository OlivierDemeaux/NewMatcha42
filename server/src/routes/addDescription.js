const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const sanitizeHtml = require('sanitize-html');

let UserModel = require('../models/user');

router.post('/', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let description = req.body.descriptionToBeAdded;
  let user = await UserModel.findOne({_id: userId});
  if (!user || !description)
    return res.status(203).send('User doesn\'t exist');
  else {
    user.description = sanitizeHtml(description);
    await user.save();
    return res.status(200).send('Your description was saved');
  }
}));

module.exports = router;
