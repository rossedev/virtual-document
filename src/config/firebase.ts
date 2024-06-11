import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBp777wkqSTxRK5OYXLnqQBGiQeZArhm5A',
  authDomain: 'files-b96f0.firebaseapp.com',
  projectId: 'files-b96f0',
  storageBucket: 'files-b96f0.appspot.com',
  messagingSenderId: '988145332628',
  appId: '1:988145332628:web:04538ae28a7336678f1f81'
}

export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
