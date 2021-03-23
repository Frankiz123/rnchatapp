import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import {ChatBox, InputField} from '../../component';
import {appStyle, color, globalStyle} from '../../utility';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import firebase from '../../firebase/config';
import * as ImagePicker from 'react-native-image-picker';
import {recieverMsg, senderMsg} from '../../network';
import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {smallDeviceHeight} from '../../utility/constants';

const Chat = ({route, navigation}) => {
  const {params} = route;
  const {name, img, imgText, guestUserId, currentUserId} = params;
  console.log(
    `Values of CurrentUserId :  ${currentUserId} Value of UserId: ${guestUserId}`,
  );
  const [msgValue, setMsgValue] = useState('');
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: <Text>{name}</Text>,
    });
  }, [navigation]);

  useEffect(() => {
    try {
      firebase
        .database()
        .ref('messeges')
        .child(currentUserId)
        .child(guestUserId)
        .on('value', (dataSnapshot) => {
          let msgs = [];
          dataSnapshot.forEach((child) => {
            msgs.push({
              sendBy: child.val().messege.sender,
              recievedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              img: child.val().messege.img,
            });
          });
          setMessages(msgs);
        });
    } catch (error) {
      alert(error);
    }
  }, []);

  const handleChamera = () => {
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

        senderMsg(msgValue, currentUserId, guestUserId, source)
          .then(() => {})
          .catch((err) => alert(err));
        //* guest user

        recieverMsg(msgValue, currentUserId, guestUserId, source)
          .then(() => {})
          .catch((err) => alert(err));
      }
    });
  };

  // * handeCOnChange
  const handleOnChange = (text) => {
    setMsgValue(text);
  };

  // * On Tap Img
  const imgTap = (chatImg) => {
    navigation.navigate('ShowFullImg', {name, img: chatImg});
  };

  //* hanlde Send
  const handleSend = () => {
    setMsgValue('');
    if (msgValue) {
      senderMsg(msgValue, currentUserId, guestUserId, '')
        .then(() => {})
        .catch((err) => alert(err));
      //* guest user

      recieverMsg(msgValue, currentUserId, guestUserId, '')
        .then(() => {})
        .catch((err) => alert(err));
    }
  };

  return (
    <SafeAreaView style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 70}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
        <TouchableWithoutFeedback
          style={[globalStyle.flex1]}
          onPress={Keyboard.dismiss}>
          <Fragment>
            <FlatList
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item}) => (
                <ChatBox
                  msg={item.msg}
                  userId={item.sendBy}
                  img={item.img}
                  onImgTap={() => imgTap(item.img)}
                />
              )}
            />
            {/* Send Message */}
            <View style={[styles.sendMessageContainer]}>
              <InputField
                placeholder="Type Here"
                numberOfLines={10}
                inputStyle={styles.input}
                onChangeText={(text) => handleOnChange(text)}
                value={msgValue}
              />
              <View style={styles.sendBtnContainer}>
                <MaterialCommunityIcons
                  name="camera"
                  color={color.WHITE}
                  size={appStyle.fieldHeight}
                  onPress={() => handleChamera()}
                />
                <MaterialCommunityIcons
                  name="send-circle"
                  color={color.WHITE}
                  size={appStyle.fieldHeight}
                  onPress={() => handleSend()}
                />
              </View>
            </View>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
