import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {clearAsyncStorage} from '../../asyncStorage';
import {LogOutUser, UpdateUser} from '../../network';
import {color, globalStyle} from '../../utility';
import firebase from '../../firebase/config';
import {LOADING_START, LOADING_STOP} from '../../context/actions/types';
import {smallDeviceHeight, uuid} from '../../utility/constants';
import {Profile, ShowUsers, StickyHeader} from '../../component';
import {Store} from '../../context/store';
import * as ImagePicker from 'react-native-image-picker';
import {deviceHeight} from '../../utility/styleHelper/appStyle';

export default Dashboard = ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;
  const [userDetail, setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: '',
  });

  const {name, profileImg} = userDetail;
  const [allUsers, setAllUsers] = useState([]);
  //sticky header state
  const [getScrollPosition, setScrollPosition] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SimpleLineIcon
          name="logout"
          size={26}
          color={color.WHITE}
          style={styles.customeHeaderStyle}
          onPress={() =>
            Alert.alert(
              'Logout',
              'Are you sure to log out',
              [
                {
                  text: 'Yes',
                  onPress: () => logout(),
                },
                {
                  text: 'No',
                },
              ],
              {
                cancelable: false,
              },
            )
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    dispatchLoaderAction({
      type: LOADING_START,
    });
    try {
      firebase
        .database()
        .ref('users')
        .on('value', (dataSnapShot) => {
          let users = [];
          let currentUser = {
            id: '',
            name: '',
            profileImg: '',
          };
          dataSnapShot.forEach((child) => {
            if (uuid === child.val().uuid) {
              currentUser.id = child.val().uuid;
              currentUser.name = child.val().name;
              currentUser.profileImg = child.val().profileImg;
            } else {
              users.push({
                id: child.val().uuid,
                name: child.val().name,
                profileImg: child.val().profileImg,
              });
            }
          });
          setAllUsers(users);
          setUserDetail(currentUser);

          dispatchLoaderAction({
            type: LOADING_STOP,
          });
        });
    } catch (error) {
      dispatchLoaderAction({
        type: LOADING_STOP,
      });
      alert(error);
    }
  }, []);

  const selectPhotoTapped = () => {
    const option = {
      title: 'Pick an image',
      noData: true,
      mediaType: 'photo',
      includeBase64: true,
    };
    ImagePicker.launchImageLibrary(option, (response) => {
      if (response.didCancel) {
        console.log('User response image picker : ', response);
      } else if (response.error) {
        console.log('image picker error : ', response);
      } else {
        //Base 64
        let source = 'data:image/jpeg;base64,' + response.base64;
        //let source = {uri: 'data:image/jpeg;base64,' + response.base64};
        //console.log('Success case source response : ', source);
        dispatchLoaderAction({
          type: LOADING_START,
        });
        UpdateUser(uuid, source)
          .then(() => {
            //console.log('inside showImagePicker source: ', source);
            setUserDetail({
              ...userDetail,
              profileImg: source,
            });
            console.log('User Details profile Immage : ', userDetail);
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
          })
          .catch((err) => {
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            alert(err);
          });
      }
    });
  };

  // * logout
  const logout = () => {
    LogOutUser()
      .then(() => {
        clearAsyncStorage()
          .then(() => {
            navigation.replace('Login');
          })
          .catch((err) => alert(err));
      })
      .catch((err) => alert(err));
  };

  // * on Image Tap
  const imgTap = (profileImg, name) => {
    if (!profileImg) {
      navigation.navigate('ShowFullImg', {name, imgText: name.charAt(0)});
    } else {
      navigation.navigate('ShowFullImg', {name, img: profileImg});
    }
  };

  //* ON Name Tap

  const nameTap = (profileImg, name, guestUserId) => {
    if (!profileImg) {
      navigation.navigate('Chat', {
        name,
        imgText: name.charAt(0),
        guestUserId,
        currentUserId: uuid,
      });
    } else {
      navigation.navigate('Chat', {
        name,
        img: profileImg,
        guestUserId,
        currentUserId: uuid,
      });
    }
  };

  // Get OPACITY
  const getOpacity = () => {
    if (deviceHeight < smallDeviceHeight) {
      return deviceHeight / 4;
    } else {
      return deviceHeight / 6;
    }
  };

  return (
    <SafeAreaView style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
      {getScrollPosition > getOpacity() && (
        <StickyHeader
          name={name}
          img={profileImg}
          onImgTap={() => imgTap(profileImg, name)}
        />
      )}

      <FlatList
        alwaysBounceVertical={false}
        data={allUsers}
        onScroll={(event) =>
          setScrollPosition(event.nativeEvent.contentOffset.y)
        }
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={
          <View
            style={{
              opacity:
                getScrollPosition < getOpacity()
                  ? (getOpacity() - getScrollPosition) / 100
                  : 0,
            }}>
            <Profile
              img={profileImg}
              name={name}
              onEditImgTap={() => selectPhotoTapped()}
              onImgTap={() => imgTap(profileImg, name)}
            />
          </View>
        }
        renderItem={({item}) => (
          <ShowUsers
            name={item.name}
            img={item.profileImg}
            onImgTap={() => imgTap(item.profileImg, item.name)}
            onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 23,
  },
  customeHeaderStyle: {
    right: 10,
  },
});
