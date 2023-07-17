import { useState, useEffect } from "react"
import { useWebSocketStore } from "../stores/useWebSocketStore"
import QuoteModule from "../components/quote/QuoteModule"
import { Button, Spin } from "antd"

const AccountType = ["demo", "live"]
const WebSocketUrl = {
  [AccountType[0]]: "wss://demotrade.alphazone-data.cn/ws",
  [AccountType[1]]: "wss://livetrade.alphazone-data.cn/ws",
}

export default function WebTraderPage() {
  console.log("==> WebTraderPage render")
  const { initSocket } = useWebSocketStore.use.actions()
  const [isWebSocketReady, setIsWebSocketReady] = useState(false)
  const [accountType, setAccountType] = useState(AccountType[0])

  useEffect(() => {
    setIsWebSocketReady(false)
    const websocketUrl = WebSocketUrl[accountType]
    const wsClient = initSocket(websocketUrl)
    wsClient.subscribeOnce("open", () => setIsWebSocketReady(true))
    return () => {
      wsClient.closeSocket()
    }
  }, [accountType])

  if (!isWebSocketReady) return <Spin size="large" />

  return (
    <>
      <Button
        onClick={() =>
          setAccountType(at => AccountType[AccountType.indexOf(at) ^ 1])
        }
      >
        切换url
      </Button>
      <QuoteModule />
    </>
  )
}
