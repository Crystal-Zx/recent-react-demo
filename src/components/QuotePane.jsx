import { useSymbolStore } from "../stores/useSymbolStore"

export default function QuotePane() {
  console.log("==> QuotePane render")
  // const symbolData = useSymbolStore.use.symbolData()
  return (
    <ul>
      {/* {Object.entries(symbolData).map(([key, value]) => {
        return (
          <li key={key}>
            <p>
              品种：{value.name} &nbsp; {value.cn_name}
            </p>
            <p>
              价格数据：{value?.quote?.ask} &nbsp; {value?.quote?.bid}
            </p>
          </li>
        )
      })} */}
    </ul>
  )
}
