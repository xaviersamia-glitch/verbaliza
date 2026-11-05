# Verbaliza

Aplicação web de apoio ao professor de Língua Portuguesa para a **audiodescrição didática de tirinhas, charges, cartuns e memes** destinados a estudantes cegos e com baixa visão do ensino médio.

Protótipo do produto educacional em desenvolvimento no Mestrado Profissional em Ensino na Temática da Deficiência Visual do Instituto Benjamin Constant (IBC).

## O que a aplicação faz

- Organiza a descrição por quadros (Q1, Q2...) e monta a nota de transcrição no formato do Manual de adaptação de textos para o Sistema Braille do IBC (GEPA, 2025).
- Com um serviço de IA configurado (por exemplo, uma chave gratuita do Google Gemini), gera automaticamente um rascunho da descrição assim que o professor anexa a imagem ou o PDF da atividade; o rascunho sempre passa pela revisão do professor.
- Exige o registro do efeito de sentido que o estudante deve inferir (humor, ironia, crítica), sem explicá-lo na descrição (BNCC, EM13LP14 e EM13LGG103).
- Verifica o roteiro segundo os manuais do IBC: texto verbal transcrito literalmente, ausência de interpretação de emoções, limite de 300 palavras, entre outros critérios, sempre com fonte e página.
- Usa IA apenas como rascunho opcional e mantém a revisão do professor e a validação por consultor com deficiência visual.
- Checklist de acessibilidade (etapa 6): mostra, antes da exportação, se cada etapa foi cumprida. Os itens de planejamento, roteiro, baixa visão e revisão humana são calculados pela aplicação; os itens de entrega (teste com leitor de tela, revisão no Braille Fácil, conferência da versão ampliada, ausência de dados pessoais) são marcados pelo professor. O resultado entra no registro da adaptação.
- Modo pesquisa: guarda a descrição genérica, o rascunho guiado e a versão revisada e gera um pacote de avaliação cega para consultores.

## Como publicar no GitHub Pages

1. Crie um repositório público (por exemplo, `Verbaliza`).
2. Envie todos os arquivos desta pasta, mantendo as subpastas `css` e `js`.
3. Em **Settings → Pages**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
4. O endereço será `https://SEU-USUARIO.github.io/Verbaliza/`.

## Privacidade

Os dados ficam no navegador de quem usa. Nada é enviado a servidores, exceto quando o professor configura um serviço de IA e pede um rascunho, com confirmação prévia.

## Situação

Versão 0.6. Ainda não avaliada com professores, consultores ou estudantes.
