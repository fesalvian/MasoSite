// Função global para marcar/desmarcar uma cor como "em alta"
async function toggleEmAlta(id, emAltaAtual) {
    const API_URL = 'http://127.0.0.1:5000/cores'; // URL da API

    try {
        const response = await fetch(`${API_URL}/${id}/em-alta`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ em_alta: !emAltaAtual }),
        });

        const data = await response.json(); // Converte a resposta para JSON

        if (response.ok) {
            alert(data.mensagem || 'Status "em alta" atualizado com sucesso!');
            carregarCores(); // Recarrega a tabela apenas se a requisição for bem-sucedida
        } else {
            alert(data.mensagem || 'Erro ao atualizar status "em alta". Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar status "em alta". Tente novamente.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
const API_URL = 'http://127.0.0.1:5000/cores'; // URL da API
const coresTable = document.getElementById('coresTable'); // Tabela de cores
console.log('Carregado API com sucesso')

        // Função para carregar as cores na tabela
        async function carregarCores() {
            try {
                const response = await fetch(API_URL);
                const cores = await response.json();
                const tbody = document.querySelector('#coresTable tbody');
                tbody.innerHTML = ''; // Limpa a tabela antes de preencher

                cores.forEach(cor => {
                    const row = `
                        <tr>
                            <td>${cor.nome}</td>
                            <td>${cor.colecao}</td>
                            <td>${cor.linha}</td>
                            <td>${cor.descricao}</td>
                            <td class="actions">
                                <button class="edit" onclick="editarCor(${cor.id})">Editar</button>
                                <button class="delete" onclick="excluirCor(${cor.id})">Excluir</button>

                                <button class="em-alta" onclick="toggleEmAlta(${cor.id}, ${cor.em_alta})">
                                ${cor.em_alta ? '⭐ Remover' : '⭐ Marcar'}
                            </td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
            } catch (error) {
                console.error('Erro ao carregar cores:', error);
            }
        }

        // Função para adicionar ou atualizar uma cor
        async function salvarCor(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const formData = {
                id: document.getElementById('corId').value,
                nome: document.getElementById('nome').value,
                colecao: document.getElementById('colecao').value,
                linha: document.getElementById('linha').value,
                imagem: document.getElementById('imagem').value,
                descricao: document.getElementById('descricao').value,
            };

            const method = formData.id ? 'PUT' : 'POST';
            const url = formData.id ? `${API_URL}/${formData.id}` : API_URL;

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert('Cor salva com sucesso!');
                    document.getElementById('formCor').reset(); // Limpa o formulário
                    document.getElementById('formTitle').textContent = 'Adicionar Nova Cor';
                    document.getElementById('submitButton').textContent = 'Adicionar Cor';
                    carregarCores(); // Recarrega a tabela
                } else {
                    alert('Erro ao salvar cor. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao salvar cor. Tente novamente.');
            }
        }

        // Função para editar uma cor
        async function editarCor(id) {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const cor = await response.json();

                document.getElementById('corId').value = cor.id;
                document.getElementById('nome').value = cor.nome;
                document.getElementById('colecao').value = cor.colecao;
                document.getElementById('linha').value = cor.linha;
                document.getElementById('imagem').value = cor.imagem;
                document.getElementById('descricao').value = cor.descricao;

                document.getElementById('formTitle').textContent = 'Editar Cor';
                document.getElementById('submitButton').textContent = 'Atualizar Cor';
            } catch (error) {
                console.error('Erro ao carregar cor para edição:', error);
            }
        }

        // Função para excluir uma cor
        async function excluirCor(id) {
            if (confirm('Tem certeza que deseja excluir esta cor?')) {
                try {
                    const response = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        alert('Cor excluída com sucesso!');
                        carregarCores(); // Recarrega a tabela
                    } else {
                        alert('Erro ao excluir cor. Tente novamente.');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    alert('Erro ao excluir cor. Tente novamente.');
                }
            }
        }

        // Event listener para o formulário
        document.getElementById('formCor').addEventListener('submit', salvarCor);


        // Carrega as cores ao carregar a página
        carregarCores();
    });