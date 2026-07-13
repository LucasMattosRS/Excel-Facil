import type { AcaoSelecao, TipoFormato, TipoFormula } from '../types'

interface ToolbarProps {
  acaoAtiva: AcaoSelecao | null
  aguardandoSegundaCelula: boolean
  onFormula: (tipo: TipoFormula) => void
  onFormato: (tipo: TipoFormato) => void
  onNegritoCabecalho: () => void
  onCorCabecalho: () => void
  onAdicionarLinha: () => void
  onRemoverLinha: () => void
  onAdicionarColuna: () => void
  onRemoverColuna: () => void
  onLinhaTotal: () => void
  onDesfazer: () => void
  podeDesfazer: boolean
  onDownload: () => void
  gerandoArquivo: boolean
}

const BOTOES_FORMULA: { tipo: TipoFormula; rotulo: string }[] = [
  { tipo: 'SOMA', rotulo: '➕ Somar valores' },
  { tipo: 'MEDIA', rotulo: '📊 Calcular média' },
  { tipo: 'CONT_VALORES', rotulo: '🔢 Contar valores' },
  { tipo: 'MAXIMO', rotulo: '⬆️ Valor máximo' },
  { tipo: 'MINIMO', rotulo: '⬇️ Valor mínimo' },
]

const BOTOES_FORMATO: { tipo: TipoFormato; rotulo: string }[] = [
  { tipo: 'MOEDA', rotulo: '💰 Formatar como moeda' },
  { tipo: 'DATA', rotulo: '📅 Formatar como data' },
]

function Toolbar({
  acaoAtiva,
  aguardandoSegundaCelula,
  onFormula,
  onFormato,
  onNegritoCabecalho,
  onCorCabecalho,
  onAdicionarLinha,
  onRemoverLinha,
  onAdicionarColuna,
  onRemoverColuna,
  onLinhaTotal,
  onDesfazer,
  podeDesfazer,
  onDownload,
  gerandoArquivo,
}: ToolbarProps) {
  return (
    <aside className="toolbar">
      <div className="botoes">
        <button onClick={onDesfazer} disabled={!podeDesfazer}>
          ↩️ Desfazer
        </button>
      </div>

      <h2>Fórmulas</h2>
      <div className="botoes">
        {BOTOES_FORMULA.map((botao) => (
          <button
            key={botao.tipo}
            onClick={() => onFormula(botao.tipo)}
            className={acaoAtiva?.categoria === 'formula' && acaoAtiva.tipo === botao.tipo ? 'ativo' : undefined}
          >
            {botao.rotulo}
          </button>
        ))}
      </div>

      {acaoAtiva && (
        <p className="instrucao">
          {aguardandoSegundaCelula
            ? 'Agora clique na última célula do intervalo.'
            : 'Clique na primeira célula do intervalo (na mesma coluna).'}
        </p>
      )}

      <h2>Formatação</h2>
      <div className="botoes">
        <button onClick={onNegritoCabecalho}>🔤 Negrito no cabeçalho</button>
        <button onClick={onCorCabecalho}>🎨 Colorir cabeçalho</button>
        {BOTOES_FORMATO.map((botao) => (
          <button
            key={botao.tipo}
            onClick={() => onFormato(botao.tipo)}
            className={acaoAtiva?.categoria === 'formato' && acaoAtiva.tipo === botao.tipo ? 'ativo' : undefined}
          >
            {botao.rotulo}
          </button>
        ))}
      </div>

      <h2>Estrutura da tabela</h2>
      <div className="botoes">
        <button onClick={onAdicionarLinha}>➕ Adicionar linha</button>
        <button onClick={onRemoverLinha}>➖ Remover linha</button>
        <button onClick={onAdicionarColuna}>➕ Adicionar coluna</button>
        <button onClick={onRemoverColuna}>➖ Remover coluna</button>
        <button onClick={onLinhaTotal}>Σ Adicionar linha de total</button>
      </div>

      <h2>Arquivo</h2>
      <div className="botoes">
        <button className="botao-principal" onClick={onDownload} disabled={gerandoArquivo}>
          {gerandoArquivo ? 'Gerando arquivo...' : '⬇️ Baixar Excel'}
        </button>
      </div>
    </aside>
  )
}

export default Toolbar
