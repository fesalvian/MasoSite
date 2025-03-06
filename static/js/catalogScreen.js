document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'http://127.0.0.1:5000/cores'; // URL da sua API
    const filtroNome = document.getElementById('searchInput'); // Campo de pesquisa
    const filtroColecao = document.getElementById('filterSelect'); // Select de coleção
    const catalog = document.getElementById('catalog'); // Contêiner das cores

    let cores = []; // Variável para armazenar todas as cores carregadas
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Carrega os favoritos do localStorage

    // Função para remover acentos
    function removerAcentos(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Função para carregar as cores da API
    async function carregarCores() {
        try {
            const response = await fetch(API_URL);
            cores = await response.json(); // Armazena todas as cores
            exibirCores(cores); // Exibe todas as cores inicialmente
        } catch (error) {
            console.error('Erro ao carregar cores:', error);
        }
    }

    // Função para exibir as cores na tela
    function exibirCores(cores) {
        catalog.innerHTML = ''; // Limpa o catálogo antes de exibir as cores filtradas
        cores.forEach(cor => {
            const isFavorito = favorites.includes(cor.id.toString()); // Verifica se a cor já está favoritada

            const card = `
                <div class="cor-card">
                    <img src="${cor.imagem}" alt="${cor.nome}">
                    <h3>${cor.nome}</h3>
                    <p><strong>Coleção:</strong> ${cor.colecao}</p>
                    <p><strong>Linha:</strong> ${cor.linha}</p>
                    <p>${cor.descricao}</p>
                    <button class="favorite-btn ${isFavorito ? 'favoritado' : ''}" data-id="${cor.id}">
                        ${isFavorito ? '★' : '☆'}
                    </button>
                </div>
            `;
            catalog.insertAdjacentHTML('beforeend', card); // Adiciona o card ao catálogo
        });

        // Adiciona event listeners aos botões de favoritos
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', () => {
                const corId = button.getAttribute('data-id');
                toggleFavorito(corId, button); // Alterna o estado de favorito
            });
        });
    }

    // Função para alternar o estado de favorito
    function toggleFavorito(corId, button) {
        if (favorites.includes(corId)) {
            // Remove dos favoritos
            favorites = favorites.filter(id => id !== corId);
            button.classList.remove('favoritado');
            button.innerHTML = '☆';
        } else {
            // Adiciona aos favoritos
            favorites.push(corId);
            button.classList.add('favoritado');
            button.innerHTML = '★';
        }

        // Atualiza o localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Função para filtrar as cores com base no nome e na coleção
    function filtrarCores() {
        const nome = filtroNome.value.toLowerCase(); // Valor do campo de pesquisa (em minúsculas)
        const colecao = filtroColecao.value; // Valor selecionado no select

        const coresFiltradas = cores.filter(cor => {
            // Normaliza o nome da cor e o valor da pesquisa (remove acentos e converte para minúsculas)
            const nomeCorNormalizado = removerAcentos(cor.nome.toLowerCase());
            const nomePesquisaNormalizado = removerAcentos(nome);

            // Filtra por nome (insensível a acentos e maiúsculas/minúsculas)
            const matchNome = nomeCorNormalizado.includes(nomePesquisaNormalizado);

            // Filtra por coleção
            const matchColecao = colecao === 'all' || cor.colecao === colecao;

            // Retorna true se ambos os filtros forem atendidos
            return matchNome && matchColecao;
        });

        exibirCores(coresFiltradas); // Exibe as cores filtradas
    }

    // Adiciona event listeners para filtrar as cores automaticamente
    filtroNome.addEventListener('input', filtrarCores); // Filtra ao digitar no campo de pesquisa
    filtroColecao.addEventListener('change', filtrarCores); // Filtra ao mudar o select

    // Verifica se há um parâmetro de filtro na URL e aplica o filtro correspondente
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    if (filter) {
        filtroColecao.value = filter; // Define o valor do select com o filtro da URL
        filtrarCores(); // Aplica o filtro
    }

    // Carrega as cores quando a página é carregada
    await carregarCores();
});