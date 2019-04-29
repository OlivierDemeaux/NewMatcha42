const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const fs = require('fs');
const randomID = require('random-id');
const path = require('path');

// Bring in user models
let User = require('../models/user');
let Token = require('../models/registrationToken');

// Update Submit Form
router.post('/', asyncHandler(async(req, res) => {

  let userId = req.body.userId;
  let password = req.body.password;
  let userExists = await User.findOne({_id: userId});
  if(userExists)
    {
      if (bcrypt.compareSync(password, userExists.password))
      {
        let user = {};
        user.username = req.body.username;
        user.emailAddress = req.body.emailAddress;
        let query = {_id:userId};
        User.updateOne(query, user, function(err){
          if(err){
            return;
          } else {
            req.flash('success', 'User Updated');
          }
        });
      } else {
        res.status(203).send("Password is incorrect");
      }
    } else {
      res.status(203).send("This user doesn't exist");
    };
}));


router.post('/registerInformations', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let gender = req.body.gender;
  let age = req.body.age;
  let interestedIn = req.body.interestedIn;
  let user = await User.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  else {
    user.gender = gender;
    user.age = age;
    user.interestedIn = interestedIn;
    await user.save();
    return res.status(200).send('Your informations were saved');
  }
}));

router.post('/resetInformation', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let gender = null;
  let age = null;
  let interestedIn = null;
  let lookingFor = null;
  let user = await User.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  else {
    user.gender = gender;
    user.age = age;
    user.interestedIn = interestedIn;
    user.lookingFor = lookingFor;
    await user.save();
    return res.status(200).send('Your informations were resetted');
  }
}));

router.post('/uploadPicture', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let image = undefined;
  let number = parseInt(req.body.number);
  if (req.files)
    image = req.files.myFile;
  if (!image || isNaN(number) || number < 0 || number > 5)
    return res.status(203).send('No image was found');
  let user = await User.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let images = [
    user.picture1,
    user.picture2,
    user.picture3,
    user.picture4,
    user.picture5
  ];
  let name = 'uploads/' + randomID() + Date.now() + path.extname(image.name);
  if (fs.existsSync("public/" + images[number]) && images[number] !== "images/default.jpg")
    fs.unlinkSync("public/" + images[number]);
  images[number] = name;
  user.picture1 = images[0];
  user.picture2 = images[1];
  user.picture3 = images[2];
  user.picture4 = images[3];
  user.picture5 = images[4];
  await user.save();
  image.mv('public/' + name, async function(err) {
    if(err) {
      return res.status(500).send('the upload failed');
    } else {
      return res.status(200).send('It worked');
    }
  });

}));

router.post('/deletePicture', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let number = parseInt(req.body.number);
  if (isNaN(number) || number < 0 || number > 5)
    return res.status(203).send('MESSAGE');
  let user = await User.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let images = [
    user.picture1,
    user.picture2,
    user.picture3,
    user.picture4,
    user.picture5
  ];
  if (images[number] === "images/default.jpg")
    return res.status(203).send('MESSAGE');
  else if (fs.existsSync("public/" + images[number]))
    fs.unlinkSync("public/" + images[number]);
  images[number] = "images/default.jpg";
  user.picture1 = images[0];
  user.picture2 = images[1];
  user.picture3 = images[2];
  user.picture4 = images[3];
  user.picture5 = images[4];
  await user.save();
  return res.status(200).send('It worked');
}));

module.exports = router;
