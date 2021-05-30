import * as firebase from "firebase"
import "@firebase/firestore"

const firebaseConfig = {
    // config
};

export const firebaseApp = firebase.initializeApp(firebaseConfig)
// firebaseApp.analytics()

// export const firestore = firebaseApp.firestore()
// export const authentication = firebaseApp.auth()