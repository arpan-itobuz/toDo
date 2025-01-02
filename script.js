
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const allBtn = document.getElementById("all");
const activeBtn = document.getElementById("active");
const completeBtn = document.getElementById("complete");
const clearBtn = document.getElementsByClassName("clear")[0];
const footerBtns = document.getElementsByClassName("footer-button");
const alertBox = document.getElementById("alert");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Tasks saved to localStorage:", tasks);
};

const todo = (filter) => {
    todoList.innerHTML = "";
    for (const task of tasks) {
        const { name, completed } = task;
        if (
            filter === 'all' ||
            (filter === 'active' && !completed) ||
            (filter === 'complete' && completed)
        ) {
            const newTask = document.createElement("div");
            const taskname = document.createElement("p");
            const taskBtnContainer = document.createElement("div");
            const checkBtn = document.createElement("button");
            const checkIcon = document.createElement("img");
            const deleteBtn = document.createElement("button");
            const deleteIcon = document.createElement("img");

            taskname.textContent = name;
            taskname.classList.add("task-name");
            if (completed) {
                taskname.classList.add("complete-task");
            }

            taskBtnContainer.classList.add("task-btn-container");

            checkBtn.classList.add("task-btn", "checkTask");
            checkBtn.setAttribute("onClick", `completeTask('${name}')`);
            checkIcon.src = "images/checked.png";
            checkIcon.classList.add("task-icon");
            checkBtn.appendChild(checkIcon);

            deleteBtn.classList.add("task-btn", "deleteTask");
            deleteBtn.setAttribute("onClick", `deleteTask('${name}')`);
            deleteIcon.src = "images/delete.svg";
            deleteIcon.classList.add("task-icon");
            deleteBtn.appendChild(deleteIcon);

            taskBtnContainer.appendChild(checkBtn);
            taskBtnContainer.appendChild(deleteBtn);

            newTask.appendChild(taskname);
            newTask.appendChild(taskBtnContainer);
            newTask.classList.add("task-container");

            todoList.appendChild(newTask);
        }
    }
    console.log("Tasks displayed with filter:", filter, tasks);
};

const addTask = () => {
    const taskName = todoInput.value.trim();
    todoInput.value = "";

    if (taskName !== "") {
        if (!tasks.some(task => task.name === taskName)) {
            tasks.unshift({ name: taskName });
            saveToLocalStorage();
        } else {
            alertBox.style.display = 'block';
            alertBox.textContent = "Task already exists!";
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 2000);
        }
    }
    todo('all');
    console.log("Task added:", taskName, tasks);
};

addBtn.addEventListener("click", () => {
    addTask();
});

todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

const deleteTask = (taskName) => {
    tasks = tasks.filter(task => task.name !== taskName);
    saveToLocalStorage();
    todo('all');
    console.log("Task deleted:", taskName, tasks);
};

const completeTask = (taskName) => {
    const task = tasks.find(task => task.name === taskName);
    if (task) {
        if (task.completed) {
            delete task.completed;
        } else {
            task.completed = true;
        }
        saveToLocalStorage();
    }
    if (allBtn.classList.contains("active")) {
        todo('all');
    } else if (completeBtn.classList.contains("active")) {
        todo('complete');
    } else {
        activeTask();
    }
    console.log("Task completion toggled:", taskName, task);
};

const activeTask = () => {
    todo('active');
    removeActiveClass();
    activeBtn.classList.add("active");
};

const removeActiveClass = () => {
    Array.from(footerBtns).forEach((footerBtn) => {
        footerBtn.classList.remove("active");
    });
};

allBtn.addEventListener("click", () => {
    todo('all');
    removeActiveClass();
    allBtn.classList.add("active");
    console.log("All tasks displayed:", tasks);
});

activeBtn.addEventListener("click", () => {
    activeTask();
});

completeBtn.addEventListener("click", () => {
    todo('complete');
    removeActiveClass();
    completeBtn.classList.add("active");
    console.log("Completed tasks displayed:", tasks.filter(task => task.completed));
});

clearBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveToLocalStorage();
    todo('all');
    removeActiveClass();
    clearBtn.classList.add("active");
    console.log("Completed tasks cleared:", tasks);
});

document.addEventListener("DOMContentLoaded", () => {
    todo('all');
    console.log("Page loaded, tasks displayed:", tasks);
});
