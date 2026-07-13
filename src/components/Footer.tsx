import { useState } from 'react'

const CHAVE_PIX = '321c3722-4108-412e-86e1-c593daec0aba'
const URL_GITHUB = 'https://github.com/LucasMattosRS/Excel-Facil'
const URL_LINKEDIN = 'https://www.linkedin.com/in/lucas-mattos-15a32b20b'

function Footer() {
  const [copiado, setCopiado] = useState(false)

  async function copiarChavePix() {
    await navigator.clipboard.writeText(CHAVE_PIX)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <footer className="rodape">
      <div className="rodape-doacao">
        <h2>Gostou do Excel Fácil?</h2>
        <p>
          O projeto é 100% gratuito e sempre vai continuar sendo — sem anúncio, sem login, sem coleta
          de dados. Se ele te ajudou de alguma forma, um Pix (de qualquer valor) é uma forma de dizer
          obrigado e ajudar a manter o projeto no ar.
        </p>
        <button className="botao-principal botao-pix" onClick={copiarChavePix}>
          {copiado ? '✅ Chave Pix copiada!' : '💚 Copiar chave Pix'}
        </button>
      </div>

      <div className="rodape-meta">
        <a href={URL_GITHUB} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className="rodape-separador">·</span>
        <p className="rodape-autor">
          Feito por{' '}
          <a href={URL_LINKEDIN} target="_blank" rel="noreferrer">
            Lucas
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
