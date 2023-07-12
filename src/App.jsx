import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react"
import { useEventEmitter, useWebSocket } from "ahooks"
import { useWebSocketStore } from "./stores/useWebSocketStore"
import { useSymbolStore } from "./stores/useSymbolStore"
import QuoteModule from "./components/quote/QuoteModule"
import { enableMapSet } from "immer"
import { throttle } from "lodash"
import CounterLabel from "./components/Counter"
import RaceCondition from "./components/RaceCondiftion"
import WebSocketDemo from "./components/websocket/WebSocketDemo"
import { Button, Spin } from "antd"
// import { initSocket } from "./components/websocket/Socket1"

// enableMapSet()

const ReadyState = {
  Connecting: 0,
  Open: 1,
  Closing: 2,
  Closed: 3,
}

function App(props) {
  console.log("==> App render")
  const { initSocket } = useWebSocketStore.use.actions()
  const [isWebSocketReady, setIsWebSocketReady] = useState(false)

  useEffect(() => {
    const wsClient = initSocket("wss://demotrade.alphazone-data.cn/ws")
    wsClient.subscribeOnce("open", () => setIsWebSocketReady(true))
    return () => {
      wsClient.closeSocket()
    }
  }, [])
  // const evtEmitter = useWebSocketStore.use.evtEmitter()
  // const { saveSendMessage } = useWebSocketStore.use.actions()
  // const { initSymbolDataFromArr, updateSymbolQuote } =
  //   useSymbolStore.use.actions()

  // // 建立 websocket 连接
  // const {
  //   readyState,
  //   sendMessage: _sendMessage,
  //   latestMessage,
  //   disconnect,
  //   connect,
  // } = useWebSocket(
  //   // "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
  //   "wss://demotrade.alphazone-data.cn/ws",
  //   {
  //     onOpen: (evt, ins) => {
  //       console.log("==> websocket onOpen", evt, ins)
  //     },
  //     onClose: evt => {
  //       // console.log("==> websocket onClose")
  //       console.log(
  //         `[WS CLOSED]websocket连接关闭，相关信息：${evt?.reason} ${evt?.code} ${evt.wasClean}`
  //       )
  //     },
  //     onError: evt => {
  //       // console.error("==> websocket onError", evt)
  //       console.error(
  //         `[WS ERROR]websocket连接异常，相关信息：${evt?.reason} ${evt?.code} ${evt.wasClean}`
  //       )
  //     },
  //     onMessage: message => {
  //       console.log("==> websocket onMessage", message)
  //       const { data: originData } = message
  //       const { type, data } = JSON.parse(originData)
  //       // 在此处将所有的 data 转发到 type 对应的事件处理程序中去
  //       if (type === "pong") return
  //       // evtEmitter.emit(type, data)
  //     },
  //   }
  // )
  // const sendMessage = useCallback(
  //   data => {
  //     _sendMessage(JSON.stringify(data))
  //   },
  //   [_sendMessage]
  // )
  // useEffect(() => {
  //   // 本组件销毁时主动关闭 websocket 连接
  //   return () => {
  //     disconnect && disconnect()
  //   }
  // }, [])
  // useEffect(() => {
  //   // 连接建立后，立刻获取交易品种详细信息
  //   // console.log("==> readyState", readyState)
  //   if (readyState === ReadyState.Open) {
  //     // saveSendMessage(sendMessage)
  //     sendMessage({ cmd: "symbols", args: [""] })
  //     evtEmitter.once("symbol", onSymbolDataCallback)
  //   }

  //   // -- 报价更新做节流处理，降低渲染频率
  //   const cacheQuoteDataMap = new Map()
  //   const updateSymbolQuoteThrottle = throttle(
  //     () => {
  //       if (!cacheQuoteDataMap.size) return
  //       updateSymbolQuote(cacheQuoteDataMap)
  //       cacheQuoteDataMap.clear()
  //     },
  //     3000,
  //     {
  //       leading: true,
  //     }
  //   )
  //   // 接收到品种接口数据后立刻请求对应品种的报价信息
  //   function onSymbolDataCallback(data) {
  //     initSymbolDataFromArr(data)

  //     // 本接口返回数据中 data.item.name 为币种名称
  //     const names = data.map(item => item.name).join(",") // 获取所有的品种代码，拼成一个数组
  //     // 请求报价
  //     sendMessage({ cmd: "quote", args: [names] })
  //     // // 注册收到报价数据后的回调函数
  //     // evtEmitter.on("quote", data => {
  //     //   // 本接口返回数据中 data.symbol 为币种名称
  //     //   cacheQuoteDataMap.set(data.symbol, data)
  //     //   updateSymbolQuoteThrottle()
  //     // })
  //   }
  // }, [readyState])

  if (!isWebSocketReady) return <Spin size="large" />

  return (
    <>
      {/* <button
        onClick={() => 
          sendMessage &&
          sendMessage(
            JSON.stringify({ cmd: "quote", args: ["CADJPY", "USDAUD"] })
          )
        }
      >
        订阅品种数据
      </button>
      <button onClick={() => disconnect && disconnect()}>Disconnect</button> */}
      <QuoteModule />
    </>
  )
}

export default App
