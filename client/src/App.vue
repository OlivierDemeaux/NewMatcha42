<template>
  <div id="app">
    <page-header />
    <!-- <img src="./assets/logo.png"> -->
    <v-container fluid>
    <router-view/>
  </v-container>
  </div>
</template>

<script>
import PageHeader from '@/components/header.vue'
export default {
  name: 'App',
  components: {
    PageHeader
  },
  data() {
            return {
                video: {},
                canvas: {},
                captures: []
            }
        }
}
</script>

<style>
@import '/assets/css/mycss_lib.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.toolbar_title {
  color: white;
}
body: {
       background-color: #F0F0F0;
   }
   #app {
       text-align: center;
       color: #2c3e50;
       margin-top: 60px;
   }
   #video {
       background-color: #000000;
   }
   #canvas {
       display: none;
   }
   li {
       display: inline;
       padding: 5px;
   }
</style>
