import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AppState,
  Dimensions,
  StatusBar,
  BackHandler,
  Image,
  FlatList,
} from "react-native";
import Video from "react-native-video";
import Slider from "react-native-sliders";
import Orientation from "react-native-orientation-locker";

const CustomVideoPlayer = (props) => {
  const {
    style = {},
    source,
    poster,
    title = "",
    autoPlay = false,
    playInBackground = false,
    showSeeking10SecondsButton = true,
    showHeader = true,
    showFullScreenButton = true,
    showSettingButton = true,
    showMuteButton = true,
  } = props;

  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(true);

  const [isShowSettingsBottomSheet, setIsShowSettingsBottomSheet] =
    useState(false);
  const [isShowVideoQualitiesSettings, setIsShowVideoQualitiesSettings] =
    useState(false);
  const [isShowVideoSpeedSettings, setIsShowVideoSpeedSettings] =
    useState(false);
  const [isShowVideoSoundSettings, setIsShowVideoSoundSettings] =
    useState(false);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const [isErrorInLoadVideo, setIsVErrorInLoadVideo] = useState(false);
  const [isVideoEnd, setIsVideoEnd] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoQuality, setVideoQuality] = useState(0);
  const [videoSound, setVideoSound] = useState(1.0);
  const [currentVideoDuration, setCurrentVideoDuration] = useState(0);
  const [videoRate, setVideoRate] = useState(1);
  const [dimension, setDimension] = useState(Dimensions.get("window"));
  const [QUALITYDATA, setQUALITYDATA] = useState([]);

  const portraitStyle = {
    alignSelf: "center",
    height: 200,
    width: 330,
    ...style,
  };
  const landScapeStyle = {
    alignSelf: "center",
    height: dimension.height,
    width: dimension.width,
  };
  const videoStyle = isVideoFullScreen ? landScapeStyle : portraitStyle;

  useEffect(() => {
    const dimensionSubscriber = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimension(window);
        setIsVideoFullScreen(window.width > window.height ? true : false);
      }
    );

    const backHandlerSubscriber = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isVideoFullScreen) {
          Orientation.lockToPortrait();
          StatusBar.setHidden(false);
          return true;
        } else {
          return false;
        }
      }
    );

    return () => {
      dimensionSubscriber.remove();
      backHandlerSubscriber.remove();
    };
  }, [isVideoFullScreen]);

  useEffect(() => {
    const appStateSubscriber = AppState.addEventListener("change", (state) => {
      if (playInBackground && isPaused == false) {
        setIsPaused(false);
      } else {
        setIsPaused(true);
      }
    });

    return () => {
      appStateSubscriber.remove();
    };
  }, [isPaused]);

  const videoHeaders = () => (
    <View
      style={{
        paddingHorizontal: 10,
        width: videoStyle.width,
        height: 45,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0 ,0, 0,0.5)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100000,
      }}
    >
      <Text
        numberOfLines={1}
        style={{ color: "white", fontSize: 12, width: videoStyle.width - 170 }}
      >
        {title}
      </Text>
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          padding:10
        }}
      >
        {showSettingButton && (
          <TouchableOpacity
            onPress={() => {
              setIsShowSettingsBottomSheet(true);
              setIsVideoFocused(false);
            }}
          >
            <Image
              source={require("./assets/images/setting.png")}
              style={{ width: 18, height: 18 }}
            />
          </TouchableOpacity>
        )}

        {showMuteButton && (
          <TouchableOpacity
            onPress={() => {
              setIsMuted(!isMuted);
              if (isMuted && videoSound == 0) {
                setVideoSound(1.0);
              }
              setTimeout(() => {
                setIsVideoFocused(false);
              }, 800);
            }}
            style={{ marginRight: 30 }}
          >
            <Image
              source={
                isMuted
                  ? require("./assets/images/volume-mute.png")
                  : require("./assets/images/volume.png")
              }
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const videoCenter = () => (
    <View
      style={{
        width: videoStyle.width,
        height: 35,
        position: "absolute",
        top: videoStyle.height / 2 - 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: videoStyle.width / 5,
        zIndex: 100000,
      }}
    >
      <TouchableOpacity
        onPress={() => videoRef.current.seek(currentVideoDuration - 10)}
      >
        <Image
          source={require("./assets/images/ba.png")}
          style={{ width: 25, height: 25 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (isVideoEnd) {
            videoRef.current.seek(0);
            setIsVideoEnd(false);
            setCurrentVideoDuration(0);
            setIsPaused(false);
            setTimeout(() => {
              setIsVideoFocused(false);
            }, 800);
          } else {
            setIsPaused(!isPaused);
            setTimeout(() => {
              setIsVideoFocused(false);
            }, 800);
          }
        }}
      >
        <Image
          source={
            isPaused
              ? require("./assets/images/play2.png")
              : require("./assets/images/pause1.png")
          }
          style={{ width: 27, height: 27 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => videoRef.current.seek(currentVideoDuration + 10)}
      >
        <Image
          source={require("./assets/images/for.png")}
          style={{ width: 25, height: 25 }}
        />
      </TouchableOpacity>
    </View>
  );

  const videoFooter = () => (
    <View
      style={{
        paddingHorizontal: 10,
        width: videoStyle.width,
        height: 35,
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0 ,0, 0,0.5)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100000,
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>
        {new Date(currentVideoDuration * 1000).toISOString().substr(14, 5)}
      </Text>

      <Slider
        //disabled={isRecordBeforePlay}
        maximumValue={videoDuration}
        minimumValue={0}
        minimumTrackTintColor="white"
        maximumTrackTintColor="gray"
        thumbTintColor="white"
        thumbStyle={{ height: 12, width: 12 }}
        trackStyle={{ height: 1.8, width: videoStyle.width - 140 }}
        useNativeDriver
        value={currentVideoDuration}
        onSlidingComplete={(sliderData) => {
          setCurrentVideoDuration(sliderData[0]);
          videoRef.current.seek(sliderData[0]);
        }}
      />

      <Text style={{ color: "white", fontSize: 12 }}>
        {new Date(videoDuration * 1000).toISOString().substr(14, 5)}
      </Text>

      {showFullScreenButton && (
        <TouchableOpacity
          onPress={() => {
            if (isVideoFullScreen) {
              StatusBar.setHidden(false);
              Orientation.lockToPortrait();
            } else {
              StatusBar.setHidden(true);
              Orientation.lockToLandscapeLeft();
            }
            setIsVideoFocused(false);
          }}
        >
          <Image
            source={
              isVideoFullScreen
                ? require("./assets/images/full.png")
                : require("./assets/images/full.png")
            }
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const videoSettingsView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0 ,0, 0,0.9)",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100000,
          ...videoStyle,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowSettingsBottomSheet(false);
          }}
        >
          <Image
            source={require("./assets/images/cross.png")}
            style={{ width: 20, height: 22 }}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 170,
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute",
            top: videoStyle.height / 6,
          }}
        >
          {/* <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setIsShowVideoQualitiesSettings(true);
              setIsShowVideoSpeedSettings(false);
              setIsShowVideoSoundSettings(false);
            }}
          >
            <Image
              source={require("./assets/images/hd.png")}
              style={{ width: 26, height: 27 }}
            />
            <Text style={{ color: "white", fontSize: 13 }}>Quality</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setIsShowVideoQualitiesSettings(false);
              setIsShowVideoSpeedSettings(true);
              setIsShowVideoSoundSettings(false);
            }}
          >
            <Image
              source={require("./assets/images/speed.png")}//speed
              style={{ width: 20, height: 25 }}
            />
            <Text style={{ color: "white", fontSize: 13 }}>Speed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setIsShowVideoQualitiesSettings(false);
              setIsShowVideoSpeedSettings(false);
              setIsShowVideoSoundSettings(true);
            }}
          >
            <Image
              source={require("./assets/images/volume.png")}//soundmix
              style={{ width: 20, height: 22 }}
            />
            <Text style={{ color: "white", fontSize: 13 }}>Sound</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            justifyContent: "center",
            position: "absolute",
            top: videoStyle.height / 2.5,
          }}
        >
          {isShowVideoQualitiesSettings ? (
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: 260,
                  borderWidth: 0,
                  borderColor: "red",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* {console.log(QUALITYDATA)} */}
                {QUALITYDATA != 0 && (
                  <FlatList
                    data={QUALITYDATA}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 60,
                            height: 25,
                            borderWidth: 1,
                            borderColor: "white",
                            borderRadius: 4,
                            marginHorizontal: 5,
                            marginVertical: 4,
                          }}
                          onPress={() => {
                            setVideoQuality(item.height);
                            setIsShowSettingsBottomSheet(false);
                          }}
                        >
                          {videoQuality == item.height && (
                            <Image
                              source={require("./assets/images/full.png")}//dot
                              style={{ width: 10, height: 10 }}
                            />
                          )}
                          <Text
                            style={{
                              color: "white",
                              fontSize: 13,
                              marginLeft: videoQuality == item.height ? 3 : 0,
                            }}
                          >
                            {item.height}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => item.trackId.toString()}
                    numColumns={3}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          ) : isShowVideoSpeedSettings ? (
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: 260,
                  borderWidth: 0,
                  borderColor: "red",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 25,
                    borderWidth: 1,
                    borderColor: "white",
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    setVideoRate(0.5);
                    setIsShowSettingsBottomSheet(false);
                  }}
                >
                  {videoRate == 0.5 && (
                    <Image
                      source={require("./assets/images/full.png")}//dot
                      style={{ width: 10, height: 10 }}
                    />
                  )}
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      marginLeft: videoRate == 0.5 ? 3 : 0,
                    }}
                  >
                    Slow
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 25,
                    borderWidth: 1,
                    borderColor: "white",
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    setVideoRate(1);
                    setIsShowSettingsBottomSheet(false);
                  }}
                >
                  {videoRate == 1 && (
                    <Image
                      source={require("./assets/images/full.png")}//dot
                      style={{ width: 10, height: 10 }}
                    />
                  )}
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      marginLeft: videoRate == 1 ? 3 : 0,
                    }}
                  >
                    Normal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 25,
                    borderWidth: 1,
                    borderColor: "white",
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    setVideoRate(4);
                    setIsShowSettingsBottomSheet(false);
                  }}
                >
                  {videoRate == 4 && (
                    <Image
                      source={require("./assets/images/full.png")}//dot
                      style={{ width: 10, height: 10 }}
                    />
                  )}
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      marginLeft: videoRate == 4 ? 3 : 0,
                    }}
                  >
                    Fast
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          ) : isShowVideoSoundSettings ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Slider
                //disabled={isRecordBeforePlay}
                maximumValue={10}
                minimumValue={0}
                step={0.1}
                minimumTrackTintColor="white"
                maximumTrackTintColor="gray"
                thumbTintColor="white"
                thumbStyle={{ height: 12, width: 12 }}
                trackStyle={{ height: 1.8, width: videoStyle.width - 130 }}
                useNativeDriver
                value={videoSound}
                onSlidingComplete={(sliderData) => {
                  setVideoSound(Number(sliderData[0].toFixed(1)));
                  if (sliderData[0] == 0) {
                    setIsMuted(true);
                  } else {
                    setIsMuted(false);
                  }
                }}
              />

              <Text style={{ color: "white" }}>{videoSound}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoPosterView = () => (
    <Image
      source={{
        uri: poster,
      }}
      style={{
        height: videoStyle.height,
        width: videoStyle.width,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0 ,0, 0,0.5)",
      }}
    />
  );

  const videoErrorView = () => (
    <View
      style={{
        height: videoStyle.height,
        width: videoStyle.width,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0 ,0, 0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("./assets/images/full.png")}//error
        style={{ width: 30, height: 30 }}
      />
      <Text style={{ color: "white", fontSize: 12, marginTop: 0 }}>
        Error when load video
      </Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsVideoFocused(!isVideoFocused);
      }}
    >
      <View style={videoStyle}>
        <Video
          style={{ flex: 1 }}
          posterResizeMode="cover"
          resizeMode="cover"
          ref={videoRef}
          source={source}
          paused={isPaused}
          muted={isMuted}
          rate={videoRate}
          selectedVideoTrack={{
            type: "resolution",
            value: videoQuality,
          }}
          volume={videoSound}
          playInBackground={playInBackground}
          onLoad={(videoData) => {
            setQUALITYDATA(videoData.videoTracks);
            // setVideoQuality(videoData.videoTracks[0].height);
            setVideoDuration(videoData.duration);
            setIsVErrorInLoadVideo(false);
          }}
          onProgress={(videoData) =>
            setCurrentVideoDuration(videoData.currentTime)
          }
          onError={(videoData) => setIsVErrorInLoadVideo(true)}
          onEnd={() => {
            setIsVideoEnd(true);
            setIsPaused(true);
            setIsVideoFocused(true);
            setCurrentVideoDuration(0);
          }}
        />

        {isVideoFocused && showHeader && videoHeaders()}
        {isVideoFocused &&
          showSeeking10SecondsButton &&
          !isErrorInLoadVideo &&
          videoCenter()}
        {isVideoFocused && videoFooter()}

        {isShowSettingsBottomSheet && videoSettingsView()}

        {currentVideoDuration == 0 && poster && videoPosterView()}
        {isErrorInLoadVideo && videoErrorView()}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomVideoPlayer;
