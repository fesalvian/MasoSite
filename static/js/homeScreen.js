document.addEventListener('DOMContentLoaded', async () => {
    const cards = document.querySelectorAll('.card');

    // Função de redirecionamento dos cards da home page
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.getAttribute('data-filter'); // Obtém o valor do filtro do card
            console.log(`Redirecting to catalogo.html with filter: ${filter}`);
            window.location.href = `/catalogo?filter=${filter}`; // Redireciona com o filtro na URL
        });
    });

    console.log("arquivo homescreen carregado com sucesso");
});