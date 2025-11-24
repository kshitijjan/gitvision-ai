// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtOuskoKYJRYFpueRlJ03om7K3E9q6W7k",
  authDomain: "gitvision-ai.firebaseapp.com",
  projectId: "gitvision-ai",
  storageBucket: "gitvision-ai.firebasestorage.app",
  messagingSenderId: "619440317856",
  appId: "1:619440317856:web:5201bdcb5229bf4639b0c5",
  measurementId: "G-7LGC3JWX4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);

export async function uploadFile(file: File, setProgress?: (progress: number) => void){
    return new Promise((resolve, reject) => {
        try{
            const storageRef = ref(storage, file.name)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on('state_changed', snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                if(setProgress){
                    setProgress(progress)
                }
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused'); break;
                    case 'running':
                        console.log('Upload is running'); break;
                }
            }, error => {
                reject(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                });
            })
        }
        catch(error){
            console.error(error)
            reject(error)
        }
    })
}