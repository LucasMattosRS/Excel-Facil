import type { Planilha } from '../types'
import { formulaParaExcel } from './formulas'
import { parseDataBr } from './formatos'

const FORMATO_MOEDA = '"R$" #,##0.00'
const FORMATO_DATA = 'dd/mm/yyyy'

export async function exportarParaXlsx(planilha: Planilha): Promise<Blob> {
  // Import dinâmico: o exceljs é pesado e só é necessário no momento do
  // download, então não deve entrar no bundle inicial carregado por todo mundo.
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const planilhaExcel = workbook.addWorksheet('Planilha')

  for (const [chave, celula] of Object.entries(planilha.celulas)) {
    const celulaExcel = planilhaExcel.getCell(chave)

    if (celula.formula) {
      celulaExcel.value = { formula: formulaParaExcel(celula.formula) }
    } else if (celula.style?.formato === 'DATA' && celula.value) {
      const data = parseDataBr(celula.value)
      celulaExcel.value = data ?? celula.value
    } else if (celula.value !== undefined && celula.value !== '') {
      const numero = Number(celula.value)
      celulaExcel.value = Number.isNaN(numero) ? celula.value : numero
    }

    if (celula.style?.formato === 'MOEDA') {
      celulaExcel.numFmt = FORMATO_MOEDA
    } else if (celula.style?.formato === 'DATA') {
      celulaExcel.numFmt = FORMATO_DATA
    }

    if (celula.style?.negrito) {
      celulaExcel.font = { bold: true }
    }

    if (celula.style?.corFundo) {
      celulaExcel.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: celula.style.corFundo },
      }
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}
