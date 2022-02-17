# Desafio Raro Labs

API desenvolvida em NodeJS para o desafio técnico do processo seletivo de Pessoa Desenvolvedora Nodejs na empresa Raro Labs.

A API consiste em rotas POST, GET, PUT e DELETE no domínio http://localhost:3001/tasks , onde o usuário pode criar, atualizar, visualizar e remover tarefas 
cadastradas em um banco de dados não relacional MongoDB. A API foi testada utilizando testes de integração com as bibliotecas mocha, chai e sinon.

Você pode acessar a API localmente clonando o repositório, seguindo o passo a passo a seguir:

## Instruções para instalar o banco de dados MongoDB

Como a API utiliza uma comunicação com o banco de dados MondoDB, é necessário que ele esteja instalado e iniciado em sua máquina. Acesses esses links para visualizar
o passo a passo para a instalação no [ambiente Linux](https://docs.mongodb.com/manual/administration/install-on-linux/), 
[ambiente macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/) ou ainda ambiente Windows usando 
[WSL](https://docs.microsoft.com/pt-br/windows/wsl/tutorials/wsl-database#install-mongodb).

Neste repositório irei exemplificar a instalação no Linux Ubuntu 20.04:

1. A partir do terminal, execute o seguinte comando para importar a chave pública GPG do MongoDB:

```bash  
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
```

Obs: Caso você receba um erro indicando que gnupg não está instalado, execute os comandos:

```bash  
sudo apt-get install gnupg
```

Após gnupg ser instalado:

```bash  
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
```

2. Crie o arquivo ```.list``` para a sua versão do sistema

```bash  
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
```

3. Atualize o banco de dados local de pacotes

```bash  
sudo apt-get update
```

4. Instale os pacotes do MongoDB

```bash  
sudo apt-get install -y mongodb-org
```

Pronto! O banco de dados MongoDb está instalado! Agora, para iniciar o servidor execute o comando:

```bash  
sudo systemctl start mongod
```

Para verificar se o servidor está ativo:

```bash  
sudo systemctl status mongod
```

Para encerrar o servidor:

```bash  
sudo systemctl stop mongod
```

Para reiniciar o servidor:

```bash  
sudo systemctl restart mongod

```

---

## Instruções para reproduzir o projeto localmente

1. Clone o repositório
  * `git clone git@github.com:Kevin-Ol/ToDoList-Ebytr-BackEnd.git`.
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd ToDoList-Ebytr-BackEnd`

2. Instale as dependências
  * `npm install`

3. Inicie o projeto
  * `npm start`

4. Acesse as rotas através de softwares como Postman e Insomnia através do endereço:
  * `http://localhost:3001`
---

## Rotas

### Endpoint POST `/tasks`

- O corpo da requisição deve ter o seguinte formato:

```json
{
  "description": "Fazer compras",
  "status": "Pendente",
  "createdAt": "2022-02-15T15:42:03.596Z"
}
```

- `description` deve ser uma string;

- `status` deve ser uma string;

- `createdAt` deve ser uma data no formato ISO;

- Caso haja falha na validação a requisição será respondida com o `status 400` e uma mensagem de erro como o exemplo abaixo:

```json
{
  "message": "Campo description é obrigatório"
}
```

- Caso haja sucesso na validação a requisição será respondida com o `status 201` com a task criada:

```json
{
  "_id": "620d6cfe82fa814f0868e3e8",
  "description": "Fazer compras",
  "status": "Pendente",
  "createdAt": "2022-02-15T15:42:03.596Z"
}
```

### Endpoint GET `/tasks`

- A requisição retorna `status 200` com a lista de tasks:

```json
[
    {
      "_id": "620d6cfe82fa814f0868e3e8",
      "description": "Fazer compras",
      "status": "Pendente",
      "createdAt": "2022-02-15T15:42:03.596Z"
    },
    {
      "_id": "620d6cfe82fa814f0868e3e9",
      "description": "Limpar o quarto",
      "status": "Em andamento",
      "createdAt": "2022-02-16T11:07:54.596Z"
    }
]
```

### Endpoint PUT `/tasks/:id`

- O corpo da requisição deve ter um dos seguintes formatos:

```json
{
  "description": "Ir ao mercado",
}
```

```json
{
  "status": "Em andamento"
}
```

- Caso haja falha na validação do id, sejam enviados os 2 campos juntos ou nenhum deles, a requisição será respondida com o `status 400` ou `status 404` e 
uma mensagem de erro como o exemplo abaixo:

```json
{
  "message": "Apenas um campo pode ser alterado"
}
```

- Caso haja sucesso na requisição, ela será respondida com o `status 200` com a task modificada:

```json
{
  "_id": "620d6cfe82fa814f0868e3e8",
  "description": "Fazer compras",
  "status": "Em andamento",
  "createdAt": "2022-02-15T15:42:03.596Z"
}
```


### Endpoint DELETE `/tasks/:id`

- A requisição remove uma task do banco baseado no id informado.

- Caso haja falha na validação do id, a requisição será respondida com o `status 400` ou `status 404` e uma mensagem de erro como o exemplo abaixo:

```json
{
  "message": "Tarefa não encontrada"
}
```

- Caso haja sucesso na requisição, ela será respondida com o `status 204` e sem retorno.

---

## Scripts do projeto

- `npm start` inicia a aplicação localmente;
- `npm run dev` inicia a aplicação no modo watch;
- `npm test` inicia os arquivos de teste da aplicação;
- `npm run test:coverage` realiza os testes da aplicação gerando um relatório de cobertura;

## Bibliotecas utilizadas

- `express` para criação e manipulação de rotas;
- `http-status-codes` para melhorar legibilidade dos códigos http;
- `mongodb` para comunicação com banco de dados;
- `joi` para validação das requisições;
- `cors` para aceitação de requisições do front-end;

- `mongodb-memory-server` para simular banco de dados de testes;
- `chai`, `chai-http`, `mocha`, `sinon` para criar arquivos de testes;
- `nyc` para gerar relatório de testes;
- `nodemon` para inciar servidor no modo watch;
- `eslint` para manter padrão de código;

## Contato

Email: kevin.zero@hotmail.com

Github: https://github.com/kevin-ol

LinkedIn: https://www.linkedin.com/in/kevinmendoncaoliveira/


