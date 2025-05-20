import React from 'react';

interface Props {
  log: any;
}

export const LogLineView: React.FC<Props> = ({ log }) => (
  <div className={`log ${log.status}`}>{JSON.stringify(log.this)}</div>
);
