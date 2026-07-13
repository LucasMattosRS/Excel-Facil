import type { Cell } from '../types'
import { explicarFormula } from '../lib/formulas'

interface PainelFormulasProps {
  celulas: Record<string, Cell>
}

function PainelFormulas({ celulas }: PainelFormulasProps) {
  const entradas = Object.entries(celulas).filter(
    (entrada): entrada is [string, Required<Pick<Cell, 'formula'>> & Cell] => Boolean(entrada[1].formula),
  )

  if (entradas.length === 0) {
    return null
  }

  return (
    <section className="painel-formulas">
      <h2>O que sua planilha faz</h2>
      <ul>
        {entradas.map(([chave, celula]) => (
          <li key={chave}>
            <strong>{chave}:</strong> {explicarFormula(celula.formula)}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PainelFormulas
