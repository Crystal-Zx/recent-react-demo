// NOTE: 发布订阅模式来分发处理 socket 数据
export default class EventEmitter {
  constructor() {
    // eventMap 用来存储事件和监听函数之间的关系
    this.eventMap = {}
  }
  // 负责注册事件的监听器，指定事件触发时的回调函数
  on = (evtName, handler) => {
    if (typeof handler !== "function") {
      throw new Error("==> EventEmitter error, handler is not a function")
    }
    if (!this.eventMap[evtName]) {
      this.eventMap[evtName] = []
    }
    this.eventMap[evtName].push(handler)
  }

  // 注册仅执行一次的回调函数
  once = (evtName, handler) => {
    const onceHandler = () => {
      let hasExecute = false
      return data => {
        if (hasExecute) return
        handler(data)
        hasExecute = true
      }
    }
    this.on(evtName, onceHandler())
  }
  // 负责触发事件，可以通过传参使其在触发的时候携带数据
  emit = (evtName, data) => {
    if (this.eventMap[evtName]) {
      this.eventMap[evtName].forEach(handler => {
        handler(data)
      })
    }
  }
  // 负责监听器的删除
  off = (evtName, handler) => {
    if (this.eventMap[evtName]) {
      this.eventMap[evtName].splice(
        this.eventMap[evtName].indexOf(handler) >>> 0,
        1
      )
    }
  }
}
