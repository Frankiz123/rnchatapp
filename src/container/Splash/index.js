import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {getAsyncStorage, keys} from '../../asyncStorage';
import {Logo} from '../../component';
import {color, globalStyle} from '../../utility';
import {setUniqueValue} from '../../utility/constants';

const Splash = ({navigation}) => {
  useEffect(() => {
    const redirect = setTimeout(() => {
      getAsyncStorage(keys.uuid)
        .then((uuid) => {
          if (uuid) {
            console.log('The Value of UUid : ', uuid);
            setUniqueValue(uuid);
            navigation.replace('Dashboard');
          } else {
            console.log('The Value of UUid : ', uuid);
            navigation.replace('Login');
          }
        })
        .catch((err) => {
          console.log(err);
          navigation.navigate('Login');
        });
    }, 3000);
    //Unmount the settimeoutfunction
    return () => clearTimeout(redirect);
  }, [navigation]);
  return (
    <View
      style={[globalStyle.containerCentered, {backgroundColor: color.BLACK}]}>
      <Logo />
    </View>
  );
};

export default Splash;
