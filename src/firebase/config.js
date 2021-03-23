import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBf2nQadjFOGfYOofNSELPrWS-3OWBYttY',
  databaseURL: 'https://rnchatapp-9c1ba-default-rtdb.firebaseio.com/',
  projectId: 'rnchatapp-9c1ba',
  appId: '1:203167249266:android:831666b279fd76c1e223eb',
};

export default firebase.default.initializeApp(firebaseConfig);
