<template>
  <v-row>
    <v-col cols="3">
      <v-list two-line>
        <v-list-item-group v-model="selectedItemIndex">
          <template v-for="(item, index) in list">
            <v-list-item :key="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>20201/07/01 20:09</v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col cols="9">
      <v-row class="flex-column">
        <my-map />
        <v-card style="height: 100px">
          <v-card-text> 詳細 </v-card-text>
          {{ selectedLight.title }}
        </v-card>
      </v-row>
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
  data() {
    return {
      // list: [
      //   {
      //     name: '新宿区XX-1111',
      //     status: '修理中',
      //     date: new Date('2021/7/1 23:22'),
      //   },
      //   {
      //     name: '新宿区XX-1112',
      //     status: '修理中',
      //     date: new Date('2021/7/1 20:33'),
      //   },
      // ],
      // selectedItemIndex: -1,
    }
  },
  async fetch() {
    await this.$accessor.lightList.loadAllData()
  },
  computed: {
    selectedLight() {
      return this.$accessor.lightList.selectedLight || { title: '' }
    },
    list() {
      return this.$accessor.lightList.lightList
    },
    selectedItemIndex: {
      get() {
        const selected = this.$accessor.lightList.selected
        if (selected) {
          let index = 0
          for (
            index = 0;
            index < this.$accessor.lightList.lightList.length;
            index++
          ) {
            if (
              selected.title === this.$accessor.lightList.lightList[index].title
            ) {
              break
            }
          }
          return index
        } else {
          return -1
        }
      },
      set(value: number) {
        const title = this.$accessor.lightList.lightList[value].title
        this.$accessor.lightList.select(title)
        this.$accessor.lightList.setFlyTo(
          this.$accessor.lightList.lightList[value]
        )
      },
    },
  },
  watch: {},
  methods: {},
})
</script>

