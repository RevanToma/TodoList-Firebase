// Import the functions you need from the SDKs you need
import { initializeApp, firebase } from "firebase/app";
import { todoContainer } from "./config";
import { firebaseConfig } from "./config.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore();

/*Obs! Här används colletion "task" - se till att du skapar en ny collection med
 * samma namn Firebase console -> Build -> Firestore Database -> Start collection
 */

/**
 * Sparar en ny uppgift i Firestore
 * @param {string} title uppgiftens titel
 * @param {string} description beskrivning av uppgift
 */
// export const saveTask = (user, title, description = undefined) => {
//   const task = { userId: user.uid, ...title, ...description };
//   addDoc(collection(db, "alltodos"), task);
// };
export const saveTask = (title, description = undefined) => {
  addDoc(collection(db, "todos"), {
    ...title,
    ...description,
  });
};
// Lyssnar på förändringar och uppdaterar dem i collection
// export const onGetTasks = (callback) =>
//   onSnapshot(collection(db, "todos"), callback);

export const onGetTasks = (callback) => {
  const currentUser = getAuth().currentUser;
  if (currentUser) {
    const currentUserId = currentUser.uid;
    onSnapshot(
      collection(db, "todos"),
      where("userId", "==", currentUserId),
      callback
    );
  }
};

/**
 * Tar bort en ny uppgift
 * @param {string} id uppgiftens id
 */
export const deleteTask = (id) => deleteDoc(doc(db, "todos", id));

/**
 * Hämtar en ny uppgift
 * @param {string} uppgiftens id
 */
export const getTask = (id) => getDoc(doc(db, "todos", id));

/**
 * Uppdaterar en ny uppgift
 * @param {string} id uppgiftens id
 * @param {string} newFields uppdaterad data
 */
export const updateTask = (id, title) => updateDoc(doc(db, "todos", id), title);

/**
 * Hämtar alla uppgifter
 */
export const getTasks = () => getDocs(collection(db, "todos"));
// render list
export const renderList = function (todos, doc) {
  let markup = `
      <div>
      <li class="collection-item" data-id="${doc.id}">
            <div>
              <span>${todos.title}</span>
              <i class="material-icons secondary-content delete">delete</i>
              <a href="#modal-edit" class="modal-trigger secondary-content">
                <i class="material-icons">edit</i></a
              >
            </div>
          </li>
    `;
  todoContainer.insertAdjacentHTML("beforeend", markup);
};
