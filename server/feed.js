const faker = require('faker');
const bcrypt = require('bcrypt');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require('./src/routes/config/database');

let UserModel = require('./src/models/user');
let TagModel = require('./src/models/tag');
let LinkModel = require('./src/models/link');

const men = fs.readdirSync('public/images/fake_men');
const women = fs.readdirSync('public/images/fake_women');

const Gtags = ['#42', '#travel', '#cooking', '#shopping', '#family', '#work', '#sport', '#share', '#tech', '#children', '#food', '#museum'];

main();

async function main() {
  let client = await mongoose.connect(config.database, {useNewUrlParser: true});

  for (let i = 0; i < Gtags.length; i++) {
    let tag = await TagModel.findOne({tag: Gtags[i]});
    if (!tag) {
      tag = new TagModel();
      tag.tag = Gtags[i];
      await tag.save();
    }
  }

  for (let i = 0; i < 500; i++) {
    let user = new UserModel();

    user.password = bcrypt.hashSync(faker.internet.password(), 10);
    user.gender = randomIntFromInterval(1, 2) === 1 ? "Male" : "Female";
    user.emailAddress = faker.internet.email();
    user.username = faker.internet.userName();
    user.lastName = faker.name.lastName();
    user.firstName = faker.name.firstName();
    let rand = randomIntFromInterval(1, 3);
    if (rand === 1)
      user.interestedIn = "Male";
    else if (rand === 2)
      user.interestedIn = "Female";
    else
      user.interestedIn = "Both";
    user.description = faker.lorem.text(999);
    user.popularity = randomIntFromInterval(0, 99);
    user.age = randomIntFromInterval(18, 40);
    user.picture1 = get_fake_image(user.gender, men, women);
    user.isVerified = true;
    user.latitude = randomIntFromInterval(41 * Math.pow(10, 6), 51 * Math.pow(10, 6)) / Math.pow(10, 6);
    user.longitude = randomIntFromInterval(0 * Math.pow(10, 6), 7.5 * Math.pow(10, 6)) / Math.pow(10, 6);
    user.realLocalisation = true;

    let tags = [];
    let x = randomIntFromInterval(1, 3);
    for (let j = 0; j < x; j++) {
      let tag = get_fake_tags(tags);
      tags.push(tag);
      tag = await TagModel.findOne({tag: tag});
      let link = new LinkModel();
      link.tag = tag._id;
      link.user = user._id;
      await link.save();
    }

    await user.save();
  }
  mongoose.connection.close()
}

function get_fake_tags(used) {
  let tag = Gtags[randomIntFromInterval(0, Gtags.length - 1)];
  while (used.indexOf(tag) > -1)
    tag = Gtags[randomIntFromInterval(0, Gtags.length - 1)];
  return tag;
}

function get_fake_image(gender, men, women) {
  let x = 0;
  let file = '';
  if (gender === "Male") {
    x = randomIntFromInterval(0, men.length - 1);
    file = 'fake_men/' + men[x];
  }
  else if (gender === "Female") {
    x = randomIntFromInterval(0, women.length - 1);
    file = 'fake_women/' + women[x];
  }
  return ('images/' + file);
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
