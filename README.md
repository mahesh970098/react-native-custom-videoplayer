# react-native-custom-videoplayer
react-native-videocustomplayer

A <Video> component for react-native

image
Installation
Using npm:

npm i --save react-native-video react-native-sliders react-native-orientation-locker react-native-videocustomplayer
or using yarn:

yarn add react-native-video react-native-sliders react-native-orientation-locker react-native-videocustomplayer
After install this Package


Usage
// Load the module
import { StyleSheet, Text, View ,Dimensions} from 'react-native'
import React from 'react'
import VideoPlayer from "react-native-videocustomplayer";

const App = () => {
  return (
    <View>
 <VideoPlayer
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height *0.95,
          marginTop: Platform.OS == "ios" ? 50 : 0,
        }}
        source={{
          uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        }}
        poster="https://miro.medium.com/v2/resize:fit:621/1*OrZ-Dsh1BfkhNO9G0sD69w.png"
        title="Mahesh Alakunta Player"
        autoPlay={false}
        playInBackground={false}
        showSeeking10SecondsButton={true}
        showHeader={true}
        showFullScreenButton={true}
        showSettingButton={true}
        showMuteButton={true}
      />
    </View>
  )
}

export default App
