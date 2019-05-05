<template>
  <v-toolbar dense fixed class="cyan" dark>
      <div class="title-navbar">
        <v-btn class='home'  v-if="!$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'homepage'})">
          Matcha
        </v-btn>
        <v-btn class='home' v-if="$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'profil'})">
          Matcha
        </v-btn>
      </div>

      <div v-if="this.showError == true">
        {{this.error.body}}
      </div>

      <v-spacer></v-spacer>
      <div class="navbar-items">
        <button class="navbar-button" v-if="!$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'login'})">Login</button>
        <button class="navbar-button" v-if="!$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'register'})">Register</button>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'matchs'})">Matchs</button>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'messages'})">Messages</button>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'search'})">Search</button>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="showNotifications()">Notifications</button>
        <div v-if="$store.state.isUserLoggedIn"><img v-if="this.unreadNotification" class="notifications-bell" src="../assets/bell.svg"></div>
        <div class="navbar-notif" v-if="this.showNotif">
          <div v-for="notif in notifications" class="show-notifications" v-if="$store.state.isUserLoggedIn">
            <div class="show-notification-single" @click="readNotification(notif)">{{notif.notification}}<br></div>
          </div>
        </div>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="logout()">Logout</button>
      </div>
  </v-toolbar>


</template>

<script>
export default {
  data () {
    return {
      token: this.checkToken(),
      notifications: null,
      showNotif: false,
      unreadNotification: false,
      interval: null,
      error: null,
      showError: false,
    }
  },
  mounted () {
    this.startNotif();
  },
  methods: {
    startNotif() {
      let token = this.$localStorage.get('token')
      clearInterval(this.interval);
      if (token) {
        let vm = this;
        this.interval = setInterval(function(){ vm.getNotification();}, 1000);
      } else {
         clearInterval(this.interval)
      }
    },
    navigateTo (route) {
      this.$router.push(route)
    },
    logout () {
      this.notifications = null;
      this.unreadNotification = false;
      this.showNotif = false;
      this.token = null;
      this.$localStorage.remove('token')
      this.$store.commit('SET_TOKEN', null)
      this.$router.push({name: "login"})
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
        if (this.$route.name !== 'confirmation')
          this.$router.push('/')
      }
    },
    getNotification() {
      if (!this.$store.state.token)
        return;
      this.$http.post('notification/checkNotifications', {
        token: this.$store.state.token
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.showError = true
        } else {
          this.notifications = res.body
          if (this.notifications.length > 0)
            this.unreadNotification = true
          else {
            this.unreadNotification = false
            this.showNotif = false
          }
        }
      }, (err) => {
        this.error = err
        this.showError = true
      })
    },
    showNotifications() {
      if (this.showNotif == true) {
        this.showNotif = false
      }
      else {
        this.showNotif = true
      }
    },
    readNotification(notif) {
      this.$http.post('notification/readNotification', {
        token: this.$store.state.token,
        notification: notif._id
      }, {emulateJSON: true}).then((res) => {
        this.getNotification();
      }, (err) => {
        this.error = err
        this.showError = true
      })
    }
  },
  watch: {
     '$route': function(val) {
         this.startNotif();
     }
  }
}
</script>

<style scoped>
.home {
  cursor: pointer;
}

.home:hover {
  color: #E9E;
}

</style>
