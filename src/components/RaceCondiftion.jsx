import { useEffect, useState } from "react"

export default function RaceCondition({ id }) {
  const [fetchedId, setFetchedId] = useState(id)
  const [data, setData] = useState(null)
  useEffect(() => {
    let active = true

    const fetchData = async () => {
      setTimeout(async () => {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`)
        const newData = await response.json()
        if (active) {
          console.log("==> setState called", id)
          setFetchedId(id)
          setData(newData)
        }
      }, Math.round(Math.random() * 12000))
    }

    fetchData()
    return () => {
      active = false
    }
  }, [id])

  return (
    <>
      <p>
        id: {id}, fetchedId: {fetchedId}
      </p>
      <div>{data && JSON.stringify(data)}</div>
    </>
  )
}
