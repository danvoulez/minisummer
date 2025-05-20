import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function NewLog() {
  const [text, setText] = useState('')

  async function submit() {
    await supabase.from('logline').insert({
      who: 'user:demo',
      tenant_id: 'demo',
      this: { raw: text },
      status: 'raw'
    })
    setText('')
  }

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={submit}>Enviar</button>
    </div>
  )
}
