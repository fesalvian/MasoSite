// URL da API
const API_URL = 'http://127.0.0.1:5000/cores';

// Elementos do DOM
const listaCores = document.getElementById('lista-cores');
const filtroNome = document.getElementById('filtro-nome');
const filtroColecao = document.getElementById('filtro-colecao');

// Função para carregar as cores
async function carregarCores() {
    try {
        const response = await fetch(API_URL);
        const cores = await response.json();
        exibirCores(cores);
        preencherFiltroColecao(cores);
    } catch (error) {
        console.error('Erro ao carregar cores:', error);
    }
}

// Função para exibir as cores na tela
function exibirCores(cores) {
    listaCores.innerHTML = '';
    cores.forEach(cor => {
        const card = `
            <div class="cor-card">
                <img src="${cor.imagem}" alt="${cor.nome}">
                <h3>${cor.nome}</h3>
                <p><strong>Coleção:</strong> ${cor.colecao}</p>
                <p><strong>Linha:</strong> ${cor.linha}</p>
                <p>${cor.descricao}</p>
            </div>
        `;
        listaCores.insertAdjacentHTML('beforeend', card);
    });
}

// Função para preencher o filtro de coleção
function preencherFiltroColecao(cores) {
    const colecoes = [...new Set(cores.map(cor => cor.colecao))]; // Remove duplicatas
    colecoes.forEach(colecao => {
        const option = document.createElement('option');
        option.value = colecao;
        option.textContent = colecao;
        filtroColecao.appendChild(option);
    });
}

// Função para filtrar as cores
async function filtrarCores() {
    const nome = filtroNome.value.toLowerCase();
    const colecao = filtroColecao.value;

    try {
        const response = await fetch(API_URL);
        const cores = await response.json();
        const coresFiltradas = cores.filter(cor => {
            const matchNome = cor.nome.toLowerCase().includes(nome);
            const matchColecao = colecao ? cor.colecao === colecao : true;
            return matchNome && matchColecao;
        });
        exibirCores(coresFiltradas);
    } catch (error) {
        console.error('Erro ao filtrar cores:', error);
    }
}

// Carregar as cores ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarCores);