// Seleção dos Elementos DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');

// Estado da Aplicação (Carrega do LocalStorage ou inicia vazio)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Função para Salvar no LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para Atualizar o Contador de Tarefas Pendentes
function updateCounter() {
  const pendingCount = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${pendingCount} ${pendingCount === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`;
}

// Função para Renderizar a Lista na Tela
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="empty-state">Nenhuma tarefa cadastrada.</li>';
    updateCounter();
    return;
  }

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-content">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''} 
          onchange="toggleTask(${index})"
        >
        <span class="task-text">${escapeHtml(task.text)}</span>
      </div>
      <button class="btn-delete" onclick="deleteTask(${index})" title="Excluir tarefa">&times;</button>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

// Função para Adicionar Tarefa
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();

  if (text !== '') {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
  }
});

// Função para Marcar/Desmarcar Concluída
window.toggleTask = function(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
};

// Função para Excluir Tarefa
window.deleteTask = function(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
};

// Auxiliar para Evitar Injeção de Código (XSS)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Renderização Inicial
renderTasks();
