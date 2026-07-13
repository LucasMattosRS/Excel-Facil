import { describe, expect, it } from 'vitest'
import { calcularFormula, explicarFormula, formulaParaExcel, intervaloTemTexto, partesDaChave } from './formulas'
import type { Cell } from '../types'

const celulas: Record<string, Cell> = {
  B2: { value: '10' },
  B3: { value: '20' },
  B4: { value: '30' },
}

describe('calcularFormula', () => {
  it('soma os valores do intervalo', () => {
    const resultado = calcularFormula({ tipo: 'SOMA', inicio: 'B2', fim: 'B4' }, celulas)
    expect(resultado).toBe(60)
  })

  it('calcula a média do intervalo', () => {
    const resultado = calcularFormula({ tipo: 'MEDIA', inicio: 'B2', fim: 'B4' }, celulas)
    expect(resultado).toBe(20)
  })

  it('conta apenas células preenchidas com número válido', () => {
    const comCelulaVazia: Record<string, Cell> = { ...celulas, B5: { value: '' } }
    const resultado = calcularFormula({ tipo: 'CONT_VALORES', inicio: 'B2', fim: 'B5' }, comCelulaVazia)
    expect(resultado).toBe(3)
  })

  it('encontra o máximo e o mínimo', () => {
    expect(calcularFormula({ tipo: 'MAXIMO', inicio: 'B2', fim: 'B4' }, celulas)).toBe(30)
    expect(calcularFormula({ tipo: 'MINIMO', inicio: 'B2', fim: 'B4' }, celulas)).toBe(10)
  })

  it('retorna 0 quando o intervalo não tem valores numéricos', () => {
    const resultado = calcularFormula({ tipo: 'SOMA', inicio: 'C2', fim: 'C4' }, celulas)
    expect(resultado).toBe(0)
  })

  it('ignora células de texto misturadas com números, como o Excel faz', () => {
    const comTexto: Record<string, Cell> = { B2: { value: '10' }, B3: { value: 'abacaxi' }, B4: { value: '30' } }
    expect(calcularFormula({ tipo: 'SOMA', inicio: 'B2', fim: 'B4' }, comTexto)).toBe(40)
    expect(calcularFormula({ tipo: 'MEDIA', inicio: 'B2', fim: 'B4' }, comTexto)).toBe(20)
    expect(calcularFormula({ tipo: 'CONT_VALORES', inicio: 'B2', fim: 'B4' }, comTexto)).toBe(2)
  })

  it('não quebra com um intervalo de uma célula só', () => {
    expect(calcularFormula({ tipo: 'SOMA', inicio: 'B2', fim: 'B2' }, celulas)).toBe(10)
    expect(calcularFormula({ tipo: 'MEDIA', inicio: 'B2', fim: 'B2' }, celulas)).toBe(10)
  })

  it('não quebra com um intervalo totalmente vazio', () => {
    expect(calcularFormula({ tipo: 'SOMA', inicio: 'Z2', fim: 'Z5' }, {})).toBe(0)
    expect(calcularFormula({ tipo: 'MEDIA', inicio: 'Z2', fim: 'Z5' }, {})).toBe(0)
    expect(calcularFormula({ tipo: 'MAXIMO', inicio: 'Z2', fim: 'Z5' }, {})).toBe(0)
    expect(calcularFormula({ tipo: 'MINIMO', inicio: 'Z2', fim: 'Z5' }, {})).toBe(0)
    expect(calcularFormula({ tipo: 'CONT_VALORES', inicio: 'Z2', fim: 'Z5' }, {})).toBe(0)
  })
})

describe('intervaloTemTexto', () => {
  it('detecta quando há células de texto no meio de números', () => {
    const comTexto: Record<string, Cell> = { B2: { value: '10' }, B3: { value: 'abacaxi' } }
    expect(intervaloTemTexto('B2', 'B3', comTexto)).toBe(true)
  })

  it('retorna falso quando o intervalo só tem números ou está vazio', () => {
    expect(intervaloTemTexto('B2', 'B4', celulas)).toBe(false)
    expect(intervaloTemTexto('Z2', 'Z5', {})).toBe(false)
  })
})

describe('formulaParaExcel', () => {
  it('traduz a fórmula para a sintaxe do Excel em inglês', () => {
    expect(formulaParaExcel({ tipo: 'SOMA', inicio: 'B2', fim: 'B4' })).toBe('SUM(B2:B4)')
    expect(formulaParaExcel({ tipo: 'MEDIA', inicio: 'B2', fim: 'B4' })).toBe('AVERAGE(B2:B4)')
  })
})

describe('explicarFormula', () => {
  it('gera uma explicação em português simples', () => {
    const texto = explicarFormula({ tipo: 'SOMA', inicio: 'B2', fim: 'B4' })
    expect(texto).toContain('B2')
    expect(texto).toContain('B4')
  })
})

describe('partesDaChave', () => {
  it('separa coluna e linha de uma referência de célula', () => {
    expect(partesDaChave('B12')).toEqual({ coluna: 'B', linha: 12 })
  })
})
