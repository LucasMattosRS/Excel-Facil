import { useState } from 'react'
import type { Planilha } from '../types'
import { templates } from '../lib/templates'

interface TelaInicialProps {
  onComecar: (linhas: number, colunas: number) => void
  onUsarModelo: (planilha: Planilha) => void
}

function TelaInicial({ onComecar, onUsarModelo }: TelaInicialProps) {
  const [linhas, setLinhas] = useState(5)
  const [colunas, setColunas] = useState(3)

  return (
    <div className="tela-inicial">
      <h1>Excel Fácil</h1>
      <p className="subtitulo">Monte sua planilha sem precisar saber usar o Excel.</p>

      <section className="cartao">
        <h2>Começar do zero</h2>
        <div className="campo-linha">
          <label>
            Linhas
            <input
              type="number"
              min={1}
              max={100}
              value={linhas}
              onChange={(e) => setLinhas(Number(e.target.value))}
            />
          </label>
          <label>
            Colunas
            <input
              type="number"
              min={1}
              max={26}
              value={colunas}
              onChange={(e) => setColunas(Number(e.target.value))}
            />
          </label>
        </div>
        <button className="botao-principal" onClick={() => onComecar(linhas, colunas)}>
          Criar tabela
        </button>
      </section>

      <section className="cartao">
        <h2>Usar um modelo pronto</h2>
        <div className="templates">
          {templates.map((template) => (
            <div key={template.nome} className="template-card">
              <h3>{template.nome}</h3>
              <p>{template.descricao}</p>
              <button onClick={() => onUsarModelo(template.planilha)}>Usar este modelo</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TelaInicial
