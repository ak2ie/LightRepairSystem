<template>
  <v-row>
    <v-col cols="12">
      <my-map />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import MyMapVue from '~/components/MyMap.vue'

export default Vue.extend({
  components: {
    'my-map': MyMapVue,
  },
})
</script>

