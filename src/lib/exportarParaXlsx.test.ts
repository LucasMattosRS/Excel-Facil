import ExcelJS from 'exceljs'
import { describe, expect, it } from 'vitest'
import { exportarParaXlsx } from './exportarParaXlsx'
import type { Planilha } from '../types'

async function lerPrimeiraPlanilha(blob: Blob) {
  const buffer = await blob.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  return workbook.worksheets[0]
}

describe('exportarParaXlsx', () => {
  it('escreve valores numéricos e de texto nas células corretas', async () => {
    const planilha: Planilha = {
      linhas: 2,
      colunas: 2,
      celulas: {
        A1: { value: 'Nome' },
        B1: { value: '42' },
      },
    }

    const planilhaExcel = await lerPrimeiraPlanilha(await exportarParaXlsx(planilha))

    expect(planilhaExcel.getCell('A1').value).toBe('Nome')
    expect(planilhaExcel.getCell('B1').value).toBe(42)
  })

  it('escreve fórmulas usando a sintaxe em inglês do Excel', async () => {
    const planilha: Planilha = {
      linhas: 3,
      colunas: 1,
      celulas: {
        A1: { value: '10' },
        A2: { value: '20' },
        A3: { formula: { tipo: 'SOMA', inicio: 'A1', fim: 'A2' } },
      },
    }

    const planilhaExcel = await lerPrimeiraPlanilha(await exportarParaXlsx(planilha))
    const celulaFormula = planilhaExcel.getCell('A3').value

    expect(celulaFormula).toMatchObject({ formula: 'SUM(A1:A2)' })
  })

  it('aplica negrito e cor de fundo quando definidos no estilo', async () => {
    const planilha: Planilha = {
      linhas: 1,
      colunas: 1,
      celulas: {
        A1: { value: 'Total', style: { negrito: true, corFundo: 'FFBFDBFE' } },
      },
    }

    const planilhaExcel = await lerPrimeiraPlanilha(await exportarParaXlsx(planilha))
    const celula = planilhaExcel.getCell('A1')

    expect(celula.font?.bold).toBe(true)
    expect(celula.fill).toMatchObject({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFBFDBFE' },
    })
  })

  it('formata célula de moeda como número real com numFmt de R$, não como texto', async () => {
    const planilha: Planilha = {
      linhas: 1,
      colunas: 1,
      celulas: {
        A1: { value: '450', style: { formato: 'MOEDA' } },
      },
    }

    const planilhaExcel = await lerPrimeiraPlanilha(await exportarParaXlsx(planilha))
    const celula = planilhaExcel.getCell('A1')

    expect(celula.value).toBe(450)
    expect(typeof celula.value).toBe('number')
    expect(celula.numFmt).toBe('"R$" #,##0.00')
  })

  it('mantém a moeda somável quando aplicada a uma célula com fórmula', async () => {
    const planilha: Planilha = {
      linhas: 3,
      colunas: 1,
      celulas: {
        A1: { value: '100' },
        A2: { value: '200' },
        A3: { formula: { tipo: 'SOMA', inicio: 'A1', fim: 'A2' }, style: { formato: 'MOEDA' } },
      },
    }

    const planilhaExcel = await lerPrimeiraPlanilha(await exportarParaXlsx(planilha))
    const celula = planilhaExcel.getCell('A3')

    expect(celula.value).toMatchObject({ formula: 'SUM(A1:A2)' })
    expect(celula.numFmt).toBe('"R$" #,##0.00')
  })

  it('formata célula de data como data real do Excel, não como texto', async () => {
    const planilha: Planilha = {
      linhas: 1,
      colunas: 1,
      celulas: {
        A1: { value: '13/07/2026', style: { formato: 'DATA' } },
      },
    }

    const planilhaExcel = await lerPrimeiraPlanilha(await exportarParaXlsx(planilha))
    const celula = planilhaExcel.getCell('A1')

    expect(celula.value).toBeInstanceOf(Date)
    expect((celula.value as Date).getFullYear()).toBe(2026)
    expect((celula.value as Date).getMonth()).toBe(6)
    expect((celula.value as Date).getDate()).toBe(13)
    expect(celula.numFmt).toBe('dd/mm/yyyy')
  })

  it('não quebra quando a data digitada é inválida, mantém como texto', async () => {
    const planilha: Planilha = {
      linhas: 1,
      colunas: 1,
      celulas: {
        A1: { value: 'não é uma data', style: { formato: 'DATA' } },
      },
    }

    const planilhaExcel = await lerPrimeiraPlanilha(await exportarParaXlsx(planilha))
    const celula = planilhaExcel.getCell('A1')

    expect(celula.value).toBe('não é uma data')
    expect(celula.numFmt).toBe('dd/mm/yyyy')
  })
})
