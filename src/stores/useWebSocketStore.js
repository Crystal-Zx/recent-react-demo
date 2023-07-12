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
        if (get().wsClient !== null) {
          console.log("已有 websocket 实例，请勿重复创建")
          return
        }
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
