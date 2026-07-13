import { describe, expect, it } from 'vitest'
import { formatarDataBr, formatarMoeda, parseDataBr } from './formatos'

function semEspacosEspeciais(texto: string): string {
  return texto.replace(/[  ]/g, ' ')
}

describe('formatarMoeda', () => {
  it('formata número como moeda brasileira', () => {
    expect(semEspacosEspeciais(formatarMoeda(450))).toBe('R$ 450,00')
    expect(semEspacosEspeciais(formatarMoeda(1234.5))).toBe('R$ 1.234,50')
  })
})

describe('parseDataBr', () => {
  it('interpreta uma data no formato dd/mm/aaaa', () => {
    const data = parseDataBr('13/07/2026')
    expect(data).not.toBeNull()
    expect(data?.getDate()).toBe(13)
    expect(data?.getMonth()).toBe(6)
    expect(data?.getFullYear()).toBe(2026)
  })

  it('retorna null para datas inválidas ou fora do formato', () => {
    expect(parseDataBr('32/13/2026')).toBeNull()
    expect(parseDataBr('2026-07-13')).toBeNull()
    expect(parseDataBr('não é data')).toBeNull()
  })
})

describe('formatarDataBr', () => {
  it('formata uma data como dd/mm/aaaa com zero à esquerda', () => {
    expect(formatarDataBr(new Date(2026, 0, 5))).toBe('05/01/2026')
  })
})
