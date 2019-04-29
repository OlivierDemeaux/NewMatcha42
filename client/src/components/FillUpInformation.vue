<template>
  <div class="welcomePage">
          <div class="welcomeMessage">Welcome to Our Community, let's go find you a date !</div> </br>
          <div class="informations">Before we get started, please fill up the questionaire for us to know you better and find you </br> the perfect match</div>

          <v-layout align-center justify-center row fill-height>
            <v-flex align-self-center xs10>
              <div class="white elevation-2">
                <v-toolbar flat dense class="cyan" dark>
                  <v-toolbar-title>Register</v-toolbar-title>
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
                    <input type="age" name="age">
                  </div>
                  <div class="container-gender">
                    I'm interested in:
                    <input type="radio" id="male" value="Male" v-model="interestedIn">
                    <label for="male">Male</label>
                    <input type="radio" id="female" value="Female" v-model="interestedIn">
                    <label for="female">Female</label>
                    <input type="radio" id="Both" value="Both" v-model="interestedIn">
                    <label for="both">Both</label><br>
                  </div>
                  <div class="container-gender">
                    I'm looking for:
                    <input type="radio" id="casual" value="Casual" v-model="lookingFor">
                    <label for="casual">Casual</label>
                    <input type="radio" id="serious" value="Serious" v-model="lookingFor">
                    <label for="serious">Serious</label><br>
                  </div>
                </div>

                <v-btn dark class="cyan" @click="registerInformations()">Register</v-btn>
                </div>
            </v-flex>
          </v-layout>

          <div v-if="this.showError == true">
            {{this.error}}
          </div>

      </div>

</template>

<script>
export default {
  data () {
    return {
      error: null,
      success: null,
      gender: null,
      interestedIn: null,
      lookingFor: null,
      errRes: null,
      showResErr: false,
    }
  },
  mounted() {
    this.confirmation();
  },
  methods: {
    registerInformations() {
      this.$http.post('updateUser/registerInformations', {
      gender: this.gender,
      interestedIn: this.interestedIn,
      lookingFor: this.lookingFor
    },  {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
        this.errRes = res.body
        this.showResErr = true
      } else {
        this.errRes = res
      }
    }, (err) => {
      this.errRes = err
      this.showResErr = true
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
