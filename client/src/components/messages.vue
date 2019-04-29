<template >
  <div v-if="matchs.length == 0">
    You first need to match with someone to exchange messages
  </div>
    <section v-else id="container_message">
      <div class="list_user">
        <div v-for="user in matchs">
          <div v-if="user" class="show-user-message" @click="setUserToShow(user); checkIfBlocked(user)">
            <h3>{{user.firstName}} {{user.lastName}}, {{user.age}}</h3>
          </div>
        </div>
      </div>

      <div class="container_display" id="messages_div">
          <div class="display_message" v-if="userToShow !== null" id="scrool">
            <div v-if="messagesFromConvo.length == 0">
              You haven't exchanged any messages with {{this.userToShow.firstName}}
            </div>
            <div v-else>
              <div v-for="message in messagesFromConvo" ref='messageDisplay' class="suggestions-profil-message" id="test">
                <div class="my-messages" v-if="message.sender === me">
                    {{message.text}}
                </div>
                <div class="other-messages" v-if="message.sender !== me">
                    {{message.text}}
                </div>
              </div>
            </div>
          </div>
          <div class="create_message" v-if="this.userIsBlocked == 'notBlocked'">
            <b-form-textarea v-model="text" placeholder="write a new message" :rows="3" :max-rows="6"></b-form-textarea> <br>
            <v-btn dark class="cyan" @click="sendMessage()">Send Message</v-btn>
          </div>
          <div v-if="this.userIsBlocked == 'blocked'">
            <br><br>
            You either blocked this user or this user blocked you <br>
            You can not send a new message <br><br>
          </div>
      </div>

    </section>
</template>

<script>
export default {
  data() {
    return {
      token: this.checkToken(),
      user: null,
      apiURL: this.$http.options.root,
      matchs: [],
      text: null,
      messagesFromConvo: [],
      receiver: null,
      userToShow: null,
      me: null,
      first: true,
      convoIsEmpty: false,
      userIsBlocked: false,
      notification: null,
      unreadNotifications: null,
      error: null,
      showError: false,
      lengthMessages: 0,
    }
  },
  mounted() {
    this.getUser(),
    this.getMatchs(),
    setInterval(function(){ this.getMessages(); }.bind(this), 3000);
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
          this.me = this.user._id;
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
      }
      else {
        this.$store.commit('SET_TOKEN', null)
        this.$router.push('login')
        }
      },
      sendMessage() {
        this.$http.post('messages/sendMessage', {
          token: this.token,
          text: this.text,
          receiver: this.userToShow._id
        }, {emulateJSON: true}).then((res) => {
          if (res.status == 203) {
            this.error = res.body
            this.showError = true
          } else {
            this.messages = res.body;
            this.notification = this.user.firstName + ' sent you a message';
            this.sendNotification();
            this.text = '';
            this.getNewMessages();
          }
        }, (err) => {
          this.error = err
          this.showError = true
        })
      },
      getNewMessages() {
        if (this.userToShow === null)
          return;
        this.$http.post('messages/getMessages', {
          token: this.token,
          receiver: this.userToShow._id
        }, {emulateJSON: true}).then((res) => {
          if (res.status == 203) {
            this.error = res.body
            this.showError = true
          } else {
            if (res.body.length == 0)
              this.convoIsEmpty = true;
            this.messagesFromConvo = res.body

            this.$nextTick(function() {
              this.scrollToBottom()
            })
            this.first = false;
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
      getMatchs() {
        this.$http.post('getMatchs', {
          token: this.token
        }, {emulateJSON: true}).then((res) => {
          this.matchs = res.body;
        }, (err) => {
          this.error = err
          this.showError = true
        })
      },
      setUserToShow(user)
      {
        this.userToShow = user;
        this.getMessages();
      },
      getMessages() {
        if (this.userToShow === null)
          return;
        this.$http.post('messages/getMessages', {
          token: this.token,
          receiver: this.userToShow._id
        }, {emulateJSON: true}).then((res) => {
          if (res.status == 203) {
            this.error = res.body
            this.showError = true
          } else {
            if (res.body.length == 0)
              this.convoIsEmpty = true;
            this.messagesFromConvo = res.body
            if (this.lengthMessages < this.messagesFromConvo.length) {
              this.$nextTick(function() {
                this.scrollToBottom()
                })
              this.lengthMessages = this.messagesFromConvo.length
            }
            if(this.first) {
              this.$nextTick(function() {
                this.scrollToBottom()
              })
            }
            this.first = false;
          }
        }, (err) => {
          this.error = err
          this.showError = true
        })
      },
      checkIfBlocked(user) {
        this.$http.post('like/checkIfBlocked', {
          token: this.token,
          userBlocked: this.userToShow._id
        }, {emulateJSON: true}).then((res) => {
          this.userIsBlocked = res.body
        }, (err) => {
          this.error = err
          this.showError = true
        })
      },
      async scrollToBottom() {
            try {
                let objDiv = document.getElementById("scrool");
                if (objDiv)
                    objDiv.scrollTop = objDiv.scrollHeight;
            } catch (e) {
                this.error = e
                this.showError = true
            }
        },
      checkNotifications() {
        this.$http.post('notification/checkNotifications', {
          token: this.token,
      }, {emulateJSON: true}).then((res) => {
        this.unreadNotifications = res.body
      }, (err) => {
        this.error = err
        this.showError = true
      })
    }
  }
}
</script>

<style lang="css">
</style>
