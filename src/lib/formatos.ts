export function formatarMoeda(numero: number): string {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function parseDataBr(valor: string): Date | null {
  const partes = valor.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!partes) return null

  const dia = Number(partes[1])
  const mes = Number(partes[2])
  const ano = Number(partes[3])
  const data = new Date(ano, mes - 1, dia)

  const valida = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia
  return valida ? data : null
}

export function formatarDataBr(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}/${data.getFullYear()}`
}
