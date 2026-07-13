import type { Planilha } from '../types'

export interface Template {
  nome: string
  descricao: string
  planilha: Planilha
}

const CORFUNDO_CABECALHO = 'FFBFDBFE'

export const templates: Template[] = [
  {
    nome: 'Controle de gastos mensais',
    descricao: 'Lista de despesas com soma automática do total no final',
    planilha: {
      linhas: 7,
      colunas: 2,
      celulas: {
        A1: { value: 'Descrição', style: { negrito: true, corFundo: CORFUNDO_CABECALHO } },
        B1: { value: 'Valor (R$)', style: { negrito: true, corFundo: CORFUNDO_CABECALHO } },
        A2: { value: 'Aluguel' },
        B2: { value: '1200' },
        A3: { value: 'Mercado' },
        B3: { value: '600' },
        A4: { value: 'Transporte' },
        B4: { value: '250' },
        A6: { value: 'Total', style: { negrito: true } },
        B6: { formula: { tipo: 'SOMA', inicio: 'B2', fim: 'B4' } },
      },
    },
  },
  {
    nome: 'Lista de compras',
    descricao: 'Itens, quantidade e preço, pronta para preencher',
    planilha: {
      linhas: 8,
      colunas: 3,
      celulas: {
        A1: { value: 'Item', style: { negrito: true, corFundo: CORFUNDO_CABECALHO } },
        B1: { value: 'Quantidade', style: { negrito: true, corFundo: CORFUNDO_CABECALHO } },
        C1: { value: 'Preço (R$)', style: { negrito: true, corFundo: CORFUNDO_CABECALHO } },
      },
    },
  },
]
