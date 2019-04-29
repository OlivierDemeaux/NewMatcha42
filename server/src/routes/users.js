const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const flash = require('connect-flash');
const crypto = require('crypto');
const faker = require('faker');
const checkLog = require('../middlewares/checkLog');
const nodemailer = require('nodemailer');

// Bring in user models
let UserModel = require('../models/user');
let AuthenticationToken = require('../models/AuthenticationToken');


// Delete user
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  UserModel.deleteOne(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

router.post('/login', asyncHandler(async(req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let usernameExists = await UserModel.findOne({username: username});
    if (!usernameExists)
        return res.status(203).send('login fail');
    const isPasswordRight = await bcrypt.compare(password, usernameExists.password);
    if (!isPasswordRight) {
        res.status(203).send('login fail');
        return ;
    }
    else {
      //req.session._id = usernameExists._id;
      let token = new AuthenticationToken();
      token.token = await crypto.randomBytes(32);
      token.userId = usernameExists._id;
      await token.save();
      res.status(200).json({token: token.token, msg:'Login successful, wait for redirection'});
    }

}));

router.post('/resetPassword', asyncHandler(async(req, res) => {
  let emailAddress = req.body.email;
  let username = req.body.username;
  let userToReset = await UserModel.findOne({emailAddress: emailAddress});
  if (!userToReset)
    return res.status(203).send('This user doesn\'t exist, or the email address provided is wrong');
  if (userToReset.username != username)
    return res.status(203).send('This isn\'t the right username');
  if (userToReset.emailAddress != emailAddress)
    return res.status(203).send('This isn\'t the right emailAddress');
  let newPassword = faker.internet.password();
  userToReset.password = bcrypt.hashSync(newPassword, 10);
  await userToReset.save();
  var transporter = nodemailer.createTransport({ service: 'Hotmail', auth: { user: "olivierdem_218@hotmail.com", pass: "Nietzsche1"} });
  var mailOptions = { from: 'olivierdem_218@hotmail.com', to: emailAddress, subject: 'Password Reset', text: 'Hello,\n\n' + 'Please find below your new Password. We advise you to change it as soon as possible\n New password: ' + newPassword };
  transporter.sendMail(mailOptions, function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }
      res.status(200).send('Password resetted.');
    });
}));

router.post('/changePassword', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let newPasswordConfirmation = req.body.newPasswordConfirmation;

  if (!oldPassword || !newPassword || !newPasswordConfirmation)
    res.status(203).send("One of the field is missing");
  if (newPassword !== newPasswordConfirmation)
    return res.status(203).send('New passwords aren\'t identicals')
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let isPasswordRight = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordRight)
    return res.status(203).send('Old Password isn\'t the correct password');
  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();
  return res.status(200).send('Your password was changed');
}));

router.post('/logout', asyncHandler(async(req, res) => {
  if (req.session) {
    req.session = null;
    res.status(200).send('logged out;');
    };
}));

router.post('/changeLastName', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let newLastName = req.body.newLastName;
  if (!newLastName)
    return res.status(203).send("New LastName is empty");
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  user.lastName = newLastName;
  await user.save();
  return res.status(200).send('Your lastName was changed');
}));

router.post('/changeFirstName', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let newFirstName = req.body.newFirstName;
  if (!newFirstName)
    return res.status(203).send("New FirstName is empty");
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  user.firstName = newFirstName;
  await user.save();
  return res.status(200).send('Your FirstName was changed');
}));


router.post('/changeEmail', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let newEmail = req.body.newEmail;
  if (!newEmail)
    return res.status(203).send("New Email is empty");
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  else if (!checkEmailValidity(newEmail))
    res.status(203).send("Email address is invalid")
  user.emailAddress = newEmail;
  await user.save();
  return res.status(200).send('Your Email was changed');
}));


// check email validity throught router.post('/')
function checkEmailValidity(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


module.exports = router;
