import React, { useRef, useMemo } from "react"
import { useWebSocket } from "ahooks"
// import { useWebSocketActions } from "../../stores/useWebSocketStore"

const ReadyState = {
  Connecting: 0,
  Open: 1,
  Closing: 2,
  Closed: 3,
}

export default () => {
  // const websocketActions = useWebSocketActions()

  const messageHistory = useRef([])

  const { readyState, sendMessage, latestMessage, disconnect, connect } =
    useWebSocket(
      // "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
      "wss://demotrade.alphazone-data.cn/ws"
    )

  // console.log("==> WebSocketDemo render", latestMessage)

  // messageHistory.current = useMemo(
  //   () => messageHistory.current.concat(latestMessage),
  //   [latestMessage]
  // )

  return (
    <div>
      <button
        onClick={
          () =>
            sendMessage &&
            sendMessage(
              JSON.stringify({ cmd: "quote", args: ["CADJPY", "USDAUD"] })
            )
          // sendMessage(JSON.stringify({ cmd: "symbols", args: [""] }))
        }
        // onClick={() => sendMessage && sendMessage(`${Date.now()}`)}
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ✉️ send
      </button>
      <button
        onClick={() => disconnect && disconnect()}
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ❌ disconnect
      </button>
      <button
        onClick={() => connect && connect()}
        disabled={readyState === ReadyState.Open}
      >
        {readyState === ReadyState.Connecting ? "connecting" : "📞 connect"}
      </button>
      <div style={{ marginTop: 8 }}>readyState: {readyState}</div>
      <div style={{ marginTop: 8 }}>
        <p>received message: </p>
        {/* {JSON.stringify(latestMessage.message.data)} */}
        {/* {messageHistory.current.map((message, index) => (
          <p key={index} style={{ wordWrap: "break-word" }}>
            {message?.data}
          </p>
        ))} */}
      </div>
    </div>
  )
}
