<template>
  <div id="map"></div>
</template>

<script lang="ts">
import mapboxgl, { MapboxOptions, Map } from 'mapbox-gl'
import Vue from 'vue'

export type DataType = {
  map: Map
  option: MapboxOptions
}

// 検索バー
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
// 日本語化
const MapboxLanguage = require('@mapbox/mapbox-gl-language')

export default Vue.extend({
  data(): DataType {
    return {
      map: {} as Map,
      option: {
        accessToken: process.env.MAPBOX_ACCESSTOKEN,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v8',
        center: [143.767125, 38.681236],
        zoom: 4,
      },
    }
  },
  mounted() {
    this.map = new mapboxgl.Map(this.option)
    // 検索バー
    this.map.addControl(
      new MapboxGeocoder({
        accessToken: this.option.accessToken,
        mapboxgl,
      })
    )
    // 日本語化
    this.map.addControl(
      new MapboxLanguage({
        defaultLanguage: 'ja',
      })
    )
  },
})
</script>

<style>
@import url('mapbox-gl/dist/mapbox-gl.css');
@import url('@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css');
</style>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>