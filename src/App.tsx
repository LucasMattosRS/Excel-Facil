import { useEffect, useState } from 'react'
import type { AcaoSelecao, Planilha, TipoFormato, TipoFormula } from './types'
import Grid from './Grid'
import TelaInicial from './components/TelaInicial'
import Toolbar from './components/Toolbar'
import PainelFormulas from './components/PainelFormulas'
import { exportarParaXlsx } from './lib/exportarParaXlsx'
import { explicarFormula, intervaloTemTexto, numeroParaLetra, partesDaChave, letraParaIndice } from './lib/formulas'
import { inserirColuna, inserirLinha, removerColuna, removerLinha } from './lib/estrutura'
import './App.css'

const CORFUNDO_CABECALHO = 'FFBFDBFE'
const CHAVE_SESSAO = 'excel-facil:planilha'

interface Selecao {
  acao: AcaoSelecao
  inicio: string | null
}

function criarPlanilhaVazia(linhas: number, colunas: number): Planilha {
  return { linhas, colunas, celulas: {} }
}

function carregarPlanilhaDaSessao(): Planilha | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE_SESSAO)
    return bruto ? (JSON.parse(bruto) as Planilha) : null
  } catch {
    return null
  }
}

function App() {
  const [planilha, setPlanilha] = useState<Planilha | null>(carregarPlanilhaDaSessao)
  const [historico, setHistorico] = useState<Planilha[]>([])
  const [selecao, setSelecao] = useState<Selecao | null>(null)
  const [celulaAtiva, setCelulaAtiva] = useState<string | null>(null)
  const [gerandoArquivo, setGerandoArquivo] = useState(false)

  useEffect(() => {
    if (planilha) {
      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(planilha))
    } else {
      sessionStorage.removeItem(CHAVE_SESSAO)
    }
  }, [planilha])

  useEffect(() => {
    if (!planilha) return

    function avisarAntesDeSair(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', avisarAntesDeSair)
    return () => window.removeEventListener('beforeunload', avisarAntesDeSair)
  }, [planilha])

  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        desfazer()
      }
    }

    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  })

  function atualizarPlanilha(atualizador: (atual: Planilha) => Planilha) {
    if (!planilha) return
    setHistorico((h) => [...h, planilha])
    setPlanilha(atualizador(planilha))
  }

  function desfazer() {
    setHistorico((h) => {
      if (h.length === 0) return h
      setPlanilha(h[h.length - 1])
      return h.slice(0, -1)
    })
  }

  function comecarDoZero(linhas: number, colunas: number) {
    setPlanilha(criarPlanilhaVazia(linhas, colunas))
    setHistorico([])
    setCelulaAtiva(null)
  }

  function usarModelo(planilhaModelo: Planilha) {
    setPlanilha(planilhaModelo)
    setHistorico([])
    setCelulaAtiva(null)
  }

  function selecionarCelulaAtiva(chave: string) {
    if (planilha && chave !== celulaAtiva) {
      setHistorico((h) => [...h, planilha])
    }
    setCelulaAtiva(chave)
  }

  function editarCelula(chave: string, novoValor: string) {
    setPlanilha((atual) => {
      if (!atual) return atual
      return {
        ...atual,
        celulas: {
          ...atual.celulas,
          [chave]: { ...atual.celulas[chave], value: novoValor, formula: undefined },
        },
      }
    })
  }

  function iniciarSelecaoFormula(tipo: TipoFormula) {
    setSelecao({ acao: { categoria: 'formula', tipo }, inicio: null })
  }

  function iniciarSelecaoFormato(tipo: TipoFormato) {
    setSelecao({ acao: { categoria: 'formato', tipo }, inicio: null })
  }

  function clicarCelula(chave: string) {
    if (!selecao) return

    if (!selecao.inicio) {
      setSelecao({ ...selecao, inicio: chave })
      return
    }

    if (selecao.acao.categoria === 'formula') {
      aplicarFormula(selecao.acao.tipo, selecao.inicio, chave)
    } else {
      aplicarFormato(selecao.acao.tipo, selecao.inicio, chave)
    }
    setSelecao(null)
  }

  function aplicarFormula(tipo: TipoFormula, inicioChave: string, fimChave: string) {
    if (!planilha) return
    const inicio = partesDaChave(inicioChave)
    const fim = partesDaChave(fimChave)

    if (inicio.coluna !== fim.coluna) {
      alert('Selecione duas células da mesma coluna.')
      return
    }

    const linhaInicio = Math.min(inicio.linha, fim.linha)
    const linhaFim = Math.max(inicio.linha, fim.linha)
    const linhaResultado = linhaFim + 1
    const chaveResultado = `${inicio.coluna}${linhaResultado}`
    const inicioIntervalo = `${inicio.coluna}${linhaInicio}`
    const fimIntervalo = `${inicio.coluna}${linhaFim}`

    if (intervaloTemTexto(inicioIntervalo, fimIntervalo, planilha.celulas)) {
      alert('Algumas células têm texto e não entraram na conta.')
    }

    atualizarPlanilha((atual) => ({
      ...atual,
      linhas: Math.max(atual.linhas, linhaResultado),
      celulas: {
        ...atual.celulas,
        [chaveResultado]: {
          formula: { tipo, inicio: inicioIntervalo, fim: fimIntervalo },
        },
      },
    }))
  }

  function aplicarFormato(tipo: TipoFormato, inicioChave: string, fimChave: string) {
    const inicio = partesDaChave(inicioChave)
    const fim = partesDaChave(fimChave)

    if (inicio.coluna !== fim.coluna) {
      alert('Selecione duas células da mesma coluna.')
      return
    }

    const linhaInicio = Math.min(inicio.linha, fim.linha)
    const linhaFim = Math.max(inicio.linha, fim.linha)

    atualizarPlanilha((atual) => {
      const novasCelulas = { ...atual.celulas }
      for (let linha = linhaInicio; linha <= linhaFim; linha++) {
        const chave = `${inicio.coluna}${linha}`
        novasCelulas[chave] = {
          ...novasCelulas[chave],
          style: { ...novasCelulas[chave]?.style, formato: tipo },
        }
      }
      return { ...atual, celulas: novasCelulas }
    })
  }

  function alternarNegritoCabecalho() {
    atualizarPlanilha((atual) => {
      const colunas = Array.from({ length: atual.colunas }, (_, i) => i)
      const jaEstaNegrito = colunas.every((i) => atual.celulas[`${numeroParaLetra(i)}1`]?.style?.negrito)

      const novasCelulas = { ...atual.celulas }
      for (const i of colunas) {
        const chave = `${numeroParaLetra(i)}1`
        novasCelulas[chave] = {
          ...novasCelulas[chave],
          style: { ...novasCelulas[chave]?.style, negrito: !jaEstaNegrito },
        }
      }

      return { ...atual, celulas: novasCelulas }
    })
  }

  function alternarCorCabecalho() {
    atualizarPlanilha((atual) => {
      const colunas = Array.from({ length: atual.colunas }, (_, i) => i)
      const jaTemCor = colunas.every((i) => atual.celulas[`${numeroParaLetra(i)}1`]?.style?.corFundo)

      const novasCelulas = { ...atual.celulas }
      for (const i of colunas) {
        const chave = `${numeroParaLetra(i)}1`
        novasCelulas[chave] = {
          ...novasCelulas[chave],
          style: { ...novasCelulas[chave]?.style, corFundo: jaTemCor ? undefined : CORFUNDO_CABECALHO },
        }
      }

      return { ...atual, celulas: novasCelulas }
    })
  }

  function adicionarLinha() {
    const aposLinha = celulaAtiva ? partesDaChave(celulaAtiva).linha : (planilha?.linhas ?? 0)
    atualizarPlanilha((atual) => inserirLinha(atual, aposLinha))
  }

  function removerLinhaAtual() {
    if (!celulaAtiva) {
      alert('Clique numa célula da linha que deseja remover.')
      return
    }
    const { linha } = partesDaChave(celulaAtiva)
    atualizarPlanilha((atual) => {
      const resultado = removerLinha(atual, linha)
      if (resultado.avisos.length > 0) {
        alert(resultado.avisos.join('\n'))
      }
      return resultado.planilha
    })
    setCelulaAtiva(null)
  }

  function adicionarColuna() {
    const aposIndice = celulaAtiva
      ? letraParaIndice(partesDaChave(celulaAtiva).coluna)
      : (planilha?.colunas ?? 0) - 1
    atualizarPlanilha((atual) => inserirColuna(atual, aposIndice))
  }

  function removerColunaAtual() {
    if (!celulaAtiva) {
      alert('Clique numa célula da coluna que deseja remover.')
      return
    }
    const indice = letraParaIndice(partesDaChave(celulaAtiva).coluna)
    atualizarPlanilha((atual) => {
      const resultado = removerColuna(atual, indice)
      if (resultado.avisos.length > 0) {
        alert(resultado.avisos.join('\n'))
      }
      return resultado.planilha
    })
    setCelulaAtiva(null)
  }

  function adicionarLinhaTotal() {
    atualizarPlanilha((atual) => {
      const linhaTotal = atual.linhas + 1
      const linhasDeDados = Array.from({ length: Math.max(0, atual.linhas - 1) }, (_, i) => i + 2)
      const novasCelulas = { ...atual.celulas }

      for (let i = 0; i < atual.colunas; i++) {
        const coluna = numeroParaLetra(i)
        const temNumero = linhasDeDados.some((linha) => {
          const valor = atual.celulas[`${coluna}${linha}`]?.value
          return valor !== undefined && valor !== '' && !Number.isNaN(Number(valor))
        })

        if (temNumero) {
          novasCelulas[`${coluna}${linhaTotal}`] = {
            formula: { tipo: 'SOMA', inicio: `${coluna}2`, fim: `${coluna}${atual.linhas}` },
            style: { negrito: true },
          }
        }
      }

      return { ...atual, linhas: linhaTotal, celulas: novasCelulas }
    })
  }

  async function baixarExcel() {
    if (!planilha) return
    setGerandoArquivo(true)
    try {
      const blob = await exportarParaXlsx(planilha)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'planilha.xlsx'
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGerandoArquivo(false)
    }
  }

  if (!planilha) {
    return <TelaInicial onComecar={comecarDoZero} onUsarModelo={usarModelo} />
  }

  const partesCelulaAtiva = celulaAtiva ? partesDaChave(celulaAtiva) : null
  const formulaCelulaAtiva = celulaAtiva ? planilha.celulas[celulaAtiva]?.formula : undefined

  return (
    <div className="app">
      <header>
        <h1>Excel Fácil</h1>
        <button
          className="link-voltar"
          onClick={() => {
            setPlanilha(null)
            setHistorico([])
            setCelulaAtiva(null)
            setSelecao(null)
          }}
        >
          ← Começar outra planilha
        </button>
      </header>

      <div className="editor">
        <Toolbar
          acaoAtiva={selecao?.acao ?? null}
          aguardandoSegundaCelula={Boolean(selecao?.inicio)}
          onFormula={iniciarSelecaoFormula}
          onFormato={iniciarSelecaoFormato}
          onNegritoCabecalho={alternarNegritoCabecalho}
          onCorCabecalho={alternarCorCabecalho}
          onAdicionarLinha={adicionarLinha}
          onRemoverLinha={removerLinhaAtual}
          onAdicionarColuna={adicionarColuna}
          onRemoverColuna={removerColunaAtual}
          onLinhaTotal={adicionarLinhaTotal}
          onDesfazer={desfazer}
          podeDesfazer={historico.length > 0}
          onDownload={baixarExcel}
          gerandoArquivo={gerandoArquivo}
        />

        <div className="area-grade">
          {partesCelulaAtiva && (
            <p className="indicador-celula">
              {celulaAtiva} — coluna {partesCelulaAtiva.coluna}, linha {partesCelulaAtiva.linha}
            </p>
          )}

          <Grid
            planilha={planilha}
            onEditarCelula={editarCelula}
            modoSelecao={Boolean(selecao)}
            celulaInicioSelecao={selecao?.inicio ?? null}
            onClicarCelula={clicarCelula}
            celulaAtiva={celulaAtiva}
            onSelecionarCelulaAtiva={selecionarCelulaAtiva}
          />

          {formulaCelulaAtiva && (
            <p className="explicacao-celula-ativa">Esta célula {explicarFormula(formulaCelulaAtiva)}</p>
          )}

          <PainelFormulas celulas={planilha.celulas} />
        </div>
      </div>
    </div>
  )
}

export default App
