import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import {InputField, Logo, RoundCornerButton} from '../../component';
import {Store} from '../../context/store';
import {globalStyle, color} from '../../utility';
import {LOADING_START, LOADING_STOP} from '../../context/actions/types';
import {SignUpRequest, AddUser} from '../../network/index';
import {keys, setAsyncStorage} from '../../asyncStorage';
import {keyboardVerticalOffset, setUniqueValue} from '../../utility/constants';
import firebase from '../../firebase/config';

export default SignUp = ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;
  const [showLogo, toggleLogo] = useState(true);
  // Create State for email and password
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
  });
  const {name, email, password, confirmpassword} = credentials;

  //OnchangeHandle function

  const handleOnChange = (name, value) => {
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  //* on focus input
  const handleFocus = () => {
    setTimeout(() => {
      toggleLogo(false);
    }, 200);
  };
  //* on blur input
  const handleBlur = () => {
    setTimeout(() => {
      toggleLogo(true);
    }, 200);
  };

  const onSignUpProcess = () => {
    if (!name) {
      alert('Name is Required');
    } else if (!email) {
      alert('Email is Required');
    } else if (!password) {
      alert('Password is Required');
    } else if (password !== confirmpassword) {
      alert('Password did not match');
    } else {
      dispatchLoaderAction({
        type: LOADING_START,
      });
      SignUpRequest(email, password)
        .then((res) => {
          if (!res.additionalUserInfo) {
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            alert(res);
            return;
          }
          let uuid = firebase.auth().currentUser.uid;
          let profileImg = '';
          AddUser(name, email, uuid, profileImg)
            .then(() => {
              setAsyncStorage(keys.uuid.uuid);
              setUniqueValue(uuid);
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
              navigation.replace('Dashboard');
            })
            .catch((err) => {
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
              alert(err);
            });
        })
        .catch((err) => {
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          alert(err);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
          {showLogo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )}
          <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
            <InputField
              placeholder="Enter Name."
              value={name}
              onChangeText={(text) => handleOnChange('name', text)}
              onFocus={() => {
                handleFocus();
              }}
              onBlur={() => {
                handleBlur();
              }}
            />
            <InputField
              placeholder="Enter Email."
              value={email}
              onChangeText={(text) => handleOnChange('email', text)}
              onFocus={() => {
                handleFocus();
              }}
              onBlur={() => {
                handleBlur();
              }}
            />
            <InputField
              placeholder="Enter Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => handleOnChange('password', text)}
              onFocus={() => {
                handleFocus();
              }}
              onBlur={() => {
                handleBlur();
              }}
            />
            <InputField
              placeholder="Confirm Password"
              secureTextEntry={true}
              value={confirmpassword}
              onChangeText={(text) => handleOnChange('confirmpassword', text)}
              onFocus={() => {
                handleFocus();
              }}
              onBlur={() => {
                handleBlur();
              }}
            />
            <RoundCornerButton
              title="Sign Up"
              onPress={() => onSignUpProcess()}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: color.LIGHT_GREEN,
              }}
              onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 23,
  },
});
