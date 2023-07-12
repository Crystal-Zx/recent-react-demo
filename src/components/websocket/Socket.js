import { message } from "antd"
import EventEmitter from "./socketEventEmitter"

export default class Socket {
  url = null
  socket = null
  evtEmitter = new EventEmitter()
  isManualClose = false // 是否手动关闭连接
  isReconnecting = false // 是否正处于重连中
  // reconnectTimerID = null  // 控制重连间隔时间（暂未使用）
  heartbeatTime = 1000 * 60 * 0.1 // 心跳检测间隔时间
  heartbeatCheckTimer = null // 心跳机制开启定时器
  heartbeatOutTimer = null // 心跳超时定时器
  handleInsStateChange = null // 改变公共状态（zustand）中 socket 实例状态的函数

  constructor(url, handleInsStateChange) {
    this.url = url
    this.handleInsStateChange = handleInsStateChange
    this.connect() // 构建的同时尝试进行 websocket 连接
  }
  init = () => {
    if ("WebSocket" in window || "MozWebSocket" in window) {
      const BrowserWebSocket = window.WebSocket || window.MozWebSocket
      // 实例化
      // console.log(this.url)
      this.socket = new BrowserWebSocket(this.url)
      !this.evtEmitter && (this.evtEmitter = new EventEmitter())
      // 监听事件
      this.socket.onopen = this.onopen
      this.socket.onmessage = this.onmessage
      this.socket.onerror = this.onerror
      this.socket.onclose = this.onclose
    } else {
      message.error("您的浏览器不支持 WebSocket，请更换浏览器重试")
    }
  }
  connect = () => {
    if (!!this.socket) {
      // 关闭上一次连接，并将实例对象置为 null
      this.socket.close()
      this.socket = null
      // message.error("您的网站已存在websocket连接，请断开后重试")
      // return
    }
    this.handleInsStateChange(0)
    this.init()
  }
  // 重连
  reconnect = () => {
    if (this.isReconnecting) return
    message.warning("检测到服务器连接断开，正尝试重连...")
    this.isReconnecting = true
    // this.socket = null
    this.closeHeartbeatCheck() // 关闭心跳检测
    this.connect()
  }
  send = msg => {
    if (this.socket.readyState !== 1) {
      // console.log("==> 连接被关闭，发送数据失败")
      !this.isManualClose && message.error("服务器暂未连接，发送数据失败")
      return
    }
    // console.log("==> 准备发送数据", msg)
    this.socket.send(JSON.stringify(msg))
  }
  // 手动关闭连接
  close = () => {
    this.isManualClose = true
    this.socket.close()
  }
  /** 心跳检测机制 */
  heartbeatCheck = () => {
    this.heartbeatCheckTimer = setTimeout(() => {
      this.send({ cmd: "ping", args: [""] })
      this.heartbeatOutTimer = setTimeout(() => {
        console.log("====> 断线啦")
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
  /** websocket 原生事件回调处理函数 */
  onopen = evt => {
    console.log("socket 连接成功")
    message.success("远程服务器连接成功")
    this.handleInsStateChange(1, this)
    this.isReconnecting = false
    // 开启心跳检测
    this.heartbeatCheck()
  }
  onmessage = evt => {
    try {
      // console.log("==> handleMessage", evt)
      // 收到任意消息都代表当前连接正常，重置心跳检测（关闭 heartbeatOutTimer 超时检测定时器）
      this.resetHeartbeatCheck()
      const { type, data } = JSON.parse(evt.data)
      if (type === "pong") return // 心跳检测的返回数据不放入事件处理中心
      this.evtEmitter.emit(type, data)
    } catch (e) {
      console.error(`[WS ERROR](${this.url}) 接收数据异常`)
    }
  }
  onerror = evt => {
    console.error(
      `[WS ERROR](${this.url}) 异常，相关信息：${evt?.reason} ${evt?.code} ${evt.wasClean}`
    )
    this.handleInsStateChange(2)
    // message.error("服务器连接异常")
    this.reconnect()
  }
  onclose = evt => {
    console.log(
      `[WS CLOSED](${this.url}) 关闭，相关信息：${evt?.reason} ${evt?.code} ${evt.wasClean}`
    )
    this.handleInsStateChange(2)
    // message.error("服务器连接已断开")
    if (this.isManualClose) return // 用户手动关闭连接不重连
    this.reconnect()
  }
  /** 发布订阅模式相关API */
  subscribe = (evtName, handler) => {
    this.evtEmitter.on(evtName, handler)
  }
  unsubscribe = (evtName, handler) => {
    this.evtEmitter.off(evtName, handler)
  }
  subscribeOnce = (evtName, handler) => {
    this.evtEmitter.once(evtName, handler)
  }
}
