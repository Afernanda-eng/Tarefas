// ===== VARIÁVEIS =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const counter = document.getElementById("counter");
const searchBar = document.getElementById("searchBar");

// ===== SALVAR NO LOCALSTORAGE =====
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== ADICIONAR TAREFA =====
document.getElementById("addBtn").onclick = () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    category: categorySelect.value,
    date: dateInput.value,
    time: timeInput.value,
    done: false
  });

  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";

  save();
  render();
};

// ===== RENDERIZAR LISTA =====
function render(filter = "") {
  taskList.innerHTML = "";

  const filtered = tasks.filter(t =>
    t.text.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task";
    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <div>
        <strong class="text">${task.text}</strong><br>
        <span class="category">${task.category} • ${task.date || ""} ${task.time || ""}</span>
      </div>
      <div>
        <button class="delete-btn" onclick="deleteTask(${index})">X</button>
      </div>
    `;

    li.onclick = (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      task.done = !task.done;
      save();
      render(filter);
    };

    taskList.appendChild(li);
  });

  counter.textContent = ${tasks.filter(t => t.done).length} concluídas de ${tasks.length};
}

// ===== EXCLUIR UMA TAREFA =====
function deleteTask(i) {
  tasks.splice(i, 1);
  save();
  render();
}

// ===== LIMPAR CONCLUÍDAS =====
document.getElementById("clearDone").onclick = () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
};

// ===== PESQUISA =====
searchBar.oninput = () => render(searchBar.value);

// ===== DARK MODE =====
document.getElementById("darkMode").onclick = () => {
  document.body.classList.toggle("dark");
};

// ===== EXPORTAR JSON =====
document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tarefas.json";
  a.click();
};

// ===== IMPORTAR JSON =====
document.getElementById("importBtn").onclick = () => {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (Array.isArray(data)) {
        tasks = data;
        save();
        render();
      } else {
        alert("Arquivo inválido");
      }
    } catch (e) {
      alert("Erro ao ler arquivo");
    }
  };
  reader.readAsText(file);
};

// ===== PRIMEIRO RENDER =====
render();