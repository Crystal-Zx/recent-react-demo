import { useState, useEffect, useMemo } from "react"
import { useSymbolStore } from "../../stores/useSymbolStore"
import { useWebSocketStore } from "../../stores/useWebSocketStore"
import { forEach, throttle } from "lodash"
import { Tabs } from "antd"
import QuoteTabPane from "./QuoteTabPane"

const FIXED_GROUP_NAME = {
  债券: "债券和国际期货",
  指数: "指数和合约",
  FOREX: "货币",
  美股: "股票",
}

export default function QuoteModule() {
  console.log("==> QuoteModule render")
  const wsClient = useWebSocketStore.use.wsClient()
  const { sendMessage, subscribe, subscribeOnce } = wsClient
  const { initSymbolDataFromArr, updateSymbolQuote } =
    useSymbolStore.use.actions()

  const [inlandGroups, setInlandGroups] = useState({})
  const [intlGroups, setIntlGroups] = useState({})

  // const [groupInfo, setGroupInfo] = useState({
  //   inlandGroups: null, // 国内期货
  //   intlGroups: null, // 国际市场
  //   groupsEntities: null,
  // })

  useEffect(() => {
    // 连接建立后，立刻获取交易品种详细信息
    sendMessage({ cmd: "symbols", args: [""] })
    subscribeOnce("symbol", onSymbolDataCallback)

    // -- 报价更新做节流处理，降低渲染频率
    const cacheQuoteDataMap = new Map()
    const updateSymbolQuoteThrottle = throttle(
      () => {
        if (!cacheQuoteDataMap.size) return
        updateSymbolQuote(cacheQuoteDataMap)
        cacheQuoteDataMap.clear()
      },
      3000,
      {
        leading: true,
      }
    )
    // 接收到品种接口数据后立刻请求对应品种的报价信息
    function onSymbolDataCallback(data) {
      initSymbolDataFromArr(data)
      // 为数据分组，将它们分到不同的 TabPane 中去
      handleGroup([...data])

      // 本接口返回数据中 data.item.name 为币种名称
      const names = data.map(item => item.name).join(",") // 获取所有的品种代码，拼成一个数组
      // 请求报价
      sendMessage({ cmd: "quote", args: [names] })
      // // 注册收到报价数据后的回调函数
      subscribe("quote", data => {
        // 本接口返回数据中 data.symbol 为币种名称
        cacheQuoteDataMap.set(data.symbol, data)
        updateSymbolQuoteThrottle()
      })
    }
    function handleGroup(data = []) {
      const inlandGroups = new Map(),
        intlGroups = new Map()
      // 根据应用的分类依据重新更新币种的 group 字段
      forEach(data, (item, idx) => {
        let { group, name } = item
        if (group.indexOf("期货") !== -1) {
          group = group.split("|")[1] || "其他"
          group = group === "INE" ? "其他" : group
          const groupArr = inlandGroups.get(group) || []
          groupArr.push(name)
          inlandGroups.set(group, groupArr)
        } else {
          const fixedGroup = FIXED_GROUP_NAME[group]
          const groupArr = intlGroups.get(fixedGroup) || []
          groupArr.push(name)
          intlGroups.set(fixedGroup, groupArr)
        }
      })
      setInlandGroups(Object.fromEntries(inlandGroups))
      setIntlGroups(Object.fromEntries(intlGroups))
    }
  }, [])

  const TabsItems = useMemo(
    () => [
      {
        key: 0,
        label: "自选",
        children: <QuoteTabPane groupInfo={[]} />,
      },
      {
        key: 1, // NOTE: key 值不要使用 intl 内容，否则会导致无意义的 render
        label: "国内期货",
        children: <QuoteTabPane groupInfo={inlandGroups} />,
      },
      {
        key: 2,
        label: "国际市场",
        children: <QuoteTabPane groupInfo={intlGroups} />,
      },
    ],
    [inlandGroups, intlGroups]
  )

  return <Tabs defaultActiveKey={1} items={TabsItems} />
}
