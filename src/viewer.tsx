import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

type LogLine = {
  id: string;
  who: string;
  did: string;
  this: Record<string, unknown>;
  status: string;
};

const statusColor: Record<string, string> = {
  raw: '#ccc',
  enriched: '#ffd700',
  contextual: '#75d88a',
  archived: '#72a4d4'
};

export function LogLineViewer() {
  const [logs, setLogs] = useState<LogLine[]>([]);

  useEffect(() => {
    supabase.from('logline').select('*').limit(100).then(({ data }) => {
      if (data) setLogs(data as LogLine[]);
    });
  }, []);

  return (
    <div>
      {logs.map(log => (
        <div key={log.id} style={{ background: statusColor[log.status] || '#eee', padding: '4px', marginBottom: '4px' }}>
          <strong>{log.who}</strong> {log.did}
          <pre>{JSON.stringify(log.this, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
