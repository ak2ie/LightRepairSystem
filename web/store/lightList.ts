import { getterTree, mutationTree, actionTree } from "typed-vuex"


export interface LightPlace {
  title: string;
  longitude: number;
  latitude: number;
}
export const state = () => ({
  lightList: [] as LightPlace[],
  selectedLight: {} as LightPlace
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
  }
})

export const actions = actionTree({ state, getters, mutations }, {
  add({ commit }, light: LightPlace) {
    commit("addLight", light)
  },
  select({ state, commit }, title: string) {
    const selectedLight = state.lightList.filter(l => l.title === title)[0];
    commit("selectLight", selectedLight)
  }
})
