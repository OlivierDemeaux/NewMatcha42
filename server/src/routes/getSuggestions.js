const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');

let UserModel = require('../models/user');
let TagModel = require('../models/tag');
let LinkModel = require('../models/link');

function deg2rad(x)
{
  return (x * (Math.PI / 180));
}

function rad2deg(x)
{
  return (x * 180 / Math.PI);
}

function getDistance(lat1, lon1, lat2, lon2)
{
  let theta = lon1 - lon2;
  let dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  let miles = dist * 60 * 1.1515;
  let km = miles * 1.609344;
  return (km);
}

router.post('/', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let max_dist = req.body.max_dist;
  let max_age = user.age + 5;
  let min_age = user.age - 5;
  let max_fame = user.popularity + 25;
  let min_fame = user.popularity - 25;
  let popularity = user.popularity;

  let userTagsModel = await LinkModel.find({user: userId});

  let userTags = '';
  let userTagsName = [];
  for (let m = 0; m < userTagsModel.length; m++) {
    userTags = await TagModel.findOne({_id: userTagsModel[m].tag})
    userTagsName[m] = userTags._id;
  }

  let suggestionsUsers;
  if (user.interestedIn == 'Both')
    suggestionsUsers = await UserModel.find({interestedIn: gender}).lean();
  else
    suggestionsUsers = await UserModel.find({ $and: [{interestedIn: user.gender}, {gender: user.interestedIn}] }).lean();

  for (let n = 0; n < suggestionsUsers.length; n++) {
    let tags = [];
    let links = await LinkModel.find({user: suggestionsUsers[n]._id});
    for (let i = 0; i < links.length; i++) {
      let tag = await TagModel.findOne({_id: links[i].tag});
      if (tag)
        tags.push(tag.tag);
    }
    suggestionsUsers[n].tags = tags;
  }

  let valid = [];
  for (let x = 0; x < suggestionsUsers.length; x++)
  {
    if (suggestionsUsers[x].age > max_age || suggestionsUsers[x].age < min_age)
      continue;
    if (suggestionsUsers[x].popularity > max_fame || suggestionsUsers[x].popularity < min_fame)
      continue;
    let distance = getDistance(user.latitude, user.longitude, suggestionsUsers[x].latitude, suggestionsUsers[x].longitude)
    if (distance > max_dist)
      continue;
    else {
      suggestionsUsers[x].distance = Math.trunc(distance);
    }

    valid.push(suggestionsUsers[x]);
  }

  return res.status(200).send(valid);
}));

router.post('/advancedSearch', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let max_dist = req.body.max_dist;
  let max_age = req.body.max_age;
  if (max_age == '')
    max_age = user.age + 5;
  let min_age = req.body.min_age;
  if (min_age == '')
    min_age = user.age - 5;
  let max_fame = req.body.max_fame;
  if (max_fame == '')
    max_fame = user.popularity + 25;
  let min_fame = req.body.min_fame;
  if (min_fame == '')
    min_fame = user.popularity - 25;
  let interestedIn = '';
  if (user.interestedIn === 'Female')
    interestedIn = 'Female';
  else
    interestedIn = 'Male';
  let gender = '';
  if (user.gender === 'Male')
    gender = 'Male';
  else
    gender = 'Female';
  let popularity = user.popularity;
  let tags = [];
  let tag1;
  let tag2;
  let tag3;
  if (req.body.tag1 !== '' && req.body.tag1 !== 'false') {
    tag1 = req.body.tag1;
    tags.push(tag1);
  }
  if (req.body.tag2 !== '' && req.body.tag2 !== 'false') {
    tag2 = req.body.tag2;
    tags.push(tag2);
  }
  if (req.body.tag3 !== '' && req.body.tag3 !== 'false') {
    tag3 = req.body.tag3;
    tags.push(tag3);
  }

  let userTagsModel = await LinkModel.find({user: userId});

  let userTags = '';
  let userTagsName = [];
  for (let m = 0; m < userTagsModel.length; m++) {
    userTags = await TagModel.findOne({_id: userTagsModel[m].tag})
    userTagsName[m] = userTags._id;
  }

  let suggestionsUsers;
  if (user.interestedIn == 'both sexes')
    suggestionsUsers = await UserModel.find({interestedIn: gender}).lean();
  else
    suggestionsUsers = await UserModel.find({ $and: [{interestedIn: gender}, {gender: interestedIn}] }).lean();

  for (let n = 0; n < suggestionsUsers.length; n++) {
    let tags = [];
    let links = await LinkModel.find({user: suggestionsUsers[n]._id});
    for (let i = 0; i < links.length; i++) {
      let tag = await TagModel.findOne({_id: links[i].tag});
      if (tag)
        tags.push(tag.tag);
    }
    suggestionsUsers[n].tags = tags;
  }

  let valid = [];
  for (let x = 0; x < suggestionsUsers.length; x++)
  {
    if (suggestionsUsers[x].age > max_age || suggestionsUsers[x].age < min_age)
      continue;
    if (suggestionsUsers[x].popularity > max_fame || suggestionsUsers[x].popularity < min_fame)
      continue;
    let distance = getDistance(user.latitude, user.longitude, suggestionsUsers[x].latitude, suggestionsUsers[x].longitude)
    if (distance > max_dist)
      continue;
    else {
      suggestionsUsers[x].distance = Math.trunc(distance);
    }
    if (tags.length !== 0) {
      var result = tags.filter( function(n) { return this.has(n) }, new Set(suggestionsUsers[x].tags));
      if (result.length < 1)
        continue;
      }

    valid.push(suggestionsUsers[x]);
  }

  return res.status(200).send(valid);
}));

module.exports = router;
