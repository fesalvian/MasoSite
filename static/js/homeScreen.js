document.addEventListener('DOMContentLoaded', async () => {
    const cards = document.querySelectorAll('.card');
    const coresEmAltaContainer = document.getElementById('cores-em-alta');

    // Função de redirecionamento dos cards da home page
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.getAttribute('data-filter'); // Obtém o valor do filtro do card
            console.log(`Redirecting to catalogo.html with filter: ${filter}`);
            window.location.href = `/catalogo?filter=${filter}`; // Redireciona com o filtro na URL
        });
    });

    console.log("arquivo homescreen carregado com sucesso");

 // Função para carregar as cores em alta
 async function carregarCoresEmAlta() {
    try {
        const response = await fetch('/cores/em-alta');
        const cores = await response.json();

        // Limpa o contêiner antes de adicionar as novas cores
        coresEmAltaContainer.innerHTML = '';

        // Exibe as 3 cores em alta
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
            coresEmAltaContainer.insertAdjacentHTML('beforeend', card);
        });
    } catch (error) {
        console.error('Erro ao carregar cores em alta:', error);
    }
}

// Carrega as cores em alta ao carregar a página
if (coresEmAltaContainer) {
    await carregarCoresEmAlta();
}

console.log("arquivo homescreen carregado com sucesso");
});