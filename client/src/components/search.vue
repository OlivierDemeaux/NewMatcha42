<template lang="html">
<div>
  <div class="message-search-page">
    Start Something Real -- Here are the profils that match yours
  </div>

  <div class="filters">
    <div class="filters-ages">
      <div>
          Min.Age: <input class="filters-ages-input" type="text" v-model="min_age" placeholder="18">
      </div>
      <div>
          Max.Age: <input class="filters-ages-input" type="text" v-model="max_age" placeholder="99">
      </div>
    </div>
    <div class="filters-fame">
      <div>
          Min.Fame: <input class="filters-ages-input" type="text" v-model="min_fame" placeholder="1">
      </div>
      <div>
          Max.Fame: <input class="filters-ages-input" type="text" v-model="max_fame" placeholder="100">
      </div>
    </div>
    <div class="filters-distance">
      Max.Distance(km): <input class="filters-ages-input" type="text" v-model="max_dist" placeholder="40">
    </div>
    <div v-if="user">
      <div v-if="user.tags[0]" class="filters-tags">
        <input type="checkbox" v-model="tag1"> {{user.tags[0]}}
      </div>
      <div v-if="user.tags[1]" class="filters-tags">
        <input type="checkbox" v-model="tag2"> {{user.tags[1]}}
      </div>
      <div v-if="user.tags[2]" class="filters-tags">
        <input type="checkbox" v-model="tag3"> {{user.tags[2]}}
      </div>
    </div>
    <div class="sort_by_age">
      <button class="button-search-age" type="button" @click="sortByAge()">Sort By Age</button>
      <button class="button-search-location" type="button" @click="sortByLocation()">Sort By Location</button>
      <button class="button-search-fame" type="button" @click="sortByFame()">Sort By Fame</button>
    </div>
    <div class="advance-search-button">
        <v-btn dark class="cyan" @click="setTags(); getAdvancedSuggestions()">Advanced Seach</v-btn>
    </div>
  </div>

  <br>

  <div class="suggestions-big-box" v-if="user && (user.picture1 !== 'images/default.jpg' || user.picture2 !== 'images/default.jpg' || user.picture3 !== 'images/default.jpg' || user.picture4 !== 'images/default.jpg' || user.picture5 !== 'images/default.jpg')">
        <div v-if="suggestions">
          <div v-if="suggestions.length === 0">
            No user match your Advanced Search ! Sorry !
          </div>
        </div>
        <div v-for="user in suggestions" class="suggestions-profil">
          <div class="suggestions-profil-picture" @click="showUser(user); checkIfBlocked();" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture1 + ')' }">
          </div>
          <h3>{{user.firstName}} {{user.lastName}}, {{user.age}}</h3>
        </div>
  </div>
  <div class="suggestions-big-box" v-if="user && (user.picture1 == 'images/default.jpg' && user.picture2 == 'images/default.jpg' && user.picture3 == 'images/default.jpg' && user.picture4 == 'images/default.jpg' && user.picture5 == 'images/default.jpg')">
        You must add at least one picture of you to access to the profils you may like
  </div>

  <div class="error" v-html="error" v-if="this.showError == true">
    {{this.error}}
  </div>


  <div class="show-user-details" v-if="popup">
    <div class="show-user-details-profil">
      <img class="show-user-close-button" @click="closeProfil()" src="../assets/cancel.svg">
      <div class="show-user-global">
      <div class="show-user-picture" v-bind:style="{ backgroundImage: 'url(' + apiURL + this.userToShow.picture1 + ')' }"></div>
      <div class="show-user-infos">
        <div class="show-user-infos-names">
          {{this.userToShow.firstName}}  {{this.userToShow.lastName}}
        </div>
        {{this.userToShow.age}} years old {{this.userToShow.gender}} <br/>
        {{this.userToShow.firstName}} has a fame rating of {{this.userToShow.popularity}}
        <div class="show-user-infos-description">
          Description: {{this.userToShow.description}} <br/>
        </div>
        <div v-if="userToShow">
          <div class="show-user-infos-tags" v-if="userToShow.tags.length > 0">
            tags: {{this.userToShow.tags}}
          </div>
        </div>
        <div v-if="userToShow">
          <div class="show-user-infos-tags" v-if="userToShow.tags.length == 0">
            {{this.userToShow.firstName}} has no tag yet
          </div>
        </div>
        <div class="show-user-infos-distance">
          {{this.userToShow.firstName}} is {{this.userToShow.distance}} km away.
        </div>
      </div>
    </div>
      <div class="show-user-liked show-user-like" v-if="this.liked == 'false'" @click="likeUser()">
          Click here to like {{this.userToShow.firstName}}
      </div>
      <div class="show-user-unliked show-user-like" v-if="this.liked == 'true'" @click="likeUser()">
          Click here to unlike {{this.userToShow.firstName}}
      </div>
      <div class="show-user-liked show-user-block" v-if="this.blocked == 'blocked'" @click="blockUser()">
          Click here to unblock {{this.userToShow.firstName}}
      </div>
      <div class="show-user-unliked show-user-block" v-if="this.blocked == 'notBlocked'" @click="blockUser()">
          Click here to block {{this.userToShow.firstName}}
      </div>
    </div>
  </div>

  <div class="show-user-details" v-if="itsAMatch">
    <div class="show-user-details-profil">
      <img class="show-user-close-button" @click="closeMatch()" src="../assets/cancel.svg">
      <img class="show-itsAMatch" @click="closeMatch()" :src="apiURL + 'images/itsAMatch.png'">
      <div class="show-user-global">
          <v-btn dark class="cyan" @click="navigateTo({name: 'messages'})" style="left: 60px;">Don't be shy, send a message</v-btn>
      </div>
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
      user: null,
      suggestions: null,
      apiURL: this.$http.options.root,
      popup: false,
      userToShow : [],
      liked: false,
      itsAMatch: false,
      blocked: false,
      notification: null,
      min_age: null,
      max_age: null,
      min_fame: null,
      max_fame: null,
      max_dist: 400,
      numberTags: null,
      tag1: null,
      tag2: null,
      tag3: null,
      error: null,
      showError: false
    }
  },
  mounted () {
  this.getUser();
  this.getSuggestions();
  },
  methods: {
    getUser() {
      this.$http.post('getUser', {
        token: this.token
      }, {emulateJSON: true}).then((res) => {
        this.user = res.body
        this.numberTags = this.user.tags.length
      }, (err) => {
        this.error = err
        this.showError = true
      })
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
    getSuggestions() {
      this.$http.post('getSuggestions', {
        token: this.token
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.showError = true
        } else {
          this.suggestions = res.body
        }
      }, (err) => {
        this.error = err
        this.showError = true
      })
    },
    getAdvancedSuggestions() {
      this.$http.post('getSuggestions/advancedSearch', {
        token: this.token,
        min_age: this.min_age,
        max_age: this.max_age,
        min_fame: this.min_fame,
        max_fame: this.max_fame,
        max_dist: this.max_dist,
        tag1: this.tag1,
        tag2: this.tag2,
        tag3: this.tag3
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.showError = true
        } else {
          this.suggestions = res.body
        }
      }, (err) => {
        this.error = err
        this.showError = true
      })
    },
    showUser(user) {
      this.userToShow = user;
      this.$http.post('like/checkLike', {
        token : this.token,
        receiver : this.userToShow._id
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.showError = true
        } else {
          this.liked = res.body
          this.popup = true
          this.notification = this.user.firstName + ' looked your profil'
          this.sendNotification();
        }
      }, (err) => {
        this.error = err
        this.showError = true
      }),
      this.popup = true;
    },
    closeProfil() {
      this.popup = false;
    },
    closeMatch() {
      this.itsAMatch = false;
    },
    likeUser() {
      this.$http.post('like/like', {
        token : this.token,
        receiver : this.userToShow._id
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.showError = true
        } else {
          this.liked = res.body
          if (this.liked === 'true') {
            this.checkIfMatch()
            this.notification = this.user.firstName + ' liked you!'
            this.sendNotification()
          } else {
            this.notification = this.user.firstName + ' has unliked you'
            this.sendNotification()
          }
        }
      }, (err) => {
        this.error = err
        this.showError = true
      })
    },
    blockUser() {
      this.$http.post('like/blockUser', {
      token: this.token,
      userToBlock: this.userToShow._id
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      }
      else {
        this.blocked = res.body
      }
    }, (err) => {
      this.error = err
      this.showError = true
      })
    },
    checkIfBlocked() {
      this.$http.post('like/checkIfBlocked', {
        token: this.token,
        userBlocked: this.userToShow._id
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.showError = true
        } else {
          this.blocked = res.body
        }
      }, (err) => {
        this.error = err
        this.showError = true
      })
    },
    checkIfMatch() {
      this.$http.post('getMatchs/checkIfMatch', {
      token : this.token,
      receiver : this.userToShow._id
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.error = res.body
        this.showError = true
      }
      else if (res.body == 'match') {
      this.itsAMatch = true
      this.notification = 'You matched with ' + this.user.firstName + '!'
      this.sendNotification();
      }
    }, (err) => {
      this.error = err
      this.showError = true
    })
  },
  sendNotification() {
     this.$http.post('notification/sendNotification', {
       token: this.token,
       receiver: this.userToShow._id,
       text: this.notification
     }, {emulateJSON: true}).then((res) => {
       if (res.status == 203) {
         this.error = res.body
         this.showError = true
       } else {
         this.showError = false
       }
     }, (err) => {
       this.error = err
       this.showError = true
     })
   },
   setTags() {
     if (this.tag1 == true)
      this.tag1 = this.user.tags[0]
    if (this.tag2 == true)
      this.tag2 = this.user.tags[1]
    if (this.tag3 == true)
      this.tag3 = this.user.tags[2]
   },
   sortByAge() {
      this.suggestions.sort(function(a, b){return a.age - b.age})
   },
   sortByFame() {
     this.suggestions.sort(function(a, b){return a.popularity - b.popularity})
   },
   sortByLocation() {
     this.suggestions.sort(function(a, b){return a.distance - b.distance})
   },
  navigateTo (route) {
    this.$router.push(route)
  },
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

.error {
  color: red;
}
</style>
