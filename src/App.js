import './App.css';
import React from 'react'
import ReactPlayer from 'react-player'

function App() {
  return (
    <div className="App">
      Testing Player
      <ReactPlayer
        url='https://b2ciomediasvcdev-euwe.streaming.media.azure.net/7c3bcd3d-4604-496d-81d9-c66e09373553/Landingpage_Header.ism/manifest(format=m3u8-cmaf)'        
        muted={true} //As of Chrome 66, videos must be muted in order to play automatically.
        playing={true}
        loop={true}
        pip={false}
        config={{
          file: {
            forceHLS: true
          }
        }}
      />
    </div>
  );
}

export default App;
