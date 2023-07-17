import { message } from "antd"
import EventEmitter from "./EventEmitter"

export const ReadyState = {
  Connecting: 0,
  Open: 1,
  Closing: 2,
  Closed: 3,
}
// NOTE: 项目的 ws 不涉及 protocols 和 query
// const defaultOptions = {
//   url: "",
//   protocols: "",
//   query: {},
// }

export default class WebSocketClient {
  websocket = null // websocket 实例
  eventEmitter = null
  isManualClose = false // 是否手动关闭连接
  heartbeatTime = 1000 * 60 * 0.1 // 心跳检测间隔时间
  heartbeatCheckTimer = null // 心跳机制开启定时器
  heartbeatOutTimer = null // 心跳超时定时器
  reconnectCount = 0
  reconnectLimit = 3 // 心跳机制下超时最大重连次数

  constructor(url) {
    this.initSocket(url)
  }
  initSocket = url => {
    const that = this
    // 检测浏览器是否原生支持 WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket
    if (!window.WebSocket) {
      message.error("您的浏览器不支持 WebSocket，请更换浏览器重试")
      return
    }
    // 创建 websocket 实例
    that.websocket = new window.WebSocket(url)
    // 创建事件池（发布订阅）---> websocket 重建时事件池也需要重建
    that.eventEmitter = new EventEmitter()
    // 绑定方法
    that.websocket.onopen = function (e) {
      console.log("[WebSocket Client] WebSocket 连接成功", that)
      message.success("服务器连接成功")
      that.eventEmitter.emit("open")
      // 开启心跳检测
      that.heartbeatCheck()
    }
    that.websocket.onclose = function (e) {
      that.closeHeartbeatCheck() // 关闭当前的心跳检测
      console.log("[WebSocket Client] WebSocket 连接关闭", e)
      if (that.isManualClose) {
        // 目前仅切换 url 会触发手动断开连接
        message.warning("服务器正切换地址重连，请稍等...")
        return
      }
      if (that.reconnectCount > that.reconnectLimit) {
        message.error("服务器重连失败，请刷新浏览器重试")
        return
      }
      message.warning("服务器断开，正在尝试重连...")
      that.reconnectCount++
      that.initSocket(url)
    }
    that.websocket.onerror = function (e) {
      console.log(
        `[WebSocket Client] WebSocket 连接出错，错误码：${e?.code}，错误原因：${e?.reason}`
      )
      // TODO: 根据后续情况决定是否需要再次开启重连
    }
    that.websocket.onmessage = function (e) {
      console.log("[WebSocket Client] WebSocket 连接收到新消息")
      try {
        // 收到任意消息都代表当前连接正常，重置心跳检测（关闭 heartbeatOutTimer 超时检测定时器）
        that.resetHeartbeatCheck()
        const { type, data } = JSON.parse(e.data)
        if (type === "pong") return // 心跳检测的返回数据不放入事件处理中心
        that.eventEmitter.emit(type, data)
      } catch (e) {
        console.error(`[WebSocket Client] WebSocket 接收数据异常`)
      }
    }
  }
  // 手动关闭连接（此时不会进行自动重连）
  closeSocket = (code, reason = "手动关闭当前连接") => {
    this.isManualClose = true
    this.websocket.close() //code, reason)
  }
  // 发送信息
  sendMessage = data => {
    const jsonData = JSON.stringify(data)
    if (this?.websocket && this.websocket.readyState !== ReadyState.Open) {
      console.log(
        "[WebSocket Client] 服务器暂未连接，请稍后重新发送数据",
        jsonData
      )
      return
    }
    this.websocket.send(jsonData)
  }
  /** 发布订阅模式相关API */
  subscribe = (evtName, handler) => {
    this.eventEmitter.on(evtName, handler)
  }
  unsubscribe = (evtName, handler) => {
    this.eventEmitter.off(evtName, handler)
  }
  subscribeOnce = (evtName, handler) => {
    this.eventEmitter.once(evtName, handler)
  }
  /** 心跳检测机制 */
  heartbeatCheck = () => {
    this.heartbeatCheckTimer = setTimeout(() => {
      this.sendMessage({ cmd: "ping", args: [""] })
      this.heartbeatOutTimer = setTimeout(() => {
        console.error("[WebSocket Client] 心跳连接超时，WebSocket 已断线")
        this.socket.close() // NOTE: 此处需要断线重连，所以不能采用手动关闭
      }, this.heartbeatTime)
    }, this.heartbeatTime)
  }
  closeHeartbeatCheck = () => {
    this.heartbeatCheckTimer && clearTimeout(this.heartbeatCheckTimer)
    this.heartbeatOutTimer && clearTimeout(this.heartbeatOutTimer)
  }
  resetHeartbeatCheck = () => {
    this.closeHeartbeatCheck()
    this.heartbeatCheck()
  }
}

// export function initSocket(options = defaultOptions) {
//   if (!window.WebSocket)
//     return message.error("您的浏览器不支持WebSocket, 请更换浏览器!")
//   return new Socket(options, new EventEmitter(), 0)
// }
