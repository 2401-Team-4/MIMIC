import ExtraInfo from "./ExtraInfo"

import PlayerTest from "./PlayerTest"

import MainContentRightBar from "./MainContentRightBar"

const MainContentArea = ({session}) => {
  const metadata = session.metadata
  
  const id = session.id

  const appName = metadata.url
  const https = metadata.url
  const viewport = metadata.viewport

  return (
    <section className="main-content-area">
    <header>
      {`${https ? '🔒' : '🔓' } Session #${id} - ${appName} - ${viewport.width}x${viewport.height} - some other info??`}
      </header>

    {/* <div className="player">Player <div className="screen">Screen</div></div>
    <div className="player-controls">Player Controls<br></br>
      <div className="controls">
        <span>⏪⏯⏩</span>
          <span className="right-controls">📶🔁</span>
      </div>
    </div> */}
        
    <PlayerTest session={session}/>


    {/* <div className="extra-info">Extra info (Console Logs, Errors, Network)</div> */}


    <ExtraInfo session={session}/>

    <MainContentRightBar session={session}/>
  </section>
  )
}


export default MainContentArea