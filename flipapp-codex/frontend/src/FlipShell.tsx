import { useState } from 'react'
import LogLine from './apps/LogLine'
import NewLog from './apps/New'
import Communicator from './apps/Communicator'

export default function FlipShell() {
  const [app, setApp] = useState<'log' | 'new' | 'chat'>('log')

  return (
    <div className="flip-shell">
      <nav>
        <button onClick={() => setApp('log')}>LogLine</button>
        <button onClick={() => setApp('new')}>New</button>
        <button onClick={() => setApp('chat')}>Chat</button>
      </nav>
      <main>
        {app === 'log' && <LogLine />}
        {app === 'new' && <NewLog />}
        {app === 'chat' && <Communicator />}
      </main>
    </div>
  )
}
