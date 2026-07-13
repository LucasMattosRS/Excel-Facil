import { useState, type CSSProperties } from 'react'
import type { Cell, Planilha } from './types'
import { argbParaCss, calcularFormula, numeroParaLetra, partesDaChave } from './lib/formulas'
import { formatarDataBr, formatarMoeda, parseDataBr } from './lib/formatos'

interface GridProps {
  planilha: Planilha
  onEditarCelula: (chave: string, novoValor: string) => void
  modoSelecao: boolean
  celulaInicioSelecao: string | null
  onClicarCelula: (chave: string) => void
  celulaAtiva: string | null
  onSelecionarCelulaAtiva: (chave: string) => void
}

function Grid({
  planilha,
  onEditarCelula,
  modoSelecao,
  celulaInicioSelecao,
  onClicarCelula,
  celulaAtiva,
  onSelecionarCelulaAtiva,
}: GridProps) {
  const [celulaComFoco, setCelulaComFoco] = useState<string | null>(null)

  const linhas = Array.from({ length: planilha.linhas }, (_, i) => i + 1)
  const colunas = Array.from({ length: planilha.colunas }, (_, i) => i)
  const partesAtiva = celulaAtiva ? partesDaChave(celulaAtiva) : null
  const gradeVazia = Object.keys(planilha.celulas).length === 0

  return (
    <table className="grade">
      <thead>
        <tr>
          <th className="cabecalho-canto" />
          {colunas.map((indiceColuna) => {
            const letra = numeroParaLetra(indiceColuna)
            const ativo = partesAtiva?.coluna === letra
            return (
              <th key={letra} className={ativo ? 'cabecalho-coluna cabecalho-ativo' : 'cabecalho-coluna'}>
                {letra}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {gradeVazia && (
          <tr>
            <td className="dica-vazia" colSpan={planilha.colunas + 1}>
              Clique numa célula para digitar
            </td>
          </tr>
        )}

        {linhas.map((numeroLinha) => (
          <tr key={numeroLinha}>
            <th className={partesAtiva?.linha === numeroLinha ? 'cabecalho-linha cabecalho-ativo' : 'cabecalho-linha'}>
              {numeroLinha}
            </th>
            {colunas.map((indiceColuna) => {
              const letra = numeroParaLetra(indiceColuna)
              const chave = `${letra}${numeroLinha}`
              const celula = planilha.celulas[chave]
              const temFormula = Boolean(celula?.formula)
              const editandoAgora = celulaComFoco === chave && !modoSelecao && !temFormula

              const valorExibido = calcularValorExibido(celula, planilha, editandoAgora)

              const estilo: CSSProperties = {
                fontWeight: celula?.style?.negrito ? 'bold' : 'normal',
                backgroundColor: celula?.style?.corFundo ? argbParaCss(celula.style.corFundo) : undefined,
              }

              const selecionada = chave === celulaInicioSelecao || (chave === celulaAtiva && !modoSelecao)

              return (
                <td
                  key={chave}
                  onClick={() => modoSelecao && onClicarCelula(chave)}
                  className={['celula', modoSelecao && 'celula-selecionavel', selecionada && 'celula-selecionada']
                    .filter(Boolean)
                    .join(' ')}
                  style={estilo}
                >
                  <input
                    value={valorExibido}
                    readOnly={modoSelecao || temFormula}
                    onFocus={() => {
                      onSelecionarCelulaAtiva(chave)
                      setCelulaComFoco(chave)
                    }}
                    onBlur={() => setCelulaComFoco((atual) => (atual === chave ? null : atual))}
                    onChange={(e) => onEditarCelula(chave, e.target.value)}
                  />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function calcularValorExibido(celula: Cell | undefined, planilha: Planilha, editandoAgora: boolean): string {
  if (celula?.formula) {
    const resultado = calcularFormula(celula.formula, planilha.celulas)
    return celula.style?.formato === 'MOEDA' ? formatarMoeda(resultado) : String(resultado)
  }

  if (editandoAgora) {
    return celula?.value ?? ''
  }

  if (celula?.style?.formato === 'MOEDA' && celula.value) {
    const numero = Number(celula.value)
    return Number.isNaN(numero) ? celula.value : formatarMoeda(numero)
  }

  if (celula?.style?.formato === 'DATA' && celula.value) {
    const data = parseDataBr(celula.value)
    return data ? formatarDataBr(data) : celula.value
  }

  return celula?.value ?? ''
}

export default Grid
