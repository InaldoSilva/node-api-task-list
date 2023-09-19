const taskListElement = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");

async function fetchAndRenderTasks() {
  try {
    const response = await fetch("http://localhost:3333/todos");
    const data = await response.json();

    if (Array.isArray(data)) {
      taskListElement.innerHTML = ""; // Limpa a lista antes de renderizar novamente
      data.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.textContent = task.description;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        const updateButton = document.createElement("button");
        updateButton.textContent = "Atualizar";
        updateButton.addEventListener("click", () =>
          updateTaskDescription(task.id)
        );

        taskItem.appendChild(deleteButton);
        taskItem.appendChild(updateButton);

        taskListElement.appendChild(taskItem);
      });
    } else {
      console.error("Erro na resposta da API");
    }
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
  }
}

async function addTask(description) {
  try {
    const response = await fetch("http://localhost:3333/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (response.ok) {
      fetchAndRenderTasks();
    } else {
      console.error("Erro ao adicionar tarefa");
    }
  } catch (error) {
    console.error("Erro ao fazer a requisição POST:", error);
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`http://localhost:3333/todos/${taskId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchAndRenderTasks();
    } else {
      console.error("Erro ao excluir tarefa");
    }
  } catch (error) {
    console.error("Erro ao fazer a requisição DELETE:", error);
  }
}

async function updateTaskDescription(taskId) {
  const newDescription = prompt("Digite a nova descrição:");
  if (newDescription !== null && newDescription.trim() !== "") {
    try {
      const response = await fetch(`http://localhost:3333/todos/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newDescription }),
      });

      if (response.ok) {
        fetchAndRenderTasks();
      } else {
        console.error("Erro ao atualizar descrição da tarefa");
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição PUT:", error);
    }
  }
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskDescription = taskForm.elements.description.value;
  addTask(taskDescription);
  taskForm.reset();
});

fetchAndRenderTasks();
