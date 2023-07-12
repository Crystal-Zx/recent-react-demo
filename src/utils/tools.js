// NOTE: 工具类
// --- 数字格式化：保留指定位数小数
export const toDecimal = (num, digits = 2) => {
  if (!Number(num)) return num
  num = num + ""
  digits = Number(digits)
  if (isNaN(num)) return "0." + "0".repeat(digits)
  // 取整数
  if (digits === 0) {
    return num.split(".")[0]
  }
  // 截取小数点后digits位
  if (num.indexOf(".") !== -1) {
    num = num.substring(0, num.indexOf(".") + digits + 1)
  } else {
    num += "."
  }
  while (digits - num.split(".")[1].length > 0) {
    num += "0"
  }
  return num
}
