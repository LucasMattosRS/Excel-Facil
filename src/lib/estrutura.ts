import type { Cell, Planilha } from '../types'
import { letraParaIndice, numeroParaLetra, partesDaChave } from './formulas'

// As funções de inserir/remover coluna assumem que toda fórmula fica na mesma
// coluna do intervalo que ela soma (é o que aplicarFormula, em App.tsx, sempre
// garante) — por isso reaproveitam a coluna já deslocada da própria célula
// para reescrever `inicio`/`fim`, em vez de recalcular a coluna do intervalo.

export interface ResultadoEstrutura {
  planilha: Planilha
  avisos: string[]
}

function ajustarIntervaloAposRemover(
  inicio: number,
  fim: number,
  removido: number,
): [number, number] | null {
  const min = Math.min(inicio, fim)
  const max = Math.max(inicio, fim)

  if (removido < min) return [min - 1, max - 1]
  if (removido > max) return [min, max]
  if (min === max) return null // intervalo de uma célula só, e ela foi removida

  return [min, max - 1]
}

export function inserirLinha(planilha: Planilha, aposLinha: number): Planilha {
  const novasCelulas: Record<string, Cell> = {}

  for (const [chave, celula] of Object.entries(planilha.celulas)) {
    const { coluna, linha } = partesDaChave(chave)
    const novaLinha = linha > aposLinha ? linha + 1 : linha

    let novaCelula = celula
    if (celula.formula) {
      const inicioLinha = partesDaChave(celula.formula.inicio).linha
      const fimLinha = partesDaChave(celula.formula.fim).linha
      const novoInicio = inicioLinha > aposLinha ? inicioLinha + 1 : inicioLinha
      const novoFim = fimLinha > aposLinha ? fimLinha + 1 : fimLinha
      novaCelula = {
        ...celula,
        formula: { ...celula.formula, inicio: `${coluna}${novoInicio}`, fim: `${coluna}${novoFim}` },
      }
    }

    novasCelulas[`${coluna}${novaLinha}`] = novaCelula
  }

  return { ...planilha, linhas: planilha.linhas + 1, celulas: novasCelulas }
}

export function removerLinha(planilha: Planilha, linhaRemover: number): ResultadoEstrutura {
  const avisos: string[] = []
  const novasCelulas: Record<string, Cell> = {}

  for (const [chave, celula] of Object.entries(planilha.celulas)) {
    const { coluna, linha } = partesDaChave(chave)
    if (linha === linhaRemover) continue

    const novaLinha = linha > linhaRemover ? linha - 1 : linha
    let novaCelula = celula

    if (celula.formula) {
      const ajuste = ajustarIntervaloAposRemover(
        partesDaChave(celula.formula.inicio).linha,
        partesDaChave(celula.formula.fim).linha,
        linhaRemover,
      )
      if (!ajuste) {
        avisos.push(
          `A fórmula da célula ${coluna}${novaLinha} foi removida porque a linha que ela usava não existe mais.`,
        )
        novaCelula = { ...celula, formula: undefined }
      } else {
        novaCelula = {
          ...celula,
          formula: { ...celula.formula, inicio: `${coluna}${ajuste[0]}`, fim: `${coluna}${ajuste[1]}` },
        }
      }
    }

    novasCelulas[`${coluna}${novaLinha}`] = novaCelula
  }

  return {
    planilha: { ...planilha, linhas: Math.max(1, planilha.linhas - 1), celulas: novasCelulas },
    avisos,
  }
}

export function inserirColuna(planilha: Planilha, aposIndiceColuna: number): Planilha {
  const novasCelulas: Record<string, Cell> = {}

  for (const [chave, celula] of Object.entries(planilha.celulas)) {
    const { coluna, linha } = partesDaChave(chave)
    const indice = letraParaIndice(coluna)
    const novoIndice = indice > aposIndiceColuna ? indice + 1 : indice
    const novaColuna = numeroParaLetra(novoIndice)

    let novaCelula = celula
    if (celula.formula) {
      novaCelula = {
        ...celula,
        formula: {
          ...celula.formula,
          inicio: `${novaColuna}${partesDaChave(celula.formula.inicio).linha}`,
          fim: `${novaColuna}${partesDaChave(celula.formula.fim).linha}`,
        },
      }
    }

    novasCelulas[`${novaColuna}${linha}`] = novaCelula
  }

  return { ...planilha, colunas: planilha.colunas + 1, celulas: novasCelulas }
}

export function removerColuna(planilha: Planilha, indiceColunaRemover: number): ResultadoEstrutura {
  const avisos: string[] = []
  const novasCelulas: Record<string, Cell> = {}

  for (const [chave, celula] of Object.entries(planilha.celulas)) {
    const { coluna, linha } = partesDaChave(chave)
    const indice = letraParaIndice(coluna)
    if (indice === indiceColunaRemover) continue

    const novoIndice = indice > indiceColunaRemover ? indice - 1 : indice
    const novaColuna = numeroParaLetra(novoIndice)

    let novaCelula = celula
    if (celula.formula) {
      novaCelula = {
        ...celula,
        formula: {
          ...celula.formula,
          inicio: `${novaColuna}${partesDaChave(celula.formula.inicio).linha}`,
          fim: `${novaColuna}${partesDaChave(celula.formula.fim).linha}`,
        },
      }
    }

    novasCelulas[`${novaColuna}${linha}`] = novaCelula
  }

  return {
    planilha: { ...planilha, colunas: Math.max(1, planilha.colunas - 1), celulas: novasCelulas },
    avisos,
  }
}
