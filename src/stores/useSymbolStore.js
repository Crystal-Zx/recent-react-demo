import { create } from "zustand"
import { createSelector } from "./createSelector"
import { immer } from "zustand/middleware/immer"

const useSymbolStoreBase = create(
  immer((set, get) => ({
    symbolData: {},
    actions: {
      // NOTE: set 方法一定在 update 之前使用，否则会覆盖值
      initSymbolDataFromArr: symbolArr => {
        set(state => {
          state.symbolData = Object.fromEntries(
            symbolArr.map(item => [item.name, item])
          )
        })
      },
      updateSymbolQuote: quoteMap => {
        console.log("==> update quoteMap", quoteMap)
        // const data = Object.fromEntries(quoteMap)
        // data = data.map(item => {
        //   const res = state.getSymbolInfo(item?.name || item?.symbol)
        //   const { holc = {} } = res || {}
        //   item.name = item.symbol
        //   item.spread =
        //     holc?.open &&
        //     toDecimal(((item.bid - holc?.open) * 100) / holc?.open, 2)
        //   // 处理小数位显示
        //   const digits = item.digits
        //   item.bid = toDecimal(item.bid, digits)
        //   item.ask = toDecimal(item.ask, digits)
        //   return item
        // })

        // set(state => {
        //   for (const [key, item] of quoteMap) {
        //     state.symbolData[key].quote = item
        //   }
        // })
      },
    },
  }))
)

export const useSymbolStore = createSelector(useSymbolStoreBase)
