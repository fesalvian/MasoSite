document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'http://127.0.0.1:5000/cores'; // URL da API para buscar as cores
    const favoritesCatalog = document.getElementById('favoritesCatalog'); // Contêiner dos favoritos

    // Função para carregar os itens favoritados
    async function loadFavoriteItems() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Recupera os favoritos do localStorage
        console.log('Favoritos:', favorites);

        if (favorites.length === 0) {
            favoritesCatalog.innerHTML = '<p>Nenhum item favoritado.</p>'; // Mensagem se não houver favoritos
            return;
        }

        try {
            // Busca todas as cores da API
            const response = await fetch(API_URL);
            const cores = await response.json();

            // Filtra as cores favoritadas
            const coresFavoritas = cores.filter(cor => favorites.includes(cor.id.toString()));

            // Exibe as cores favoritadas
            exibirCoresFavoritas(coresFavoritas);
        } catch (error) {
            console.error('Erro ao carregar cores favoritas:', error);
            favoritesCatalog.innerHTML = '<p>Erro ao carregar os favoritos.</p>';
        }
    }

    // Função para exibir as cores favoritadas
    function exibirCoresFavoritas(cores) {
        favoritesCatalog.innerHTML = ''; // Limpa o contêiner antes de exibir os favoritos

        cores.forEach(cor => {
            const card = `
                <div class="cor-card" data-id="${cor.id}">
                    <img src="${cor.imagem}" alt="${cor.nome}">
                    <h3>${cor.nome}</h3>
                    <p><strong>Coleção:</strong> ${cor.colecao}</p>
                    <p><strong>Linha:</strong> ${cor.linha}</p>
                    <p>${cor.descricao}</p>
                    <button class="favorite-btn favoritado" data-id="${cor.id}">
                        ★
                    </button>
                </div>
            `;
            favoritesCatalog.insertAdjacentHTML('beforeend', card); // Adiciona o card ao contêiner de favoritos
        });

        // Adiciona event listeners aos botões de favoritos
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', () => {
                const corId = button.getAttribute('data-id');
                removeFavorite(corId); // Remove o item dos favoritos
            });
        });
    }

    // Função para remover um item dos favoritos
    function removeFavorite(corId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(id => id !== corId); // Remove o ID do array de favoritos
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Atualiza o localStorage

        // Remove o card da tela
        const card = document.querySelector(`.cor-card[data-id="${corId}"]`);
        if (card) {
            card.remove();
        }

        // Atualiza a mensagem se não houver mais favoritos
        if (favorites.length === 0) {
            favoritesCatalog.innerHTML = '<p>Nenhum item favoritado.</p>';
        }
    }

    // Carrega os itens favoritados quando a página é carregada
    if (favoritesCatalog) {
        loadFavoriteItems();
    }
});