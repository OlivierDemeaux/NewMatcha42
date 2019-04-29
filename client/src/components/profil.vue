<template>
  <div class="profil-page" v-if="user">

  		<div class="profil-picture-container">
  			<div class="profilPicture">
  				<h3>Profil Picture</h3>
  				<div class="profil-picture-main">
            <div :class="{ 'selectedImage' : modifyImage === 0}" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture1 + ')' }" @click="changeModifyImage(0)" style="height: 220px; width: 260px; position:relative; right: 15px"></div>
  				</div>
        </br>
        <div class="profil-images">
          <div :class="{ 'selectedImage' : modifyImage === 1}" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture2 + ')' }" @click="changeModifyImage(1)" style="height: 60px; width: 60px; position:relative;"></div>
          <div :class="{ 'selectedImage' : modifyImage === 2}" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture3 + ')' }" @click="changeModifyImage(2)" style="height: 60px; width: 60px; position:relative;"></div>
          <div :class="{ 'selectedImage' : modifyImage === 3}" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture4 + ')' }" @click="changeModifyImage(3)" style="height: 60px; width: 60px; position:relative;"></div>
          <div :class="{ 'selectedImage' : modifyImage === 4}" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture5 + ')' }" @click="changeModifyImage(4)" style="height: 60px; width: 60px; position:relative;"></div>
        </div>
        <input v-if="modifyImage >= 0 && modifyImage <= 4" type="file" @change="onFileSelected">
        <button class="delete-button" v-if="this.selectedFile !== null" @click="onUpload">Upload</button>
        <button class="delete-button" v-if="modifyImage >= 0 && modifyImage <= 4" style="border: 1px solid black;" @click="deleteImage()">Delete Image</button>
  			</div>
  		</div>

      <div class="profil-big-container">

        <div class="welcome-user">
          <h1 v-if='user'>  Welcome {{user.firstName}} {{user.lastName}}</h1>
        </div>

        <div v-if="this.showError == true">
          {{this.error}}
        </div>

        <div class="profil-description">
            <v-layout align-center justify-center row fill-height>
              <v-flex align-self-center xs10>
                <div class="white elevation-2">
                  <v-toolbar flat dense class="cyan" dark>
                    <v-toolbar-title>My description</v-toolbar-title>
                  </v-toolbar>
                  <v-text-field v-if="user.description === null" type="text" v-model="descriptionToBeAdded" name="descriptionToBeAdded" placeholder="Describe yourself here (what you do, what you enjoy in life, ..." /></v-text-field>
                  <v-text-field v-if="changeDescription" type="text" v-model="descriptionToBeAdded" name="descriptionToBeAdded" placeholder="Describe yourself here (what you do, what you enjoy in life, ..." /></v-text-field>
                  <v-btn v-if="user.description === null" dark class="cyan" @click="addDescription()">Add a description</v-btn>
                  <v-btn v-if="changeDescription" dark class="cyan" @click="addDescription()">Add a description</v-btn>
                  <h3 v-if="!changeDescription" type="text" name="description" > {{user.description}}</h3>
                  <div v-if="user.description !== null"> <v-btn v-if="!changeDescription" dark class="cyan" @click="changeDescrip()">Modify my description</v-btn></div>
                </v-toolbar>
                </div>
            </v-flex>
          </v-layout>
        </div>

        <div class="profil-informations">
          <div class="unfiled-informations" v-if="user.gender === null">
            <v-layout align-center justify-center row fill-height>
              <v-flex align-self-center xs10>
                <div class="white elevation-2">
                  <v-toolbar flat dense class="cyan" dark>
                    <v-toolbar-title>Add informations</v-toolbar-title>
                  </v-toolbar>
                  <div class="pl-4 pr-4 pt-2 pb-2">
                    <div class="container-gender">
                      <input type="radio" id="male" value="Male" v-model="gender">
                      <label for="male">Male</label>
                      <input type="radio" id="female" value="Female" v-model="gender">
                      <label for="female">Female</label><br>
                    </div>
                    <div class="age">
                      How old are you?
                      <input type="age" id="age" name="age" v-model="age">
                    </div>
                    <div class="container-gender">
                      I'm interested in:
                      <input type="radio" id="male" value="Male" v-model="interestedIn">
                      <label for="male">Male</label>
                      <input type="radio" id="female" value="Female" v-model="interestedIn">
                      <label for="female">Female</label>
                      <input type="radio" id="both" value="Both" v-model="interestedIn">
                      <label for="both">Both</label><br>
                    </div>
                  </div>
                  <v-btn dark class="cyan" @click="registerInformations()">Save Informations</v-btn>
                  </div>
              </v-flex>
            </v-layout>
          </div>

          <div class="unfiled-informations" v-if="user.gender !== null">
            <v-layout align-center justify-center row fill-height>
              <v-flex align-self-center xs10>
                <div class="white elevation-2">
                  <v-toolbar flat dense class="cyan" dark>
                    <v-toolbar-title>My Informations</v-toolbar-title>
                  </v-toolbar>
                  <h3 type="text"> I'm a {{user.age}} years old {{user.gender}} that is looking for a relationship with {{user.interestedIn}}</h3>
                  <v-btn dark class="cyan" @click="resetInformation(user)">Reset my informations</v-btn>
                  </div>
              </v-flex>
            </v-layout>
          </div>
          <br>
          <div class="profil-informations">
            <div class="unfiled-informations">
              <v-layout align-center justify-center row fill-height>
                <v-flex align-self-center xs10>
                  <div class="white elevation-2">
                    <v-toolbar flat dense class="cyan" dark>
                      <v-toolbar-title>Change User Informations</v-toolbar-title>
                    </v-toolbar>
                    <v-btn dark class="cyan" @click="navigateTo({name: 'changePassword'})">Reset my Password</v-btn>
                      <v-btn dark class="cyan" @click="navigateTo({name: 'changeUserInfos'})">Modify User Infos</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </div>

          <br/>
          <v-layout align-center justify-center row fill-height>
            <v-flex class="test-modif" align-self-center xs10>
              <div class="white elevation-2">
                <v-toolbar flat dense class="cyan" dark>
                  <v-toolbar-title>My Tags</v-toolbar-title>
                </v-toolbar>
                </br>
                <p v-for="(item, name) in user.tags" v-bind:key="name" @click="removeTag(item)">{{item}}</p>
                <div v-if="user.tags.length != 3">
                <input type="text" v-model="tag" placeholder="ex: #Matcha" style="border: 1px solid black;">
                <span @click="addTag()">Add Tag</span>
              </div>
              </v-toolbar>
              </div>
          </v-flex>
        </v-layout>
        <br>

        <v-layout class="test-modif-2" align-center justify-center row fill-height >
          <v-flex align-self-center xs10>
            <div class="white elevation-2">
              <v-toolbar flat dense class="cyan" dark>
                <v-toolbar-title>My location</v-toolbar-title>
              </v-toolbar><br>
              <div class="map_profile" id='map'></div>
              <span style="border: 1px solid black;" @click="getIP();">auto set position</span> <br> <br>
            </v-toolbar>
            </div>
        </v-flex>
      </v-layout>

          </div>
        </div>
      </div>
