// Seleção dos Elementos DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');

// Seleção dos elementos da API
const quoteText = document.getElementById('quote-text');
const btnQuote = document.getElementById('btn-quote');

// Estado da Aplicação (Carrega do LocalStorage ou inicia vazio)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Função para buscar dados da API Externa
async function fetchMotivationalQuote() {
  try {
    quoteText.textContent = 'Carregando conselho...';
    
    // 1. Requisição para a API externa (Advice Slip)
    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    const adviceInEnglish = data.slip.advice;

    // 2. Tradução rápida para português usando a API MyMemory
    const transResponse = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(adviceInEnglish)}&langpair=en|pt-BR`
    );
    const transData = await transResponse.json();
    const adviceInPortuguese = transData.responseData.translatedText;

    // 3. Atualização dinâmica no HTML
    quoteText.innerHTML = `<em>"${adviceInPortuguese}"</em>`;
  } catch (error) {
    console.error('Erro ao buscar conselho:', error);
    quoteText.textContent = '"Foque em uma tarefa de cada vez."';
  }
}

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

// Evento para buscar um novo conselho ao clicar
btnQuote.addEventListener('click', fetchMotivationalQuote);

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

// Chama a API assim que a página carrega
fetchMotivationalQuote();
