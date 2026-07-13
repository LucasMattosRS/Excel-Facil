import { describe, expect, it } from 'vitest'
import { inserirColuna, inserirLinha, removerColuna, removerLinha } from './estrutura'
import type { Planilha } from '../types'

describe('inserirLinha', () => {
  it('desloca células e referências de fórmula que estão abaixo do ponto de inserção', () => {
    const planilha: Planilha = {
      linhas: 4,
      colunas: 1,
      celulas: {
        A1: { value: 'Título' },
        A2: { value: '10' },
        A3: { value: '20' },
        A4: { formula: { tipo: 'SOMA', inicio: 'A2', fim: 'A3' } },
      },
    }

    const resultado = inserirLinha(planilha, 2) // insere uma linha nova depois da linha 2

    expect(resultado.linhas).toBe(5)
    expect(resultado.celulas.A1).toEqual({ value: 'Título' })
    expect(resultado.celulas.A2).toEqual({ value: '10' })
    expect(resultado.celulas.A3).toBeUndefined()
    expect(resultado.celulas.A4).toEqual({ value: '20' })
    expect(resultado.celulas.A5.formula).toEqual({ tipo: 'SOMA', inicio: 'A2', fim: 'A4' })
  })
})

describe('removerLinha', () => {
  it('desloca células abaixo da linha removida', () => {
    const planilha: Planilha = {
      linhas: 3,
      colunas: 1,
      celulas: {
        A1: { value: 'Título' },
        A2: { value: '10' },
        A3: { value: '20' },
      },
    }

    const resultado = removerLinha(planilha, 2)

    expect(resultado.planilha.linhas).toBe(2)
    expect(resultado.planilha.celulas.A2).toEqual({ value: '20' })
    expect(resultado.planilha.celulas.A3).toBeUndefined()
    expect(resultado.avisos).toEqual([])
  })

  it('encolhe o intervalo de uma fórmula quando a linha removida está dentro dele', () => {
    const planilha: Planilha = {
      linhas: 4,
      colunas: 1,
      celulas: {
        A1: { value: '10' },
        A2: { value: '20' },
        A3: { value: '30' },
        A4: { formula: { tipo: 'SOMA', inicio: 'A1', fim: 'A3' } },
      },
    }

    const resultado = removerLinha(planilha, 2)

    expect(resultado.planilha.celulas.A3.formula).toEqual({ tipo: 'SOMA', inicio: 'A1', fim: 'A2' })
    expect(resultado.avisos).toEqual([])
  })

  it('remove a fórmula e avisa quando o intervalo era de uma única célula, e ela foi removida', () => {
    const planilha: Planilha = {
      linhas: 3,
      colunas: 1,
      celulas: {
        A1: { value: '10' },
        A2: { formula: { tipo: 'SOMA', inicio: 'A1', fim: 'A1' } },
      },
    }

    const resultado = removerLinha(planilha, 1)

    expect(resultado.planilha.celulas.A1?.formula).toBeUndefined()
    expect(resultado.avisos).toHaveLength(1)
    expect(resultado.avisos[0]).toContain('removida')
  })

  it('remove a fórmula inteira quando a própria célula da fórmula é removida', () => {
    const planilha: Planilha = {
      linhas: 3,
      colunas: 1,
      celulas: {
        A1: { value: '10' },
        A2: { value: '20' },
        A3: { formula: { tipo: 'SOMA', inicio: 'A1', fim: 'A2' } },
      },
    }

    const resultado = removerLinha(planilha, 3)

    expect(Object.values(resultado.planilha.celulas).some((celula) => celula.formula)).toBe(false)
  })
})

describe('inserirColuna', () => {
  it('desloca colunas e referências de fórmula à direita do ponto de inserção', () => {
    // a fórmula está na mesma coluna dos dados que soma (B), como o app sempre cria
    const planilha: Planilha = {
      linhas: 3,
      colunas: 2,
      celulas: {
        B1: { value: '10' },
        B2: { value: '20' },
        B3: { formula: { tipo: 'SOMA', inicio: 'B1', fim: 'B2' } },
      },
    }

    const resultado = inserirColuna(planilha, 0) // insere depois da coluna A

    expect(resultado.colunas).toBe(3)
    expect(resultado.celulas.C1).toEqual({ value: '10' })
    expect(resultado.celulas.C3.formula).toEqual({ tipo: 'SOMA', inicio: 'C1', fim: 'C2' })
  })
})

describe('removerColuna', () => {
  it('desloca colunas à direita da coluna removida e realinha fórmulas', () => {
    const planilha: Planilha = {
      linhas: 3,
      colunas: 3,
      celulas: {
        A1: { value: 'lixo' },
        C1: { value: '10' },
        C2: { value: '20' },
        C3: { formula: { tipo: 'SOMA', inicio: 'C1', fim: 'C2' } },
      },
    }

    const resultado = removerColuna(planilha, 0) // remove a coluna A

    expect(resultado.planilha.colunas).toBe(2)
    expect(resultado.planilha.celulas.B1).toEqual({ value: '10' })
    expect(resultado.planilha.celulas.B3.formula).toEqual({ tipo: 'SOMA', inicio: 'B1', fim: 'B2' })
    expect(resultado.avisos).toEqual([])
  })

  it('remove a fórmula inteira quando a própria coluna da fórmula é removida', () => {
    const planilha: Planilha = {
      linhas: 2,
      colunas: 2,
      celulas: {
        A1: { value: '10' },
        A2: { value: '20' },
        B1: { formula: { tipo: 'SOMA', inicio: 'A1', fim: 'A2' } },
      },
    }

    const resultado = removerColuna(planilha, 1) // remove a coluna B, onde está a fórmula

    expect(Object.values(resultado.planilha.celulas).some((celula) => celula.formula)).toBe(false)
  })
})
