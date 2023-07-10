import { useEventEmitter, useWebSocket } from "ahooks"
import { create } from "zustand"
import { createSelector } from "./createSelector"
import SocketEventEmitter from "../components/websocket/socketEventEmitter"

const ReadyState = {
  Connecting: 0,
  Open: 1,
  Closing: 2,
  Closed: 3,
}

const useWebSocketStoreBase = create((set, get) => ({
  url: "",
  evtEmitter: new SocketEventEmitter(),
  sendMessage: () => {},
  actions: {
    saveSendMessage: fn => {
      set({ sendMessage: fn })
    },
    // initWs: url => {
    //   // 创建一个事件监听处理对象
    //   // set({ evtEmitter: useEventEmitter() })
    //   const { readyState, sendMessage, latestMessage, disconnect, connect } =
    //     useWebSocket(
    //       url,
    //       // "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
    //       // "wss://demotrade.alphazone-data.cn/ws"
    //       {
    //         onOpen: (evt, ins) => {
    //           console.log("==> websocket 连接已建立", evt, ins)
    //         },
    //       }
    //     )
    //   // 处理信息
    //   const { type, data } = JSON.parse(latestMessage.data)
    //   if (type === "pong") return // 心跳检测的返回数据不放入事件处理中心
    //   get().evtEmitter.emit(type, data)
    // },
  },
}))

export const useWebSocketStore = createSelector(useWebSocketStoreBase)
