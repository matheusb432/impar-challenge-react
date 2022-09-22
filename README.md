# Desafio Técnico Fullstack - Frontend React

## Descrição

Impar Spa é uma Single-Page Application (SPA) que apresenta e controla dados do backend [Impar Api](https://github.com/matheusb432/impar-challenge-dotnet) e inseridos pelo usuário para
servir uma experiência de usuário intuitiva e responsiva.

## Tecnologias utilizadas

- [Create React App](https://create-react-app.dev/docs/getting-started/)
- [React Router](https://reactrouter.com/en/main)
- [React Query](https://react-query-v3.tanstack.com/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [Sass](https://sass-lang.com/documentation/)

## Arquitetura da SPA

- Estrutura de pastas agrupando componentes por funcionalidade, pasta `components` contém apenas componentes de UI enquanto a pasta `feature` agrupará componentes específicos de uma nova funcionalidade ou domínio.

- [ContextAPI](https://reactjs.org/docs/context.html) e [hooks](https://reactjs.org/docs/hooks-reference.html) nativos do React para gerenciar o estado da aplicação.

- [TypeScript](https://www.typescriptlang.org/) para prevenção de bugs derivados de tipagem incorreta que são comuns do JavaScript, melhor suporte ao IntelliSense de IDEs e acesso constante às mais novas funcionalidades do ECMAScript.

- Nenhuma biblioteca de componentes UI externa foi usada, todo componente UI do projeto foi implementado apenas com TSX.

## Setup do projeto

### Pré-requisitos

- [Node.js® 16 LTS](https://nodejs.org/en/)
- [Visual Studio Code ou outra IDE](https://code.visualstudio.com/)
- [Typescript AirBNBN ESLint Config](https://github.com/typescript-eslint/typescript-eslint)

### Rodando a SPA em ambiente de desenvolvimento

1. Clonar este repositório com o comando `git clone`.
2. Rodar o comando `npm install` para instalar as dependências do projeto.
3. Rodar o comando `npm start` para inicializar uma instância em ambiente de desenvolvimento da aplicação.
4. Definir REACT_APP_API_URL em um .env local para acessar a API no ambiente de sua escolha.
5. Acessar a SPA em <http://localhost:3000> para verificar seu funcionamento.

## Linter

Para rodar o ESLint no projeto que verificará instâncias de code smells, use o comando na raiz do projeto:

`npx eslint src/ --ext .js,.jsx,.ts,.tsx`
