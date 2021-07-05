const { getField, updateField } = window['vuex-map-fields']

const store = Vuex.createStore({
  state() {
    return {
      searchInput: "",
      repeat: false,
      rate: 1,
      firstLetters: false,
      apiToken: "",
    };
  },
  getters: {
      getField,
  },
  mutations: {
    updateField
  },
  plugins: [createPersistedState()]
});

export default store;
