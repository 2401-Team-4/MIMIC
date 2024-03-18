import {
  Navigate
} from 'react-router-dom'


import ExtraInfo from "./ExtraInfo"

import PlayerTest from "./PlayerTest"

import MainContentRightBar from "./MainContentRightBar"
import { sessionMetadataExtractor } from "../helpers/dataExtractors"

const MainContentArea = ({session, displayNotification}) => {
  if (!session) {
    displayNotification({ type: 'fail', message: 'Invalid Id' })
    return (
      <Navigate to={'/'} replace />
    )
  }

  return (
    <section className="main-content-area">
      <SessionContentHeader session={session}/>

      {/* 
      
      
        <div className="player">Player <div className="screen">Screen</div></div>

        <div className="player-controls">

          <div className="controls">
            <span>⏪⏯⏩</span>
              <span className="right-controls">📶🔁</span>
          </div>

        </div> 
      
      
      */}
        
      <PlayerTest session={session}/>

      <ExtraInfo session={session}/>

      <MainContentRightBar session={session}/>
  </section>
  )
}

const SessionContentHeader = ({session}) => {
  const {id, url, https, viewport} = sessionMetadataExtractor(session)

  return (
    <header>
      {`${https ? 
          '🔒' : 
          '🔓' 
        }
        Session #${id} - ${url} - 
        ${viewport.width}x${viewport.height} - 
        some other info??`}
    </header>
  )
}


export default MainContentArea