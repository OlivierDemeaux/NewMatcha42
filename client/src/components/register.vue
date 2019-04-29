<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>

        <div class="pl-4 pr-4 pt-2 pb-2">
          <form name="register-form" autocomplete="off">
            <v-text-field type="text" name="emailAddress" v-model="emailAddress" placeholder="email" /></v-text-field>
            <br>
            <v-text-field type="text" name="username" v-model="username" placeholder="username" /></v-text-field>
            <br>
            <v-text-field type="text" name="lastName" v-model="lastName" placeholder="lastName" /></v-text-field>
            <br>
            <v-text-field type="text" name="firstName" v-model="firstName" placeholder="firstName" /></v-text-field>
            <br>
            <v-text-field type="password" name="password" v-model="password" placeholder="password" /></v-text-field>
            <br>
            <v-text-field type="password" name="passwordConfirmation" v-model="passwordConfirmation" placeholder="confirmation password" />
            <br>
            <div class="error" v-html="error" v-if="!success" />
            <div class="success" v-html="success" v-else-if="success" />
          </form>
        </div>
        <v-btn dark class="cyan" @click="register()">Register</v-btn>
        </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      emailAddress: '',
      username: '',
      lastName: '',
      firstName: '',
      password: '',
      passwordConfirmation: '',
      error: null,
      success: null,
    }
  },
  methods: {
    register () {
      this.$http.post('register', {
        emailAddress: this.emailAddress,
        username: this.username,
        lastName: this.lastName,
        firstName: this.firstName,
        password: this.password,
        passwordConfirmation: this.passwordConfirmation
      }, {emulateJSON: true}).then((response) => {
        if (response.status == 203) {
          this.error = response.body
        } else {
          this.success = response.body;
          //this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
        }
      }, (err) => {
        this.error = err.body
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>
