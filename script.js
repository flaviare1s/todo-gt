const formulario = document.getElementById("formularioTarefa");
let tarefas = JSON.parse(localStorage.getItem("tarefa")) || [];

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const dados = new FormData(formulario);
  const title = dados.get("titulo");
  const tags = dados
    .get("tags")
    .split(",")
    .map((tag) => tag.trim());

  const novaTarefa = {
    id: Date.now(),
    title,
    tags,
    criadoEm: new Date(),
  };

  tarefas = [...tarefas, novaTarefa];
  salvarTarefas();
  renderizarTarefas(tarefas);
  formulario.reset();
});

function salvarTarefas() {
  localStorage.setItem("tarefa", JSON.stringify(tarefas));
}

const renderizarTarefas = (lista) => {
  const container = document.getElementById("listaTarefas");

  lista.forEach(({ id, title, tags }) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card p-3 mb-3 shadow-sm">
        <h5>${title}</h5>
        <div>${tags
          .map((tag) => `<span class="card-tag">${tag}</span>`)
          .join("")}</div>
        <button class="btn btn-sm btn-danger mt-2" onclick="removerTarefa(${id})">Remover</button>
      </div>
    `;
    container.appendChild(card);
  });
};

function atualizarFiltros() {
  const todasAsTags = [...new Set(tarefas.flatMap(({tags}) => tags))]
  const container = document.getElementById('filtros');
  container.innerHTML = `
    <button class="btn bt-outline-secondary me-2 mb-2">Todas</button>
  `;

  todasAsTags.forEach(tag => {
    const botao = document.createElement('button')
    botao.className = 'btn btn-outline-secondary me-2 mb-2'
    botao.textContent = tag;
    botao.dataset.tag = tag;
    container.appendChild(botao)
  })
}

document.getElementById("filtros").addEventListener("click", (e) => {
  console.log(e.target.dataset.tag);
  
  const tagSelecionada = e.target.dataset.tag;
  if (!tagSelecionada) return;

  const listaFiltrada =
    tagSelecionada === "todas"
      ? tarefas
      : tarefas.filter(({ tags }) => tags.includes(tagSelecionada));
      
    renderizarTarefas(listaFiltrada);
});

renderizarTarefas(tarefas);
atualizarFiltros();
