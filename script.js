
// script.js - Responsividade e Tema Claro/Escuro
function aplicarClasseResponsiva() {
    const largura = window.innerWidth;
    const produto = document.getElementById('lista');
    const areaProdutos = document.getElementById('areaProdutos');
    if (!areaProdutos) return;
    
    areaProdutos.classList.remove('desktop', 'mobile', 'tablet');

    if (largura <= 480) {
        areaProdutos.classList.add('mobile');
        if (produto) produto.style.width = '80px'; 
    } else if (largura <= 780) {
        areaProdutos.classList.add('tablet');
    } else {
        areaProdutos.classList.add('desktop');
    }
}

window.addEventListener('DOMContentLoaded', aplicarClasseResponsiva);
window.addEventListener('resize', aplicarClasseResponsiva);




// botao.js - Alternar Tema Claro/Escuro
document.addEventListener('DOMContentLoaded', function() {
    const botaoTema = document.getElementById("tema") || document.getElementById("botao-tema");
    const body = document.body;
    
    let escuro = localStorage.getItem('temaEscuro') === 'true';
    
    aplicarTema(escuro);
    
    if (botaoTema) {
        botaoTema.addEventListener("click", alternarTema);
    }
    
    function alternarTema() {
        escuro = !escuro;
        aplicarTema(escuro);
        
        localStorage.setItem('temaEscuro', escuro);
    }
    
    function aplicarTema(escuro) {
        if (escuro) {
            body.classList.add("escuro");
            body.classList.remove("light");
        } else {
            body.classList.add("light");
            body.classList.remove("escuro");
        }
        
        const botao = document.getElementById("tema") || document.getElementById("botao-tema");
        if (botao) {
            botao.textContent = escuro ? "Modo claro" : "Modo escuro";
        }
    }
});


// tasks.js - Mini CRUD de Tarefas / Lista de Compras
const input = document.getElementById('item-input');
const adicionarBtn = document.getElementById('adicionar-btn');
const listaEl = document.getElementById('itens-lista');
const feedbackEl = document.getElementById('feedback');

let itens = [];
let editIndex = -1; 

function carregarLocalStorage() {
  const raw = localStorage.getItem('meu_todo_lista');
  if (raw) {
    try {
      itens = JSON.parse(raw) || [];
    } catch (e) {
      itens = [];
    }
  } else {
    itens = [];
  }
}

function salvarLocalStorage() {
  localStorage.setItem('meu_todo_lista', JSON.stringify(itens));
}

function mostrarFeedback(msg, tempo = 2000) {
  if (!feedbackEl) return;
  feedbackEl.textContent = msg;
  feedbackEl.hidden = false;
  feedbackEl.classList.add('show');
  setTimeout(() => {
    feedbackEl.classList.remove('show');
    feedbackEl.hidden = true;
  }, tempo);
}

function listarItens() {
  if (!listaEl) return;
  listaEl.innerHTML = '';

  itens.forEach((texto, index) => {
    const li = document.createElement('li');
    li.className = 'item';

    const span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = texto;

    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn small editar';
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => editarItem(index));

    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'btn small excluir';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', () => removerItem(index));

    li.appendChild(span);
    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);

    listaEl.appendChild(li);
  });
}

function validarTexto(texto) {
  if (!texto) return { ok: false, reason: 'vazio' };
  const t = texto.trim();
  if (t.length === 0) return { ok: false, reason: 'vazio' };
  // duplicate check (case-insensitive)
  const existe = itens.some((it, idx) => idx !== editIndex && it.trim().toLowerCase() === t.toLowerCase());
  if (existe) return { ok: false, reason: 'duplicado' };
  return { ok: true, value: t };
}

function adicionarItem() {
  if (!input) return;
  const raw = input.value;
  const res = validarTexto(raw);
  if (!res.ok) {
    if (res.reason === 'vazio') mostrarFeedback('Não é possível adicionar item vazio.');
    else if (res.reason === 'duplicado') mostrarFeedback('Item duplicado detectado.');
    return;
  }

  if (editIndex === -1) {
    
    itens.push(res.value);
    mostrarFeedback('Tarefa adicionada com sucesso!!');
  } else {
    
    itens[editIndex] = res.value;
    mostrarFeedback('Tarefa editada com sucesso!!');
    editIndex = -1;
    adicionarBtn.textContent = 'Adicionar';
  }

  input.value = '';
  salvarLocalStorage();
  listarItens();
}

function removerItem(index) {
  if (index < 0 || index >= itens.length) return;
  itens.splice(index, 1);
  salvarLocalStorage();
  listarItens();
  mostrarFeedback('tarefa removida com sucesso.');
}

function editarItem(index) {
  if (index < 0 || index >= itens.length) return;
  const texto = itens[index];
  input.value = texto;
  input.focus();
  editIndex = index;
  adicionarBtn.textContent = 'Salvar';
  mostrarFeedback('Modo edição ativado');
}
    
function inicializar() {
  carregarLocalStorage();
  listarItens();

  if (adicionarBtn) adicionarBtn.addEventListener('click', adicionarItem);

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        adicionarItem();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', inicializar);