import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
  Alert,
  SafeAreaView
} from 'react-native';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
//   import CustomVideoPlayer from 'react-native-custom-video-player';
import CustomVideoPlayer from './Customplayer';
const Home_videoplay = () => {
  return (


          <CustomVideoPlayer
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height *0.95,
              marginTop: Platform.OS == 'ios' ? 50 : 0,
            }}
            source={{
              uri:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            }}
            poster="https://cdn.marvel.com/content/1x/023rra_ons_mas_mob_08.jpg"
            title="Mahesh Alakunta "
            autoPlay={true}
            playInBackground={false}
            showSeeking10SecondsButton={true}
            showHeader={true}
            showFullScreenButton={true}
            showSettingButton={true}
            showMuteButton={true}
          />

  );
};

export default Home_videoplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  backgroundVideo: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  
});
