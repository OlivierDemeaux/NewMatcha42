<template lang="html">
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Change User FirstName</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="text" name="newFirstName" v-model="newFirstName" placeholder="New FirstName" /></v-text-field>
            <br>
            <div class="error" v-html="errorFirstName" v-if="errorFirstName" />
            <div class="success" v-html="successFirstName" v-else-if="successFirstName" />
            <v-btn dark class="cyan" @click="changeFirstName()">Change FirstName</v-btn>
          </div>
      </div>
      <br>

      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Change User LastName</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="text" name="newLastName" v-model="newLastName" placeholder="New LastName" /></v-text-field>
            <br>
            <div class="error" v-html="errorLastName" v-if="!successLastName" />
            <div class="success" v-html="successLastName" v-else-if="successLastName" />
            <v-btn dark class="cyan" @click="changeLastName()">Change LastName</v-btn>
          </div>
      </div>
      <br>

      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Change User Email</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="text" name="newEmail" v-model="newEmail" placeholder="New Email" /></v-text-field>
            <br>
            <div class="error" v-html="errorEmail" v-if="!successEmail" />
            <div class="success" v-html="successEmail" v-else-if="successEmail" />
            <v-btn dark class="cyan" @click="changeEmail()">Change Email</v-btn>
          </div>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      token: this.checkToken(),
      newLastName: null,
      newFirstName: null,
      newEmail: null,
      successLastName: null,
      errorLastName: null,
      successFirstName: null,
      errorFirstName: null,
      successEmail: null,
      errorEmail: null
    }
  },
  methods: {
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
    changeLastName() {
      this.$http.post('users/changeLastName', {
        token: this.token,
        newLastName: this.newLastName
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.errorLastName = res.body
          this.successLastName = null
        }
        else {
        this.successLastName = res.body,
        this.errorLastName = null
      }
      }, (err) => {
        this.errorLastName = err.body
      })
    },
    changeFirstName() {
      this.$http.post('users/changeFirstName', {
        token: this.token,
        newFirstName: this.newFirstName
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.errorFirstName = res.body
          this.successFirstName = null
        }
        else {
        this.successFirstName = res.body,
        this.errorFirstName = null
      }
      }, (err) => {
        this.errorFirstName = err.body
      })
    },
    changeEmail() {
      this.$http.post('users/changeEmail', {
        token: this.token,
        newEmail: this.newEmail
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.errorEmail = res.body
          this.successEmail = null
        }
        else {
        this.successEmail = res.body,
        this.errorEmail = null
      }
      }, (err) => {
        this.errorEmail = err.body,
        this.successEmail = null
      })
    }
  }
}
</script>

<style lang="css">
.error {
  color: red;
}
.success {
  color: green;
}
</style>
