// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { todoContainer, firebaseConfig } from "./config.js";

import {
  get,
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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
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

export const saveTask = (title, description = undefined) => {
  addDoc(collection(db, "todos"), {
    ...title,
    ...description,
  });
};
// , "==", false
// mark all tasks comepleted.
export const markAllTodos = function (currentUser) {
  collection(db, "todos"),
    where("completed"),
    where("user", "==", currentUser.uid),
    getTasks().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const tasks = doc.data();
        updateTask(doc.id, {
          completed: !tasks.completed ? true : false,
        });
      });
    });
};
// gets the id of the current clicked task, and sets task to completed / uncompleted.
export const toggleCompleted = function (id) {
  collection(db, "todos"),
    where("completed"),
    where("user", "==", id),
    getTask(id).then((doc) => {
      const task = doc.data();
      updateTask(doc.id, {
        completed: !task.completed ? true : false,
      });
    });
};
// Lyssnar på förändringar och uppdaterar dem i collection för rätt user.
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
// delete all marked/completed tasks
export const deleteCompletedTasks = function (currentUser) {
  collection(db, "todos"),
    where("completed", "==", true),
    where("user", "==", currentUser.uid),
    getTasks().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const complete = doc.data().completed;
        if (complete) deleteTask(doc.id);
      });
    });
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
export const updateTask = (id, title = undefined) => {
  updateDoc(doc(db, "todos", id), title);
  // doc(db, "todos", id).updateDoc({ completed: true });
};

/**
 * Hämtar alla uppgifter
 */
export const getTasks = () => getDocs(collection(db, "todos"));
// renderar todolist
export const renderList = function (todos, doc) {
  let markup = `
      <div>
      <li class="collection-item" data-id="${doc.id}">
            <div class="editContainer ">
                <span>${todos.title}</span>              
                <i class="material-icons secondary-content delete small">delete</i>
                <a href="#modal-edit" class="modal-trigger secondary-content">
                <i class="material-icons small">edit</i></a>
                <i class="small material-icons not_completed secondary-content">${
                  todos.completed ? "check_box" : "check_box_outline_blank"
                }</i> 
               
                </div>
          </li>
        </div>
    `;
  todoContainer.insertAdjacentHTML("beforeend", markup);
};
// reset passowrd.
export const resetPassword = (auth, email) => {
  return sendPasswordResetEmail(auth, email);
};

// setup items when user logg in.
export const setupUI = function (user, loginItems, logoutItems) {
  if (user) {
    loginItems.forEach((item) => (item.style.display = "block"));
    logoutItems.forEach((item) => (item.style.display = "none"));
  } else {
    loginItems.forEach((item) => (item.style.display = "none"));
    logoutItems.forEach((item) => (item.style.display = "block"));
  }
};

// adds preloader animation
export const renderPreloader = function (preLoader, todoContainer) {
  preLoader.classList.add("active");
  todoContainer.classList.add("center-align");
  todoContainer.append(preLoader);
};
export const renderPreloaderForgotPassword = function (
  preLoader,
  todoContainer
) {
  preLoader.classList.add("active");
  todoContainer.classList.add("center-align");
  todoContainer.innerHTML = `<h3>Processing...</h3>`;
  todoContainer.append(preLoader);
};

export const hideBtns = function (deleteCompletedTasksBtn, markAllTasksBtn) {
  deleteCompletedTasksBtn.classList.add("hidden");
  markAllTasksBtn.classList.add("hidden");
};
export const showBtns = function (deleteCompletedTasksBtn, markAllTasksBtn) {
  deleteCompletedTasksBtn.classList.remove("hidden");
  markAllTasksBtn.classList.remove("hidden");
};
