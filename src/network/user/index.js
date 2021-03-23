import firebase from '../../firebase/config';

export const AddUser = async (name, email, uuid, profileImg) => {
  try {
    return await firebase
      .database()
      .ref('users/' + uuid)
      .set({
        name: name,
        email: email,
        uuid: uuid,
        profileImg: profileImg,
      });
  } catch (error) {
    return error;
  }
};

export const UpdateUser = async (uuid, imgSource) => {
  try {
    return await firebase
      .database()
      .ref('users/' + uuid)
      .update({
        profileImg: imgSource,
      });
  } catch (error) {
    return error;
  }
};
