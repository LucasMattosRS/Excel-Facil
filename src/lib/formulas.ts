import type { Cell, Formula, TipoFormula } from '../types'

const NOME_PT: Record<TipoFormula, string> = {
  SOMA: 'soma os valores de',
  MEDIA: 'calcula a média dos valores de',
  CONT_VALORES: 'conta quantos valores existem entre',
  MAXIMO: 'encontra o maior valor entre',
  MINIMO: 'encontra o menor valor entre',
}

const NOME_EXCEL: Record<TipoFormula, string> = {
  SOMA: 'SUM',
  MEDIA: 'AVERAGE',
  CONT_VALORES: 'COUNT',
  MAXIMO: 'MAX',
  MINIMO: 'MIN',
}

export function numeroParaLetra(indice: number): string {
  return String.fromCharCode(65 + indice)
}

export function letraParaIndice(letra: string): number {
  return letra.charCodeAt(0) - 65
}

export function partesDaChave(chave: string): { coluna: string; linha: number } {
  const coluna = chave.match(/[A-Z]+/)?.[0] ?? ''
  const linha = Number(chave.match(/\d+/)?.[0])
  return { coluna, linha }
}

export function argbParaCss(argb: string): string {
  return `#${argb.slice(2)}`
}

export function formulaParaExcel(formula: Formula): string {
  return `${NOME_EXCEL[formula.tipo]}(${formula.inicio}:${formula.fim})`
}

export function explicarFormula(formula: Formula): string {
  return `${NOME_PT[formula.tipo]} ${formula.inicio} até ${formula.fim}`
}

function obterValoresDoIntervalo(inicio: string, fim: string, celulas: Record<string, Cell>): number[] {
  const { coluna, linha: linhaInicio } = partesDaChave(inicio)
  const { linha: linhaFim } = partesDaChave(fim)

  const valores: number[] = []
  for (let linha = linhaInicio; linha <= linhaFim; linha++) {
    const valorBruto = celulas[`${coluna}${linha}`]?.value
    const numero = Number(valorBruto)
    if (valorBruto !== undefined && valorBruto !== '' && !Number.isNaN(numero)) {
      valores.push(numero)
    }
  }
  return valores
}

export function intervaloTemTexto(inicio: string, fim: string, celulas: Record<string, Cell>): boolean {
  const { coluna, linha: linhaInicio } = partesDaChave(inicio)
  const { linha: linhaFim } = partesDaChave(fim)

  for (let linha = linhaInicio; linha <= linhaFim; linha++) {
    const valorBruto = celulas[`${coluna}${linha}`]?.value
    if (valorBruto !== undefined && valorBruto !== '' && Number.isNaN(Number(valorBruto))) {
      return true
    }
  }
  return false
}

export function calcularFormula(formula: Formula, celulas: Record<string, Cell>): number {
  const valores = obterValoresDoIntervalo(formula.inicio, formula.fim, celulas)

  switch (formula.tipo) {
    case 'SOMA':
      return valores.reduce((total, n) => total + n, 0)
    case 'MEDIA':
      return valores.length === 0 ? 0 : valores.reduce((total, n) => total + n, 0) / valores.length
    case 'CONT_VALORES':
      return valores.length
    case 'MAXIMO':
      return valores.length === 0 ? 0 : Math.max(...valores)
    case 'MINIMO':
      return valores.length === 0 ? 0 : Math.min(...valores)
  }
}
