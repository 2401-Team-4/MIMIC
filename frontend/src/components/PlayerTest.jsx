import { useEffect } from "react"

import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import '../style/unminified-rrplayer.css'

const PlayerTest = () => {

  useEffect(() => {
    loadSessionPlayer()
  }, [])

  const loadSessionPlayer = async () => {
    let replayerDiv = document.getElementById("replayer")
    if (replayerDiv.firstChild) {
      replayerDiv.removeChild(replayerDiv.firstChild)
    }

    try {

      const response = await fetch("http://localhost:3001/allRecordedEvents")

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`)
      }

      const eventData = await response.json()
      if (eventData.length === 0) {
        throw new Error("Event data is empty.")
      }
  
      // const combinedEvents = eventData.reduce(
      //   (allEvents, currentEvent) => allEvents.concat(currentEvent.events),
      //   []
      // )

      const combinedEvents = eventData.flat()

      new rrwebPlayer({
        target: document.getElementById("replayer"),
        props: {
          events: combinedEvents,
          // showController: false,
          width: 600,
          height: 370,
          autoPlay: true,
          
        },
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id="replayer"></div>    
  )
}

export default PlayerTest