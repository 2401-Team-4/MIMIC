import { epochToDate } from "./dataFormatters"
import { eventReference } from "./eventAnalysis"

export const sessionMetadataExtractor = (session) => {
  
  const id = session.id
  const metadata = session.metadata

  const url = metadata.url
  const time = metadata.date
  const https = metadata.https || /^https:/.test(url)
  const os = metadata.os
  const ip = metadata.ip
  const browser = metadata.browser
  
  const location = metadata.location

  const city = location.city
  const region = location.region
  const country = location.country
  const longitude = location.longitude
  const latitude = location.latitude
  const timezone = location.timezone

  return {
    id,
    url,
    time,
    browser,
    https,
    os,
    ip,
    city,
    region,
    country,
    longitude,
    latitude,
    timezone
  }
}

export const eventDataExtractor = (event, session) => {
  const data = event.data
  const time = relativeTime(event, session)
  const type = data.type
  const url = data.url

  let method;
  let responseStatus;
  let latency;
  if (data.type === 'WebSocket') {
    method = data.event
    responseStatus = 'N/A'
    latency = 'N/A'
  } else {
    method = data.method
    responseStatus = data.status
    latency = data.latency
  }
  return {
    time,
    type,
    url,
    responseStatus,
    method,
    latency,
  }
}

export const relativeTime = (event, session) => {
  // const initialTimestamp = session.events[0].timestamp
  // const timestamp = event.timestamp

  // const relativeSeconds = (timestamp - initialTimestamp) / 1000
  return formatTime(relativeSeconds(event, session))
}

export const relativeSeconds = (event, session) => {
  const initialTimestamp = session.events[0].timestamp
  const timestamp = event.timestamp

  return (timestamp - initialTimestamp) / 1000
}

// Function to convert seconds to the formatted time string (mm:ss)
export const formatTime = (seconds) => {
  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Pad minutes and seconds with zeros
  const paddedMinutes = padWithZeros(minutes, 2);
  const paddedSeconds = padWithZeros(remainingSeconds, 2);
  return `${paddedMinutes}:${paddedSeconds}`;
};

const padWithZeros = (number, length) => {
  let str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
};

export const errorDataExtractor = (error) => {
  return {
    trigger: errorTrigger(error),
    time: epochToDate(error.timestamp),
    trace: error.data.payload.trace,
  }
}

export const errorTrigger = (error) => {
  const triggerMatch = error.data.payload.trace[0].match(/^(.+) /)[1]
  return triggerMatch
}

export const traceDataExtractor = (traceElement) => {
  const functionCall = traceElement.match(/^(.+) /)[1]
  const link = traceElement.match(/\((.+)\)$/)[1]
  return {
    functionCall,
    link,
  }
}

export const line = (error) => {
  const errorLineMatch = error.data.payload.trace[0].match(/(\d+:\d+)\)$/)[1]
  return errorLineMatch
}

export const recentEventsFromError = (error, events) => {
  const MAX_EVENTS = 7;
  if (events.length <= MAX_EVENTS) return events;

  const errorIndex = events.findIndex(
    (event) =>
      event.timestamp === error.timestamp &&
      event.data.payload?.level === "error"
  );
  // If the error occurs at or after the 8th element, return the 7 events prior to the error
  if (errorIndex >= MAX_EVENTS) {
    return events.slice(errorIndex - MAX_EVENTS, errorIndex);
  }

  // If the error is found in the first 7 events, return only the events leading up to the error
  return events.slice(0, errorIndex);
};

export const originalViewport = (session) => {
  const viewport = session.events.find(e => e.data.width && e.data.height )

  return {
    width: viewport ? viewport.data.width : 0 ,
    height: viewport ? viewport.data.height : 0,
  }
}

export const getDeviceFromSize = (viewport) => {
  /*
    Based on well-established media queries:
    
    @media (min-width:320px)  => smartphones, iPhone, portrait 480x320 phones
    @media (min-width:481px)  => portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide.
    @media (min-width:641px)  => portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones
    @media (min-width:961px)  => tablet, landscape iPad, lo-res laptops ands desktops
    @media (min-width:1025px) => big landscape tablets, laptops, and desktops
    @media (min-width:1281px) => hi-res laptops and desktops
  */

  const width = viewport.width
  if (width === 0) return 'unknown'
  else if (width <= 480) return 'phone'
  else if (width <= 1025) return 'tablet'
  else return 'desktop'
}

export const eventAnalyzer = (event) => {
  const numberType = event.type
  const decodedType = eventReference.EventType[numberType]

  const isUserInteraction = decodedType === 'IncrementalSnapshot'
  
  const source = isUserInteraction ? 
    eventReference.IncrementalSource[event?.data?.source] :
    'N/A'

  const isMouseInteraction = source === 'MouseInteraction'

  const mouseInteraction = isMouseInteraction ? 
    eventReference.MouseInteractions[event?.data?.type] :
    'N/A'

  return {
    numberType,
    decodedType,
    isUserInteraction,
    source,
    isMouseInteraction,
    mouseInteraction,
  }
}

export const mouseEventType = ({source, mouseInteraction}) => {
  if (source === 'MouseMove') return source
  else return mouseInteraction
}

export const totalDuration = (session) => {
  return relativeTime(session.events[session.events.length - 1], session)
}


