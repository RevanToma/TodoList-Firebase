import {
  getTasks,
  getTask,
  saveTask,
  onGetTasks,
  deleteTask,
  updateTask,
  renderList,
} from "./helpers";
import { todoContainer, form, updateBtn } from "./config.js";
let newTitle = document.querySelector(".update_text");
let updateID;

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".modal");
  const instances = M.Modal.init(elems);
});

onGetTasks((querySnapshot) => {
  // empty todolist container
  todoContainer.innerHTML = "";
  // re render todolist container
  querySnapshot.forEach((doc) => {
    const todos = doc.data();

    // render the added todo
    renderList(todos, doc);

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

// on submit save task.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // add new todo.
  form.title.value
    ? saveTask({ title: form.title.value })
    : (form.title.value = "");
  form.title.value = "";
});
