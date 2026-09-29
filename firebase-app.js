
// KLGA Firebase configuration
// 1) Firebase Console -> Project settings -> Your apps -> Web app
// 2) Copy the firebaseConfig values below.
// 3) Enable Firestore Database in Firebase Console.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT.firebasestorage.app",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

const configured =
  firebaseConfig.apiKey !== "PASTE_API_KEY_HERE" &&
  firebaseConfig.projectId !== "PASTE_PROJECT_ID";

let db=null;

if(configured){
  const app=initializeApp(firebaseConfig);
  db=getFirestore(app);
}

async function getCollection(name){
  if(!db) return [];
  const snap=await getDocs(collection(db,name));
  return snap.docs.map(d=>({key:d.id,...d.data()}));
}

window.KLGAFirebase={
  ready:configured,

  async getRoster(){
    return await getCollection("students");
  },

  async saveStudent(student){
    if(!db) return;
    await setDoc(doc(db,"students",student.key),student,{merge:true});
  },

  async deleteStudent(key){
    if(!db) return;
    await deleteDoc(doc(db,"students",key));
  },

  async getSessions(){
    return await getCollection("sessions");
  },

  async saveSession(session){
    if(!db) return;
    await setDoc(doc(db,"sessions",session.key),{
      ...session,
      updatedAt:serverTimestamp()
    },{merge:true});
  },

  async deleteSession(key){
    if(!db) return;
    await deleteDoc(doc(db,"sessions",key));
  },

  async saveResult(result){
    if(!db) return;
    const id="result_"+Date.now()+"_"+Math.random().toString(36).slice(2,8);
    await setDoc(doc(db,"results",id),{
      ...result,
      createdAt:serverTimestamp()
    });
  },

  async findActiveSession(name,password){
    if(!db) return null;
    const q=query(
      collection(db,"sessions"),
      where("name","==",name),
      where("password","==",password),
      where("status","==","Active")
    );
    const snap=await getDocs(q);
    if(snap.empty) return null;
    const d=snap.docs[0];
    return {key:d.id,...d.data()};
  },

  async setStudentStatus(sessionKey,studentKey,status){
    if(!db) return;
    const ref=doc(db,"sessions",sessionKey);
    await setDoc(
      doc(db,"sessionStudents",sessionKey+"_"+studentKey),
      {
        sessionKey,
        studentKey,
        status,
        updatedAt:serverTimestamp()
      },
      {merge:true}
    );
  }
};
