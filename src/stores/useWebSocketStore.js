import { create } from "zustand"
import { createSelector } from "./createSelector"
import WebSocketClient from "../components/websocket/WebSocketClient"
import { immer } from "zustand/middleware/immer"
// import SocketEventEmitter from "../components/websocket/socketEventEmitter"

const useWebSocketStoreBase = create(
  immer((set, get) => ({
    wsClient: null,
    // url: "",
    // evtEmitter: new SocketEventEmitter(),
    // sendMessage: () => {},
    actions: {
      initSocket: url => {
        console.log("==> url", url)
        const prevWsClient = get().wsClient
        if (prevWsClient !== null) {
          const prevUrl = get().wsClient?.websocket?.url
          if (prevUrl === url) {
            console.log("已有相同 url 地址的 websocket 实例，请勿重复创建")
            return
          }
          // url 不一致就应该先清除旧的 wsClient 在创建新的
          prevWsClient.closeSocket()
        }
        // 创建新的 WebsocketClient 实例
        const wsClient = new WebSocketClient(url)
        set(state => {
          state.wsClient = wsClient
        })
        return wsClient
      },
      // saveSendMessage: fn => {
      //   set({ sendMessage: fn })
      // },
    },
  }))
)

export const useWebSocketStore = createSelector(useWebSocketStoreBase)
