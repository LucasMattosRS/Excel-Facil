# Excel Fácil

Site gratuito e open source que ajuda quem não sabe usar o Excel a montar uma planilha de verdade — direto no navegador, sem instalar nada e sem precisar aprender fórmula nenhuma.

Você monta a tabela clicando, escolhe "somar", "calcular média" etc. apontando as células, e baixa um arquivo `.xlsx` real, com fórmulas vivas e formatação, pronto pra abrir no Excel.

**🔗 Use agora:** [excel-facil.vercel.app](https://excel-facil.vercel.app)

<!-- TODO: gravar um GIF de 15s mostrando criar tabela → somar → baixar → abrir no Excel, salvar em docs/demo.gif e descomentar a linha abaixo -->
<!-- ![Demonstração do Excel Fácil](docs/demo.gif) -->

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

## O que já dá pra fazer

- Criar uma tabela do zero (escolhendo linhas e colunas) ou partir de um modelo pronto (controle de gastos, lista de compras)
- Grade com cara de Excel de verdade: cabeçalhos de coluna (A, B, C...) e linha (1, 2, 3...), com destaque cruzado ao selecionar uma célula e um indicador tipo "B4 — coluna B, linha 4"
- Editar células clicando e digitando
- Fórmulas assistidas por clique, sem digitar nada: **Somar**, **Média**, **Contar valores**, **Máximo**, **Mínimo** — aponta a primeira e a última célula do intervalo e a fórmula é montada sozinha
- Painel "O que sua planilha faz", explicando cada fórmula em português simples; ao selecionar uma célula com fórmula, a explicação também aparece embaixo da grade
- Formatação: negrito e cor no cabeçalho, moeda (R$) e data (dd/mm/aaaa) — no arquivo exportado viram formato numérico/data de verdade, não texto
- Adicionar/remover linha e coluna numa tabela já criada, com fórmulas se ajustando automaticamente (ou sendo removidas com aviso, quando o intervalo que usavam deixa de existir)
- "Adicionar linha de total", somando automaticamente cada coluna numérica
- Desfazer (`Ctrl+Z` ou botão) com histórico de alterações
- Proteção contra perda de trabalho: aviso ao tentar fechar a aba e o estado sobrevive a um F5
- Fórmulas robustas a "casos tortos": texto misturado com números é ignorado (como o Excel faz), com aviso amigável; intervalo vazio ou de uma única célula não quebra nada
- Download do arquivo `.xlsx`, com fórmulas que recalculam se você editar depois no Excel

Fora do escopo por enquanto (fica pra depois): PROCV, SE, formatação condicional, gráficos, login, salvar na nuvem.

## Arquitetura

Projeto 100% frontend — sem backend, sem servidor, roda inteiro no navegador.

- **React + TypeScript + Vite**
- O estado da planilha é um objeto TypeScript simples (`src/types.ts`), fonte única da verdade
- O [exceljs](https://github.com/exceljs/exceljs) só entra na hora de gerar o arquivo (`src/lib/exportarParaXlsx.ts`) — é uma função pura, testada, sem lógica de negócio misturada, e carregada via import dinâmico (só baixa no navegador quando o usuário clica em "Baixar Excel")
- Fórmulas de agregação (soma, média...) ficam em `src/lib/formulas.ts`, também com testes
- Inserir/remover linha e coluna (`src/lib/estrutura.ts`) reindexa células e ajusta ou invalida fórmulas afetadas, também testado

```text
src/
  types.ts                    tipos da planilha (Planilha, Cell, Formula)
  App.tsx                     orquestra telas e estado, histórico de desfazer, sessionStorage
  Grid.tsx                    grade editável, cabeçalhos A/B/C e 1/2/3, seleção de célula
  components/
    TelaInicial.tsx           escolher tamanho ou modelo pronto
    Toolbar.tsx                botões de fórmula, formatação e estrutura da tabela
    PainelFormulas.tsx        explicação das fórmulas em português
    Footer.tsx                 rodapé com GitHub, doação e autor
  lib/
    formulas.ts                cálculo, tradução e explicação das fórmulas
    formatos.ts                 formatação de moeda e data (pt-BR)
    estrutura.ts                inserir/remover linha e coluna
    exportarParaXlsx.ts        gera o arquivo .xlsx (exceljs)
    templates.ts               modelos prontos
```

## Contribuindo

Ideias, correções e PRs são bem-vindos. Se quiser sugerir uma feature nova, abre uma issue explicando o problema que ela resolve — o foco da v1 é ficar simples pra quem nunca usou Excel, então prioridade #1 é sempre simplicidade antes de recurso novo.

## Apoiar o projeto

Se esse projeto te ajudou, um Pix é bem-vindo — mas é totalmente opcional, o projeto continua livre e gratuito de qualquer forma. Chave Pix (aleatória):

```text
321c3722-4108-412e-86e1-c593daec0aba
```

Também dá pra apoiar direto pelo botão "💚 Apoiar via Pix" no rodapé do [site](https://excel-facil.vercel.app).

## Licença

[MIT](LICENSE) — use, copie, modifique e distribua à vontade, inclusive em projetos comerciais, mantendo o aviso de copyright.
