/**
 * GraphicCity — Firebase Initialization (Server-side)
 * Uses compat SDK for CommonJS compatibility.
 */

const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');
require('firebase/compat/auth');
require('firebase/compat/analytics');

const firebaseConfig = {
  apiKey: "AIzaSyBNgwEqtSW4VfywhCHqxMofccRhmpVobfg",
  authDomain: "creativecity-86634.firebaseapp.com",
  projectId: "creativecity-86634",
  storageBucket: "creativecity-86634.firebasestorage.app",
  messagingSenderId: "211743234228",
  appId: "1:211743234228:web:dc64630ae7665838751fe1",
  measurementId: "G-6VE27BLZX6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

/**
 * Data helpers (admin panel migration from JSON files)
 */

function collection(name) {
  return db.collection(name);
}

async function getAll(collectionName) {
  const snap = await db.collection(collectionName).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getDoc(collectionName, id) {
  const snap = await db.collection(collectionName).doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

async function setDoc(collectionName, id, data) {
  await db.collection(collectionName).doc(id).set(data, { merge: true });
  return { id, ...data };
}

async function addDoc(collectionName, data) {
  const ref = await db.collection(collectionName).add(data);
  return { id: ref.id, ...data };
}

async function deleteDoc(collectionName, id) {
  await db.collection(collectionName).doc(id).delete();
  return true;
}

module.exports = {
  firebase,
  db,
  auth,
  collection,
  getAll,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc
};
