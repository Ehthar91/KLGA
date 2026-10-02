
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
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBRdCZ6-kst-fRR9TW633hw6BTwAVS2osA",
  authDomain: "kgla-32aef.firebaseapp.com",
  projectId: "kgla-32aef",
  storageBucket: "kgla-32aef.firebasestorage.app",
  messagingSenderId: "673924203306",
  appId: "1:673924203306:web:fa1ce5c55bcf17f6e3d453",
  measurementId: "G-ZCRPG19P8B"
};

const configured = true;

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
    await setDoc(
      doc(db,"sessionStudents",sessionKey+"_"+studentKey),
      { sessionKey, studentKey, status, updatedAt:serverTimestamp() },
      {merge:true}
    );
  },

  subscribeStudentStatus(sessionKey,studentKey,callback){
    if(!db) return ()=>{};
    return onSnapshot(
      doc(db,"sessionStudents",sessionKey+"_"+studentKey),
      snap=>callback(snap.exists()?{key:snap.id,...snap.data()}:null),
      err=>console.error("Student status listener failed:",err)
    );
  },

  subscribeSessionStudents(sessionKey,callback){
    if(!db) return ()=>{};
    const q=query(collection(db,"sessionStudents"),where("sessionKey","==",sessionKey));
    return onSnapshot(
      q,
      snap=>callback(snap.docs.map(d=>({key:d.id,...d.data()}))),
      err=>console.error("Session monitor listener failed:",err)
    );
  },

  async getResults(){
    return await getCollection("results");
  },

  subscribeResults(callback){
    if(!db) return ()=>{};
    return onSnapshot(
      collection(db,"results"),
      snap=>callback(snap.docs.map(d=>({key:d.id,...d.data()}))),
      err=>console.error("Results listener failed:",err)
    );
  },

  async clearResults(){
    if(!db) return;
    const snap=await getDocs(collection(db,"results"));
    await Promise.all(snap.docs.map(d=>deleteDoc(d.ref)));
  }
};


// Notify the main app that Firebase initialization has completed.
window.dispatchEvent(new CustomEvent('klga-firebase-ready', {
  detail: { ready: configured }
}));
