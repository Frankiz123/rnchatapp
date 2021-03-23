import React, {useContext, useState} from 'react';
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
import {keys, setAsyncStorage} from '../../asyncStorage';
import {InputField, Logo, RoundCornerButton} from '../../component';
import {LOADING_START, LOADING_STOP} from '../../context/actions/types';
import {Store} from '../../context/store';
import {LoginRequest} from '../../network';
import {globalStyle, color} from '../../utility';
import {keyboardVerticalOffset, setUniqueValue} from '../../utility/constants';

export default Login = ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;
  const [showLogo, toggleLogo] = useState(true);
  // Create State for email and password
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const {email, password} = credentials;

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

  const onLoginProcess = () => {
    if (!email) {
      alert('Email is Required');
    } else if (!password) {
      alert('Password is Required');
    } else {
      dispatchLoaderAction({
        type: LOADING_START,
      });
      LoginRequest(email, password)
        .then((res) => {
          if (!res.additionalUserInfo) {
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            alert(res);
            return;
          }
          setAsyncStorage(keys.uuid, res.user.uid);
          setUniqueValue(res.user.uuid);
          console.log('response UUID : ', res.user.uid);
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          navigation.replace('Dashboard');
        })
        .catch((err) => alert(err));
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
              placeholder="Enter Your Email."
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
              placeholder="Enter Your Password"
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
            <RoundCornerButton title="Login" onPress={() => onLoginProcess()} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: color.LIGHT_GREEN,
              }}
              onPress={() => navigation.navigate('SignUp')}>
              Sign Up
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
