import { useState } from 'react'

const CHAVE_PIX = '321c3722-4108-412e-86e1-c593daec0aba'
const URL_GITHUB = 'https://github.com/LucasMattosRS/Excel-Facil'
const URL_LINKEDIN = 'https://www.linkedin.com/in/lucas-mattos-15a32b20b'

function Footer() {
  const [copiado, setCopiado] = useState(false)

  async function copiarChavePix() {
    await navigator.clipboard.writeText(CHAVE_PIX)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <footer className="rodape">
      <div className="rodape-links">
        <a href={URL_GITHUB} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <button className="link-pix" onClick={copiarChavePix}>
          {copiado ? 'Chave Pix copiada!' : '💚 Apoiar via Pix'}
        </button>
      </div>
      <p className="rodape-autor">
        Feito por{' '}
        <a href={URL_LINKEDIN} target="_blank" rel="noreferrer">
          Lucas
        </a>
      </p>
    </footer>
  )
}

export default Footer
