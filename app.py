from flask import Flask, jsonify, request, render_template
import mysql.connector

app = Flask(__name__)

# Configurações do banco de dados
db_config = {
    'host': 'localhost',
    'user': 'root',  # Substitua pelo seu usuário do MySQL
    'password': 'felipeuser1234',  # Substitua pela sua senha do MySQL
    'database': 'MasoCatalogDB'
}

# Função para conectar ao banco de dados
def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

# Rota para listar todas as cores
@app.route('/cores', methods=['GET'])
def listar_cores():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM Cores')
    cores = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(cores)

# Rota para adicionar uma nova cor
@app.route('/cores', methods=['POST'])
def adicionar_cor():
    nova_cor = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    query = '''
        INSERT INTO Cores (nome, colecao, imagem, descricao, linha)
        VALUES (%s, %s, %s, %s, %s)
    '''
    valores = (
        nova_cor['nome'],
        nova_cor['colecao'],
        nova_cor['imagem'],
        nova_cor['descricao'],
        nova_cor['linha']
    )
    cursor.execute(query, valores)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Cor adicionada com sucesso!'}), 201

# Rota para buscar uma cor pelo ID
@app.route('/cores/<int:id>', methods=['GET'])
def buscar_cor(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM Cores WHERE id = %s', (id,))
    cor = cursor.fetchone()
    cursor.close()
    conn.close()
    if cor:
        return jsonify(cor)
    else:
        return jsonify({'mensagem': 'Cor não encontrada'}), 404

# Rota para atualizar uma cor
@app.route('/cores/<int:id>', methods=['PUT'])
def atualizar_cor(id):
    dados_atualizados = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    query = '''
        UPDATE Cores
        SET nome = %s, colecao = %s, imagem = %s, descricao = %s, linha = %s
        WHERE id = %s
    '''
    valores = (
        dados_atualizados['nome'],
        dados_atualizados['colecao'],
        dados_atualizados['imagem'],
        dados_atualizados['descricao'],
        dados_atualizados['linha'],
        id
    )
    cursor.execute(query, valores)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Cor atualizada com sucesso!'})

# Rota para deletar uma cor
@app.route('/cores/<int:id>', methods=['DELETE'])
def deletar_cor(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM Cores WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Cor deletada com sucesso!'})

#rotas das paginas html
@app.route('/')
def index():
    return render_template('home.html')

@app.route('/favoritos')
def favoritos():
    return render_template('pages/favoritos.html')

@app.route('/catalogo')
def catalogo():
    return render_template('pages/catalogo.html')

@app.route('/login')
def login():
    return render_template('pages/login.html')

@app.route('/cadastro')
def cadastro():
    return render_template('pages/cadastro.html')

@app.route('/manageCatalog')
def manageCatalog():
    return render_template('pages/manage-catalog.html')

@app.route('/termoDeServico')
def termoDeServico():
    return render_template('pages/termoDeServico.html')

@app.route('/politicas')
def politicas():
    return render_template('pages/politicas.html')

@app.route('/sobre-nos')
def sobre_nos():
    return render_template('pages/sobre-nos.html')

    #Rota pra buscar as cores em alta
@app.route('/cores/em-alta', methods=['GET'])
def listar_cores_em_alta():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM Cores WHERE em_alta = TRUE LIMIT 3')
    cores = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(cores)

#Rota para atualizar cores em alta

@app.route('/cores/<int:id>/em-alta', methods=['PUT'])
def atualizar_em_alta(id):
    dados = request.json
    em_alta = dados.get('em_alta', False)

    conn = get_db_connection()
    cursor = conn.cursor()
    query = 'UPDATE Cores SET em_alta = %s WHERE id = %s'
    cursor.execute(query, (em_alta, id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensagem': 'Status "em alta" atualizado com sucesso!'})


# Iniciar o servidor
if __name__ == '__main__':
    app.run(debug=True)