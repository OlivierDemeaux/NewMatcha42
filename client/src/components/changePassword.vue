<template lang="html">
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Change Your Password</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="password" name="oldPassword" v-model="oldPassword" placeholder="oldPassword" /></v-text-field>
            <br>
            <v-text-field type="password" name="newPassword" v-model="newPassword" placeholder="newPassword" /></v-text-field>
            <br>
            <v-text-field type="password" name="newPasswordConfirmation" v-model="newPasswordConfirmation" placeholder="New Password Confirmation" /></v-text-field>
            <br>
            <div class="error" v-html="error" v-if="error" />
            <div class="success" v-html="success" v-else="!error"/>
            <v-btn dark class="cyan" @click="changePassword()">Reset Password</v-btn>
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
      oldPassword: null,
      newPassword: null,
      newPasswordConfirmation: null,
      success: null,
      error: null
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
    changePassword() {
      this.$http.post('users/changePassword', {
        token: this.token,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newPasswordConfirmation: this.newPasswordConfirmation
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.error = res.body
          this.succes = null
        }
        else {
        this.success = res.body,
        this.error = null
      }
      }, (err) => {
        this.error = err.body
        this.succes = null
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
