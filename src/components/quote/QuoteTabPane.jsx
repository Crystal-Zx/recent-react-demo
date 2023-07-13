import { useMemo } from "react"
import { Collapse, Empty, Spin } from "antd"
import { useSymbolStore } from "../../stores/useSymbolStore"

const { Panel } = Collapse

function QuoteItem({ name }) {
  const data = useSymbolStore.use.symbolData(data => data[name])
  // console.log("==> QuoteItem render")

  return (
    <p>
      {name} {data?.quote?.ask} {data?.quote?.bid}
    </p>
  )
}

export default function QuoteTabPane({ groupInfo }) {
  console.log("==> QuoteTabPane render", groupInfo)
  if (groupInfo === null) return <Spin />
  const items = Object.entries(groupInfo).map(([group, names]) => ({
    key: group,
    label: group,
    children: names.map(name => <QuoteItem key={name} name={name} />),
  }))

  console.log("==> items", items)
  if (!Object.keys(groupInfo).length) return <Empty />
  return (
    <Collapse
      items={items}
      bordered={false}
      defaultActiveKey={items?.[0].key}
    />
  )
}
