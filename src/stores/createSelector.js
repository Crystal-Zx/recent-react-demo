export const createSelector = _store => {
  let store = _store
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    store.use[k] = (fn = null) =>
      store(s => {
        // 支持 property 查询时传入 selector
        if (typeof fn === "function") return fn(s[k])
        return s[k]
      })
  }

  return store
}
