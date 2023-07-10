import { useState, useMemo, useEffect } from "react"
import TestChild from "./TestChild"

export default function CounterLabel({ count }) {
  console.log("==> Counter render")
  const [prevCount, setPrevCount] = useState(count)
  const [trend, setTrend] = useState(null)

  useEffect(() => {
    if (count !== prevCount) {
      setPrevCount(count)
      setTrend(count > prevCount ? "increasing" : "decreasing")
      // return
    }
  }, [count])

  console.log("=============== rendering")
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
      <TestChild />
    </>
  )
}
