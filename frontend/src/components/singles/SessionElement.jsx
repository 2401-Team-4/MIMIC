import { LineChart, Line } from 'recharts';

import { short } from '../../helpers/dataFormatters';

import {
  Link,
} from 'react-router-dom'
import NetworkIcon from '../iconComponents/network';
import LogsIcon from '../iconComponents/logs';
import ErrorsIcon from '../iconComponents/errors';
import DurationIcon from '../iconComponents/duration';
import { totalDuration } from '../../helpers/dataExtractors';

const SessionElement = ({session, currentSession, setCurrentSession}) => {
  const searchBar = document.querySelector('.search-input')
  const searchMode = searchBar && searchBar.value !== ''

  const date = session.metadata.date.match(/^(.+)T/)[1]
  const exactTime = session.metadata.date.match(/T(.{8})/)[1]

  return (
    <Link 
      to={`/sessions/${short(session.id).toLowerCase()}`} 
      onClick={() => setCurrentSession(session)}
    >
      <li className={`session-list-element ${session?.id.includes(currentSession?.id) ? 'active' : ''}`}>
        <p className='id'>{`#${searchMode ? session.id.toUpperCase() : short(session.id)}`}</p>
        <p className='time'>{`${date} at ${exactTime}`}</p>
        <p>Latency: </p>
        <MiniChart session={session}/>
        <div className='session-numbers'>
          <p className='numbers-network'>{<NetworkIcon/>}<span className='number'>{session.network.length}</span> </p>
          <p className='numbers-logs'>{<LogsIcon/>}<span className='number'>{session.logs.length}</span> </p>
          <p className='numbers-errors'>{<ErrorsIcon/>}<span className='number'>{session.errors.length}</span></p>
          <p className='numbers-duration'>{<DurationIcon/>}<span className='number'>{totalDuration(session)}</span></p>
        </div>
      </li>
      
    </Link>
  )
}

const MiniChart = ({session}) => {
  const data = session.events.filter(e => e.data.type !== 'WebSocket' && e.data.latency )
                             .map(e => { return {...e.data} })

  return (
    <LineChart width={200} height={50} data={data}>
      <Line type="monotone" dataKey="latency" stroke="#8884d8" dot={false}/>
    </LineChart>
  )
}

export default SessionElement