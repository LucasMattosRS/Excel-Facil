## Escopo ativo — v1.5 (em desenvolvimento)

### Grade estilo Excel (pedagógica)
- Cabeçalhos de coluna com letras (A, B, C...) e números de linha (1, 2, 3...)
  fora da área editável, visual cinza claro igual ao Excel real
- Ao selecionar uma célula, destacar a letra da coluna E o número da linha,
  e mostrar indicador acima da grade: "B4 — coluna B, linha 4"
- Célula com fórmula mostra o valor calculado na grade; ao selecionar,
  exibe a explicação em português abaixo da grade

### Novas ações
- Formatar como moeda (R$ brasileiro, ex: R$ 450,00) — formato numérico real
  no xlsx, não texto
- Formatar como data (dd/mm/aaaa)
- Adicionar/remover linha e coluna em tabela já criada
- "Adicionar linha de total": insere linha final com SOMA automática em cada
  coluna numérica

### Robustez e confiança do usuário
- Desfazer (Ctrl+Z + botão visível) — histórico de snapshots do estado
- Proteção contra perda: aviso beforeunload + estado salvo em sessionStorage
  (sobrevive a F5)
- Fórmulas com casos tortos: ignorar células de texto em SOMA/MÉDIA (como o
  Excel faz) e avisar de forma amigável ("algumas células têm texto e não
  entraram na conta"); intervalo vazio não quebra
- Estado vazio: dica dentro da grade recém-criada ("Clique numa célula para
  digitar")

## Roadmap (NÃO implementar sem o Lucas pedir)
- **v2:** porcentagem do total, SE assistido (frases prontas), ordenar
  (A-Z, maior-menor), formatação condicional simples ("pintar de vermelho
  valores negativos")
- **v3:** gráficos simples (pizza, barras)
- **Distante:** inserir imagens, múltiplas abas, importar Excel existente,
  copiar/colar, seleção por arraste