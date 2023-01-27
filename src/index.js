import {
  getTasks,
  getTask,
  saveTask,
  onGetTasks,
  deleteTask,
  updateTask,
  renderList,
} from "./helpers";
import {
  todoContainer,
  form,
  updateBtn,
  logoutItems,
  loginItems,
  logout,
  loginForm,
  signupForm,
  EMAIL,
} from "./config.js";
import { getAuth } from "firebase/auth";
import { createUser, signIn } from "./auth.js";
import { onSnapshot } from "firebase/firestore";
const auth = getAuth();
let newTitle = document.querySelector(".update_text");
let updateID;
let currentUser = getAuth().currentUser;

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".modal");
  const instances = M.Modal.init(elems);
});
function setupUI(user) {
  if (user) {
    loginItems.forEach((item) => (item.style.display = "block"));
    logoutItems.forEach((item) => (item.style.display = "none"));
  } else {
    loginItems.forEach((item) => (item.style.display = "none"));
    logoutItems.forEach((item) => (item.style.display = "block"));
  }
}
function getTodos() {
  todoContainer.innerHTML = "";
  currentUser = auth.currentUser;
  EMAIL.innerHTML = currentUser ? currentUser.email : "";

  if (currentUser === null) {
    todoContainer.innerHTML = `<h3 class="center-align">Please login to get todos</h3>`;
    return;
  }

  onGetTasks((querySnapshot) => {
    // empty todolist container
    todoContainer.innerHTML = "";
    // re render todolist container
    querySnapshot.forEach((doc) => {
      const todos = doc.data();

      if (todos.user === currentUser.uid) {
        // render the added todo
        renderList(todos, doc);
      }

      todoContainer.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".delete");
        const edit = e.target.closest(".modal-trigger");
        const id = e.target.parentElement.parentElement.getAttribute("data-id");

        // if delete btn clicked remove todo list
        if (deleteBtn) {
          deleteTask(id);
        }
        if (edit) {
          // get the clicked id
          updateID =
            e.target.parentElement.parentElement.parentElement.getAttribute(
              "data-id"
            );
          updateBtn.addEventListener("click", (e) => {
            updateTask(updateID, {
              title: newTitle.value,
            });
          });
          newTitle.value = "";
        }
      });
    });
  });
}

/// EVENT HANDLERS ////
// on submit save task.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // add new todo.
  form.title.value
    ? saveTask({ title: form.title.value, user: currentUser.uid })
    : (form.title.value = "");
  form.title.value = "";
});

loginForm.addEventListener("click", (e) => {
  e.preventDefault();

  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  signIn(auth, email, password)
    .then(() => {
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();

      loginForm.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});

signupForm.addEventListener("click", (e) => {
  e.preventDefault();

  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  createUser(auth, email, password)
    .then(() => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();

      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});
logout.addEventListener("click", (e) => {
  e.preventDefault();

  auth.signOut();
});

auth.onAuthStateChanged((user) => {
  getTodos();
  setupUI(user);
});
