# Excel Fácil

Site gratuito e open source que ajuda quem não sabe usar o Excel a montar uma planilha de verdade — direto no navegador, sem instalar nada e sem precisar aprender fórmula nenhuma.

Você monta a tabela clicando, escolhe "somar", "calcular média" etc. apontando as células, e baixa um arquivo `.xlsx` real, com fórmulas vivas e formatação, pronto pra abrir no Excel.

## Por que existe

O Excel tem um monte de recursos que a maioria das pessoas nunca aprendeu a usar. Este projeto não tenta ensinar o Excel inteiro — ele monta a planilha por você, em linguagem simples, e mostra exatamente o que cada fórmula criada está fazendo.

Sem login, sem coleta de dados, 100% gratuito. Existe uma opção de doação (ver seção abaixo), mas é só apoio opcional — nunca uma barreira.

## Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org/) instalado.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` no navegador.

Outros comandos úteis:

```bash
npm run test     # roda os testes automatizados
npm run build    # gera a versão de produção em dist/
npm run lint     # checagem de estilo/erros com oxlint
```

## O que a v1 faz

- Criar uma tabela do zero, escolhendo o número de linhas e colunas
- Editar células clicando e digitando
- Formatar o cabeçalho (negrito, cor de fundo)
- Fórmulas assistidas por clique, sem digitar nada: **Somar**, **Média**, **Contar valores**, **Máximo**, **Mínimo**
- Painel "O que sua planilha faz", explicando cada fórmula em português simples
- Modelos prontos (controle de gastos, lista de compras)
- Download do arquivo `.xlsx`, com fórmulas que recalculam se você editar depois no Excel

Fora do escopo por enquanto (fica pra depois): PROCV, SE, formatação condicional, gráficos, login, salvar na nuvem.

## Arquitetura

Projeto 100% frontend — sem backend, sem servidor, roda inteiro no navegador.

- **React + TypeScript + Vite**
- O estado da planilha é um objeto TypeScript simples (`src/types.ts`), fonte única da verdade
- O [exceljs](https://github.com/exceljs/exceljs) só entra na hora de gerar o arquivo (`src/lib/exportarParaXlsx.ts`) — é uma função pura, testada, sem lógica de negócio misturada
- Fórmulas de agregação (soma, média...) ficam em `src/lib/formulas.ts`, também com testes

```text
src/
  types.ts                    tipos da planilha (Planilha, Cell, Formula)
  App.tsx                     orquestra telas e estado
  Grid.tsx                    grade editável da planilha
  components/
    TelaInicial.tsx           escolher tamanho ou modelo pronto
    Toolbar.tsx                botões de fórmula e formatação
    PainelFormulas.tsx        explicação das fórmulas em português
  lib/
    formulas.ts                cálculo, tradução e explicação das fórmulas
    exportarParaXlsx.ts        gera o arquivo .xlsx (exceljs)
    templates.ts               modelos prontos
```

## Contribuindo

Ideias, correções e PRs são bem-vindos. Se quiser sugerir uma feature nova, abre uma issue explicando o problema que ela resolve — o foco da v1 é ficar simples pra quem nunca usou Excel, então prioridade #1 é sempre simplicidade antes de recurso novo.

## Apoiar o projeto

Se esse projeto te ajudou, um Pix ou apoio no GitHub Sponsors é bem-vindo — mas é totalmente opcional, o projeto continua livre e gratuito de qualquer forma.
