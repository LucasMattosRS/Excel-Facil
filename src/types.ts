export type TipoFormula = 'SOMA' | 'MEDIA' | 'CONT_VALORES' | 'MAXIMO' | 'MINIMO'
export type TipoFormato = 'MOEDA' | 'DATA'

export interface Formula {
  tipo: TipoFormula
  inicio: string
  fim: string
}

export interface CellStyle {
  negrito?: boolean
  corFundo?: string
  formato?: TipoFormato
}

export interface Cell {
  value?: string
  formula?: Formula
  style?: CellStyle
}

export interface Planilha {
  linhas: number
  colunas: number
  celulas: Record<string, Cell>
}

export type AcaoSelecao =
  | { categoria: 'formula'; tipo: TipoFormula }
  | { categoria: 'formato'; tipo: TipoFormato }
