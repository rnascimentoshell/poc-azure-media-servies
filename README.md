# Scenario
Autoplay a medium to large video on the landing page, technically the most accessed page in the website.

Constraints: HTTP 1.1 uses six TCP connection to fetch assets to the page, when you have a big asset to fetch, that request hold one connection for a long time, what affect your page loading time.

# Proposition
[Azure Media service](https://learn.microsoft.com/en-us/azure/media-services/latest/) allow us to [danymic package](https://learn.microsoft.com/en-us/azure/media-services/latest/encode-dynamic-packaging-concept) media, reducing the size of the it according to client connection speed, so we can stream the content instead of requesting a big file at once.

It also allow us to use a Content Delivery Network (CDN) to bring the content near to client and increasing the bandwidth reducing some other coasts.

You can read more about CDN integration in [Stream content with CDN integration](https://learn.microsoft.com/en-us/azure/media-services/latest/stream-scale-streaming-cdn-concept)

# Proof of Concept setps in Azure

1. [Create a Media Services account](https://learn.microsoft.com/en-us/azure/media-services/latest/account-create-how-to?tabs=portal)

2. [Upload your asset](https://learn.microsoft.com/en-us/azure/media-services/latest/asset-upload-media-how-to) usign the ***Assets*** options under ***Media Services*** group menu

3. Create a trasnform to encode media files to a compatible media format for streaming, in this case I am using
    - H264MultipleBitrate720p
      - Produces a set of 6 GOP-aligned MP4 files, ranging from 3400 kbps to 400 kpbs, and stereo AAC audio. Resolution starts at 720p and goes down to 360p.

    Go to ***Transforms + jobs*** under ***Media Services*** group menu and select ***+ Add trasnform*** and use the fallowing configurations

    - **Transform name:** stream_transfrom
    - **Transform type:** Encoding
    - **Built-in present name:** H264MultipleBitrate720p

4. Encode your media asset
Now if you go to ***Transforms + jobs*** under ***Media Services*** group menu, you can create a job to encode your media file clicking in ***+ Add Job*** 

    What is important here is to find the asset you just uploaded using the ***Select an existing asset*** option for ***Input asset name*** field, the other options you can keep the default value excepet by ***Transform*** for this option you must use the one you just create, in this poc we create ***stream_transfrom***

    After a while when you click create you will have the new asset with the encode format you need to stream the file.

5. Find your new asset whitin ***Assets*** under ***Media Services*** group menu and click on it.

    You will be presented to a screen where you have to select the ***Streaming endpoint***, you must have a default value, and a ***Streaming locator***.
    The [Streaming locator](https://learn.microsoft.com/en-us/azure/media-services/latest/stream-streaming-locators-concept) is the responsible to make videous in the output Asset availble to clients for playback. You can just click ***Create new*** and accepts all default values.

    If all went well you should have access to your video and two distinct playback urls:
    - Playback URL (DASH)
        - Default for andorid
    - Playback URL (HLS)
        - Default for IOS and android

    If you intend to have this video playing in boath smartphones operating systems, us HLS url to configure your player.
    Copy the prefered url to use when configuring your react player.

6. Configure CDN, moving to ***Streaming endpoints*** under ***Media Services*** group menu, at this point you should have only one item here called ***default***, click in this item you will have to click in ***stop*** to be able to configure the CDN option, confirm your action, and after a while under ***CDN*** you can enable it according to your needs, after that go to ***Audience reach estimation*** area and select the Egress source % from CDN cache that suits better your scenario. 

# React app

1. To create the app
    ``` node
    npx create-react-app my-app
    ```

2. install the [react-player](https://www.npmjs.com/package/react-player) package
    ``` node
    npm i react-player
    ```

3. Update your App.js
    ``` react
    import './App.css';
    import React from 'react'
    import ReactPlayer from 'react-player'

    function App() {
    return (
        <div className="App">
        Testing Player
        <ReactPlayer
            url='<URL_YOU_JUST_COPIED_FROM_PREVIOUS_STEPS>'
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

    ```