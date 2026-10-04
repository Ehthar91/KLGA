
// KLGA Firebase configuration
// 1) Firebase Console -> Project settings -> Your apps -> Web app
// 2) Copy the firebaseConfig values below.
// 3) Enable Firestore Database in Firebase Console.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
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
let auth=null;

if(configured){
  const app=initializeApp(firebaseConfig);
  db=getFirestore(app);
  auth=getAuth(app);
}

async function getCollection(name){
  if(!db) return [];
  const snap=await getDocs(collection(db,name));
  return snap.docs.map(d=>({key:d.id,...d.data()}));
}


function providerIdForUser(user){
  if(!user) return null;
  if(user.isAnonymous) return "anonymous";
  return user.providerData?.[0]?.providerId || null;
}

async function teacherAuthorization(user){
  if(!db || !user || user.isAnonymous) return false;
  const provider=providerIdForUser(user);
  if(provider!=="google.com") return false;
  const snap=await getDoc(doc(db,"teachers",user.uid));
  return snap.exists();
}

window.KLGAFirebase={
  ready:configured,

  currentUser(){
    return auth?.currentUser || null;
  },

  onAuth(callback){
    if(!auth) return ()=>{};
    return onAuthStateChanged(auth,callback);
  },

  async signInTeacher(){
    if(!auth) throw new Error("Firebase Auth is not available.");
    const provider=new GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    const result=await signInWithPopup(auth,provider);
    const authorized=await teacherAuthorization(result.user);
    return {user:result.user,authorized};
  },

  async isAuthorizedTeacher(){
    return await teacherAuthorization(auth?.currentUser || null);
  },

  async ensureStudentAuth(){
    if(!auth) throw new Error("Firebase Auth is not available.");
    if(auth.currentUser) return auth.currentUser;
    const result=await signInAnonymously(auth);
    return result.user;
  },

  async signOut(){
    if(auth) await signOut(auth);
  },

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
    const user=auth?.currentUser || null;
    await setDoc(doc(db,"results",id),{
      ...result,
      authUid:user?.uid || null,
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
    const user=auth?.currentUser || null;
    const payload={ sessionKey, studentKey, status, updatedAt:serverTimestamp() };
    if(user?.isAnonymous) payload.authUid=user.uid;

    // Teacher approval clears any old per-student stop/terminate command
    // so the newly approved attempt does not immediately stop again.
    if(status==="approved" && user && !user.isAnonymous){
      payload.controlAction=null;
      payload.controlNonce=null;
      payload.controlUpdatedAt=serverTimestamp();
    }

    await setDoc(
      doc(db,"sessionStudents",sessionKey+"_"+studentKey),
      payload,
      {merge:true}
    );
  },

  async setStudentTestControl(sessionKey,studentKey,action){
    if(!db) return;
    const ref=doc(db,"sessionStudents",sessionKey+"_"+studentKey);
    const snap=await getDoc(ref);
    const data=snap.exists()?snap.data():{};
    const nextNonce=Number(data.controlNonce||0)+1;

    const payload={
      sessionKey,
      studentKey,
      controlAction:action,
      controlNonce:nextNonce,
      controlUpdatedAt:serverTimestamp()
    };

    if(action==="end"){
      payload.status="paused";
    }else if(action==="terminate"){
      payload.status="terminated";
      payload.testProgress=null;
      payload.progressUpdatedAt=serverTimestamp();
    }

    await setDoc(ref,payload,{merge:true});
    return nextNonce;
  },

  async saveStudentProgress(sessionKey,studentKey,testProgress){
    if(!db) return;
    const user=auth?.currentUser || null;
    const payload={
      sessionKey,
      studentKey,
      testProgress,
      progressUpdatedAt:serverTimestamp()
    };
    if(user?.isAnonymous) payload.authUid=user.uid;
    await setDoc(
      doc(db,"sessionStudents",sessionKey+"_"+studentKey),
      payload,
      {merge:true}
    );
  },

  async getStudentProgress(sessionKey,studentKey){
    if(!db) return null;
    const snap=await getDoc(doc(db,"sessionStudents",sessionKey+"_"+studentKey));
    if(!snap.exists()) return null;
    return snap.data()?.testProgress || null;
  },

  async clearStudentProgress(sessionKey,studentKey){
    if(!db) return;
    const user=auth?.currentUser || null;
    const payload={
      sessionKey,
      studentKey,
      testProgress:null,
      progressUpdatedAt:serverTimestamp()
    };
    if(user?.isAnonymous) payload.authUid=user.uid;
    await setDoc(
      doc(db,"sessionStudents",sessionKey+"_"+studentKey),
      payload,
      {merge:true}
    );
  },

  async setSessionStudentRunState(sessionKey,sessionStatus){
    if(!db) return;
    const q=query(collection(db,"sessionStudents"),where("sessionKey","==",sessionKey));
    const snap=await getDocs(q);
    await Promise.all(snap.docs.map(d=>setDoc(
      d.ref,
      {sessionStatus,sessionStatusUpdatedAt:serverTimestamp()},
      {merge:true}
    )));
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

  async deleteResults(resultIds=[]){
    if(!db) return;
    const ids=[...new Set((resultIds||[]).filter(Boolean))];
    await Promise.all(ids.map(id=>deleteDoc(doc(db,"results",id))));
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
