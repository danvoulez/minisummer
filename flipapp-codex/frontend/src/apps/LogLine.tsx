import { useEffect, useState } from 'react'
import { fetchLogs } from '../lib/loglineHelpers'

export default function LogLine() {
  const [logs, setLogs] = useState<any[]>([])
  useEffect(() => {
    fetchLogs().then(setLogs)
  }, [])

  return (
    <ul>
      {logs.map(l => (
        <li key={l.id}>{l.this?.raw}</li>
      ))}
    </ul>
  )
}
