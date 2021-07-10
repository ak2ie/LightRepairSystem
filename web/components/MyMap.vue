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
        center: [139.70806478495345, 35.70089550191666],
        zoom: 14,
      },
    }
  },
  computed: {
    lightList() {
      const FeatureType: 'Feature' = 'Feature'
      const PointType: 'Point' = 'Point'
      return this.$accessor.lightList.lightList.map((light) => {
        return {
          type: FeatureType,
          geometry: {
            type: PointType,
            coordinates: [light.longitude, light.latitude],
          },
          properties: {
            name: light.title,
            icon: 'museum',
          },
        }
      })
    },
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

    this.map.on('load', () => {
      this.map.addLayer({
        id: 'lightPoints',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.lightList,
          },
        },
        layout: {
          'icon-image': ['concat', ['get', 'icon'], '-15'],
          'text-field': ['get', 'name'],
          // 'text-font': ['メイリオ', 'sans-serif'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
      })

      // 地図をリストで選択された街灯に移動させる
      this.$store.watch(
        () => this.$accessor.lightList.flyTo,
        (light) => {
          this.map.flyTo({
            center: [light.longitude, light.latitude],
            zoom: 14,
          })
        }
      )
    })

    this.map.on('click', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['lightPoints'],
      })
      if (!features.length) {
        return
      }
      const feature = features[0]
      const lightProperty = feature.properties
      if (lightProperty !== null) {
        this.$accessor.lightList.select(lightProperty.name)
      }
    })
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
  height: 80vh;
}
</style>