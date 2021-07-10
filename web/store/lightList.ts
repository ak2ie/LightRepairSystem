import { getterTree, mutationTree, actionTree } from "typed-vuex"
import { SyncClient } from 'twilio-sync'

export interface LightPlace {
  title: string;
  longitude: number;
  latitude: number;
}
export const state = () => ({
  /**
   * 街灯リスト
   */
  lightList: [] as LightPlace[],
  /**
   * 選択した街灯
   */
  selectedLight: {} as LightPlace,
  /**
   * 地図移動ポイント
   */
  flyTo: { "latitude": 35.708505185551644, "title": "新宿区XX-22", "longitude": 139.70911949336235 } as LightPlace
})

export type RootState = ReturnType<typeof state>

export const getters = getterTree(state, {
  lightList: state => state.lightList,
  selected: state => state.selectedLight
})

export const mutations = mutationTree(state, {
  addLight(state, light: LightPlace): void {
    state.lightList.push(light)
  },
  selectLight(state, light: LightPlace): void {
    state.selectedLight = light;
  },
  /**
   * 地図の移動先の街頭を設定する
   * @param state 
   * @param light 移動先の街灯
   */
  setFlyTo(state, light: LightPlace): void {
    state.flyTo = light;
  }
})

export const actions = actionTree({ state, getters, mutations }, {
  /**
   * 街灯データを追加する
   * @param param0 
   * @param light 追加する街灯データ
   */
  add({ commit }, light: LightPlace) {
    commit("addLight", light)
  },
  /**
   * リストなどで街灯を選択状態とする
   * @param param0 
   * @param title 選択したい街灯データ
   */
  select({ state, commit }, title: string) {
    const selectedLight = state.lightList.filter(l => l.title === title)[0];
    commit("selectLight", selectedLight)
  },
  /**
   * 全データを取得する
   * @param param0 
   */
  async loadAllData({ commit }) {
    const token = await this.$axios.get(
      'https://lightrepairsystem-2963-dev.twil.io/syncToken'
    )
    const syncClient = new SyncClient(token.data.token)

    const map = await syncClient.map('Lights')
    const paginator = await map.getItems()
    paginator.items.forEach((item) => {
      console.log(item.key + ' ' + JSON.stringify(item.data))
      const data = item.data
      if (IsLightPlaceType(data)) {
        commit("addLight", {
          title: data.title,
          longitude: data.longitude,
          latitude: data.latitude,
        })
      }
    })
  },
  /**
   * 地図の移動先を指定する
   * @param param0 
   * @param light 移動先の街灯
   */
  mapMoveTo({ commit }, light: LightPlace) {
    commit("setFlyTo", light);
  }
})

function IsLightPlaceType(arg: any): arg is LightPlace {
  if ("title" in arg && "longitude" in arg && "latitude" in arg) {
    return true;
  }
  return false;
}
