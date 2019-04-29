<template>
  <div v-if="matchs.length == 0">
    <div class="message-search-page">
      You haven't matched with anyone yet
    </div>
  </div>
  <div v-else>
    <div class="message-search-page">
      Here are the People you matched with. Send them a text !
    </div>
    <div class="suggestions-big-box">
          <div v-for="user in matchs" class="suggestions-profil">
            <div v-if="user" class="suggestions-profil-picture" @click="showUser(user)" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture1 + ')' }">
            </div>
            <h3>{{user.firstName}}, {{user.age}}</h3>
          </div>
    </div>

    <div class="show-user-details" v-if="popup">
      <div class="show-user-details-profil">
        <img class="show-user-close-button" @click="closeProfil()" src="../assets/cancel.svg">
        <div class="show-user-global">
          <div class="show-user-picture"  v-bind:style="{ backgroundImage: 'url(' + apiURL + this.userToShow.picture1 + ')' }">
          </div>
          <div class="show-user-infos">
            <div class="show-user-infos-names">
              {{this.userToShow.firstName}}  {{this.userToShow.lastName}}
            </div>
            {{this.userToShow.age}} years old <br/>
            <div class="show-user-infos-description">
              Description: {{this.userToShow.description}} <br/>
            </div>
            <div class="last_logged">
              {{this.lastLog}}
            </div>
            <div class="show-match-buttons">
                <v-btn dark class="cyan" @click="reportAsFake()">Report as fake account</v-btn>
            </div>
          </div>
        </div>
        <div class="show-user-otherpictures">
          <div class="show-user-otherpicture" v-if="this.userToShow.picture2 !== 'images/default.jpg'" v-bind:style="{ backgroundImage: 'url(' + apiURL + this.userToShow.picture2 + ')' }">
          </div>
          <div class="show-user-otherpicture" v-if="this.userToShow.picture3 !== 'images/default.jpg'" v-bind:style="{ backgroundImage: 'url(' + apiURL + this.userToShow.picture3 + ')' }">
          </div>
          <div class="show-user-otherpicture" v-if="this.userToShow.picture4 !== 'images/default.jpg'" v-bind:style="{ backgroundImage: 'url(' + apiURL + this.userToShow.picture4 + ')' }">
          </div>
          <div class="show-user-otherpicture" v-if="this.userToShow.picture5 !== 'images/default.jpg'" v-bind:style="{ backgroundImage: 'url(' + apiURL + this.userToShow.picture5 + ')' }">
          </div>
        </div>
      </div>
    </div>

    <div v-if="this.showError == true">
      {{this.error}}
    </div>

    <div class="show-user-details" v-if="fake">
      <div class="show-user-details-profil">
        <img class="show-user-close-button" @click="closeFake()" src="../assets/cancel.svg">
        <div class="fake-profil">
          The profil was reported as fake.<br>
          Thanks for your feedback <br>
          We will review fake profil soon
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
        token: this.checkToken(),
        matchs: [],
        apiURL: this.$http.options.root,
        popup: false,
        userToShow : [],
        logTime: null,
        fake: false,
        lastLog: false,
        error: null,
        showError: false,

    }
  },
  mounted() {
    this.getUser();
    this.getMatchs();
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
        }
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
      getMatchs() {
        this.$http.post('getMatchs', {
          token: this.token
        }, {emulateJSON: true}).then((res) => {
          if (res.status == 203) {
            this.error = res.body
            this.showError = true
          }
          else {
          this.matchs = res.body;
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
          this.liked = res.body;
          this.popup = true;
          this.lastLog = this.calculateLastLogTime(user)
        }, (err) => {
          this.error = err
          this.showError = true
        })
        this.popup = true
      },
      calculateLastLogTime(user) {
        let userLastLog = Math.floor(new Date(user.last_log).getTime()/1000)
        let timeNow = Math.floor(Date.now()/1000)
        let lastLog = Math.floor((timeNow - userLastLog) / 60)
        if (lastLog < 10)
          return (user.firstName + ' is online')
        else if (lastLog < 60)
          return (user.firstName + ' was online ' + lastLog + ' minutes ago')
        else {
          let hours = Math.floor(lastLog / 60)
          return (user.firstName + ' was online ' + hours + 'h ago' )
        }
      },
      reportAsFake() {
        this.fake = true
      },
      closeFake() {
        this.fake = false
      },
      closeProfil() {
        this.popup = false
      }
  }
}
</script>

<style lang="css">
</style>