</template>

<script>

import mapboxgl from 'mapbox-gl';

export default {
  data () {
    return {
      token: this.checkToken(),
      user: false,
      descriptionToBeAdded: null,
      gender: null,
      age: null,
      interestedIn: null,
      selectedFile: null,
      apiURL: this.$http.options.root,
      modifyImage: -1,
      tag: '',
      map: null,
      layer: -1,
      changeDescription: false,
      changeInformations: false,
      error: null,
      showError: false
    }
  },
  mounted () {
  this.getUser();
},
methods: {
  getUser() {
    this.$http.post('getUser', {
      token: this.token
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      } else {
        this.user = res.body;
        if (this.user.latitude && this.user.longitude && this.map === null)
          setTimeout(function(){ this.setMap() }.bind(this), 1000);
        else if (this.user.latitude && this.user.longitude)
          this.setPosition();
        else
          this.getIP();
      }
    }, (err) => {
      this.error = err
      this.showError = true
    })
  },
  getIP() {
    this.$http.get('http://ipinfo.io').then((res) => {
      this.$http.post('position/setPositionIP', {
        token: this.token,
        ip: res.body.ip
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.showError = true
        } else {
          this.getUser();
        }
      }, (err) => {
        this.error = err
        this.showError = true
      })
    });
  },
  checkToken () {
    let token = this.$localStorage.get('token')
    if (token) {
      this.$store.commit('SET_TOKEN', token)
      return(token)
      //this.$router.push('profil')
    }
    else {
      this.$store.commit('SET_TOKEN', null)
      this.$router.push('login')
    }
  },
  changeDescrip() {
    this.changeDescription = true;
  },
  resetInformation(user) {
    this.$http.post('updateUser/resetInformation', {
      token: this.token
    }, {emulateJSON: true}).then((res) => {
      this.getUser();
    }, (err) => {
      this.error = err
      this.showError = true
    })
  },
  addDescription() {
    this.$http.post('addDescription', {
      descriptionToBeAdded : this.descriptionToBeAdded,
      token: this.token
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      }
      else {
      this.getUser();
      this.changeDescription = false;
    }
    }, (err) => {
      this.error = err
      this.showError = true
    })
  },
  registerInformations() {
    this.$http.post('updateUser/registerInformations', {
    gender: this.gender,
    age: this.age,
    interestedIn: this.interestedIn,
    token: this.token
  },  {emulateJSON: true}).then((res) => {
    if (res.status == 203) {
      this.error = res.body
      this.showError = true
    } else {
      this.getUser();
    }
  }, (err) => {
    this.error = err
    this.showError = true
  })
},
  onFileSelected(event) {
    this.selectedFile = event.target.files[0]
  },
  onUpload() {
    let formData = new FormData()
    formData.append('myFile', this.selectedFile)
    formData.append('token', this.token)
    formData.append('number', this.modifyImage)
    this.$http.post('updateUser/uploadPicture', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      } else {
        this.getUser()
        }
      }, (err) => {
        this.error = err
        this.showError = true
      }
    )
  },
  changeModifyImage(imageIdNumber) {
    if (this.modifyImage === imageIdNumber)
      this.modifyImage = -1;
    else
      this.modifyImage = imageIdNumber;
  },
  deleteImage() {
    this.$http.post('updateUser/deletePicture', {
      token: this.token,
      number: this.modifyImage,
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      } else {
        this.getUser();
      }
    }, (err) => {
      this.error = err.body;
    })
  },
  navigateTo (route) {
    this.$router.push(route)
  },
  addTag() {
    this.$http.post('tag/add', {
      token: this.token,
      tag: this.tag,
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      } else {
        this.getUser()
      }
    }, (err) => {
      this.error = err.body;
    })
  },
  removeTag(tag) {
    this.$http.post('tag/remove', {
      token: this.token,
      tag: tag,
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      } else {
        this.getUser()
      }
    }, (err) => {
      this.error = err.body;
    })
  },
  setMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmJydWNrZXIiLCJhIjoiY2pkZGYwYW0zMDBxazJxbXNncHR6c2JuOSJ9.gCzIaNJ4TKf6ofuQp2sRcQ';
	this.map = new mapboxgl.Map(
	{
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v10',
		center: [this.user.longitude, this.user.latitude],
		zoom: 13
	});
	this.map.on('load', function ()
	{
    this.setPosition();
    this.map.on('click', function (e)
		{
			this.user.latitude = e.lngLat.lat;
			this.user.longitude = e.lngLat.lng;
      this.setPosition();
		}.bind(this));
	}.bind(this));
  },
  setPosition() {
    let latitude = this.user.latitude;
    let longitude = this.user.longitude;
    if (this.layer !== -1)
      this.map.removeLayer('symbols_' +  + this.layer.toString());
    this.layer++;
    this.map.addLayer(
    {
      "id": "symbols_" +  + this.layer.toString(),
      "type": "symbol",
      "source":
      {
        "type": "geojson",
        "data":
        {
          "type": "FeatureCollection",
          "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry":
            {
              "type": "Point",
              "coordinates": [longitude, latitude]
            }
          }]
        }
      },
      "layout":
      {
        "icon-image": "triangle-stroked-15",
        "icon-size": 2
      }
    });
    this.$http.post('position/setPosition', {
      token: this.token,
      latitude: this.user.latitude,
      longitude: this.user.longitude
    }, {emulateJSON: true}).then((res) => {
    }, (err) => {
      this.error = err.body;
    })
  }
  }
}
</script>

<style lang="css">
.selectedImage {
  border: 1px solid red;
}
.map_profile {
  margin: 0 auto;
	height: 298px;
	width: 298px;
	text-align: initial;
	border: 1px solid black;
}
</style>
