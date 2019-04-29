const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const request = require('request');

let UserModel = require('../models/user');

router.post('/setPositionIP', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let ip = req.body.ip;
  if (!ip)
    return res.status(203).send('Error');
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('Error');
  request('https://ipinfo.io/' + ip + '/json', async function (error, response, body) {
    if (error)
      return res.status(203).send('Error');
    let data = JSON.parse(body);
    data = data.loc.split(',');
    user.latitude = data[0];
    user.longitude = data[1];
    await user.save();
    return res.status(200).send('OK');
  });
}));

router.post('/setPosition', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let latitude = parseFloat(req.body.latitude);
  let longitude = parseFloat(req.body.longitude);
  if (!latitude || !longitude || isNaN(longitude) || isNaN(latitude))
    return res.status(203).send('Error');
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('Error');
  user.latitude = latitude;
  user.longitude = longitude;
  await user.save();
  return res.status(200).send('OK');
}));

module.exports = router;
