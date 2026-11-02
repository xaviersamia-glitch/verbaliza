/* =========================================================================
   Verbaliza · Base de referenciais
   Cada regra registra a fonte e a página de onde foi extraída. A aplicação
   não cria critérios próprios sem identificá-los como "critério interno".
   ========================================================================= */
"use strict";

const FONTES = {
  GPEAD: {
    sigla: "GPEAD (2025)",
    ref: "GRUPO DE PESQUISA EM AUDIODESCRIÇÃO (GPEAD). Manual de audiodescrição: como construir roteiros acessíveis. Rio de Janeiro: Instituto Benjamin Constant, 2025. (Coleção Caminhos e Saberes, 9)."
  },
  GEPA: {
    sigla: "GEPA (2025)",
    ref: "GRUPO DE ESTUDO E PESQUISA EM ADAPTAÇÃO (GEPA). Manual de adaptação de textos para o Sistema Braille. 2. ed. rev. e ampl. Rio de Janeiro: Instituto Benjamin Constant, 2025. (Coleção Caminhos e Saberes, 3)."
  },
  AMPLIADO: {
    sigla: "IBC (2025)",
    ref: "INSTITUTO BENJAMIN CONSTANT. Manual de diagramação de textos para produção de livros ampliados. Rio de Janeiro: IBC, 2025. (Coleção Caminhos e Saberes, 12)."
  },
  PERDIGAO: {
    sigla: "Perdigão, Pinto e Ferreira (2025)",
    ref: "PERDIGÃO, Luciana; PINTO, Sérgio; FERREIRA, Caio Dias. Revisão sistemática de literatura sobre uso da inteligência artificial para audiodescrição de imagens da EaD. EaD em Foco, v. 15, n. 2, e2593, 2025. DOI: 10.18264/eadf.v15i2.2593."
  },
  MEC: {
    sigla: "Brasil (2026)",
    ref: "BRASIL. Ministério da Educação. Referencial para desenvolvimento e uso responsáveis de inteligência artificial na educação. Brasília, DF: MEC, 2026."
  },
  BNCC: {
    sigla: "Brasil (2018)",
    ref: "BRASIL. Ministério da Educação. Base Nacional Comum Curricular. Brasília, DF: MEC, 2018. Habilidades de Língua Portuguesa e de Linguagens do ensino médio."
  },
  PNEEI: {
    sigla: "Brasil (2025)",
    ref: "BRASIL. Decreto nº 12.686, de 20 de outubro de 2025. Institui a Política Nacional de Educação Especial Inclusiva e a Rede Nacional de Educação Especial Inclusiva. Brasília, DF: Presidência da República, 2025."
  },
  MEC2010: {
    sigla: "Domingues et al. (2010)",
    ref: "DOMINGUES, Celma dos Anjos et al. A Educação Especial na Perspectiva da Inclusão Escolar: os alunos com deficiência visual: baixa visão e cegueira. Brasília, DF: Ministério da Educação, Secretaria de Educação Especial; Fortaleza: Universidade Federal do Ceará, 2010."
  },
  INTERNO: {
    sigla: "Critério interno do Verbaliza",
    ref: "Critério operacional definido no protótipo para apoiar a revisão. Não corresponde a regra explícita dos manuais e deve ser avaliado na pesquisa."
  }
};

/* Gêneros multimodais de Língua Portuguesa tratados pela aplicação.
   Regras de quadrinhos e memes: GEPA (2025, p. 60-70). */
const TIPOS_IMAGEM = [
  { id: "hq", rotulo: "Tirinha ou história em quadrinhos", inicio: ["tirinha", "história"] },
  { id: "charge", rotulo: "Charge", inicio: ["charge"] },
  { id: "cartum", rotulo: "Cartum", inicio: ["cartum"] },
  { id: "meme", rotulo: "Meme", inicio: ["meme"] }
];

/* Habilidades da BNCC ligadas aos gêneros (textos conferidos no portal bncc.dev) */
const HABILIDADES_BNCC = [
  { id: "EM13LP14", rotulo: "EM13LP14: efeitos de sentido das imagens e de sua relação com o verbal" },
  { id: "EM13LGG103", rotulo: "EM13LGG103: interpretar criticamente discursos em textos de diversas semioses" },
  { id: "EM13LP06", rotulo: "EM13LP06: efeitos de sentido de usos expressivos da linguagem" },
  { id: "EM13LP43", rotulo: "EM13LP43: memes, gifs e textos de opinião em ambientes digitais" },
  { id: "outra", rotulo: "Outra habilidade" }
]

/* Regra comum aos gêneros multimodais */
const REGRAS_MULTIMODAIS = [
  { texto: "Transcrever literalmente, entre aspas, todo o texto verbal da imagem (falas, balões, legendas, placas, onomatopeias).", fonte: ["GEPA", "p. 60; 66"] },
  { texto: "Descrever os recursos iconográficos que produzem o sentido (expressões faciais pelas marcas do rosto, gestos, objetos, tamanho e forma das letras), sem nomear a reação.", fonte: ["GEPA", "p. 60; 69"] },
  { texto: "Não explicar o humor, a ironia ou a crítica: a descrição oferece os elementos para que o próprio estudante faça a inferência pedida pela atividade.", fonte: ["INTERNO", "com base em GEPA (2025, p. 60)"] }
];

/* Estratégias de adaptação (GEPA, 2025, cap. 5 e 6.1) */
const ESTRATEGIAS = {
  suprimir: {
    rotulo: "Suprimir a imagem",
    texto: "A imagem é apenas ilustrativa e não traz informação necessária. Recomenda-se suprimi-la (e também a legenda, quando redundante).",
    fontes: [["GEPA", "p. 32"]]
  },
  sucinta_legenda: {
    rotulo: "Descrever sucintamente para transcrever a legenda",
    texto: "A imagem é ilustrativa, mas a legenda contém informação relevante que não está no texto. Descreva a imagem de forma sucinta para que a legenda seja transcrita.",
    fontes: [["GEPA", "p. 33-34"]]
  },
  descricao_didatica: {
    rotulo: "Descrição com finalidade pedagógica",
    texto: "A descrição deve se concentrar no que a atividade exige. A mesma imagem pode receber descrições diferentes conforme a atividade proposta; informações desnecessárias dificultam a compreensão.",
    fontes: [["GEPA", "p. 23-25"]]
  },
  alterar_forma: {
    rotulo: "Alterar a forma original",
    texto: "Substitua a representação por outra forma que preserve os dados (por exemplo, gráfico de setores em tabela). Informe a alteração na nota de transcrição.",
    fontes: [["GEPA", "p. 25"], ["GEPA", "p. 73"]]
  },
  ajustar: {
    rotulo: "Ajustar a imagem ou o mapa",
    texto: "Mantenha a forma original com ajustes (por exemplo, legendas informativas criadas pelo adaptador dentro da nota de transcrição, mudança de sentido para leitura da esquerda para a direita).",
    fontes: [["GEPA", "p. 27-30"]]
  },
  mista: {
    rotulo: "Adaptação mista",
    texto: "Combine estratégias, por exemplo, breve descrição seguida de alteração da forma original.",
    fontes: [["GEPA", "p. 30"]]
  },
  nao_adaptada: {
    rotulo: "Indicar [não adaptada]",
    texto: "Quando não for possível ou necessário adaptar uma imagem mencionada no texto, use a nota [não adaptada] logo após a menção.",
    fontes: [["GEPA", "p. 49"]]
  },
  peca_orientacao: {
    rotulo: "Indicar [Peça orientação]",
    texto: "Quando não houver possibilidade de adaptação da atividade, transcreva o enunciado e acrescente ao fim a expressão Peça orientação.",
    fontes: [["GEPA", "p. 37-38"]]
  }
};

/* Regras específicas por tipo (GEPA, 2025, 6.2) */
const REGRAS_POR_TIPO = {
  mapa: [
    { texto: "A nota de transcrição começa pela denominação do gênero: [Mapa \"título\" (se houver)...].", fonte: ["GEPA", "p. 52"] },
    { texto: "O conteúdo do mapa pode ser apresentado de forma linear, dividido em partes.", fonte: ["GEPA", "p. 52"] }
  ],
  grafico: [
    { texto: "Adaptar em tabela quando não for possível reproduzir o gráfico.", fonte: ["GEPA", "p. 73"] },
    { texto: "Gráficos de setores, barras e linhas podem ser convertidos em tabela; a inversão de eixos é admitida quando facilita a leitura.", fonte: ["GEPA", "p. 73-81"] }
  ],
  tabela: [
    { texto: "Tabelas com títulos pequenos e grandes recebem tratamentos distintos de diagramação; confira o exemplo do manual antes da transcrição.", fonte: ["GEPA", "p. 83-85"] }
  ],
  hq: [
    { texto: "Nota de transcrição: [História/Tirinha \"título\" em x quadrinhos:...], com Q1, Q2, Q3 para cada quadrinho.", fonte: ["GEPA", "p. 60"] },
    { texto: "Semblantes: indicar as marcas de expressão do rosto, sem nomear a reação a ser interpretada (dúvida, susto, alegria, tristeza).", fonte: ["GEPA", "p. 60"] },
    { texto: "Usar palavras em sentido literal, denotativo.", fonte: ["GEPA", "p. 60"] },
    { texto: "Quando houver narrador, inserir após o número do quadrinho: O narrador diz: seguido da fala.", fonte: ["GEPA", "p. 64"] },
    { texto: "Citar os personagens e as características importantes e descrever o cenário e o tempo.", fonte: ["GPEAD", "p. 21"] },
    { texto: "Informar a intenção da fala pelo formato do balão: linha contínua indica fala em tom neutro; linha tracejada, sussurro; forma de nuvem, pensamento; traços pontiagudos, grito. Use o verbo correspondente (fala, sussurra, pensa, grita).", fonte: ["GPEAD", "p. 21-22"] },
    { texto: "Descrever os símbolos gráficos característicos dos quadrinhos presentes na imagem.", fonte: ["GPEAD", "p. 22"] }
  ],
  charge: [
    { texto: "Aplicam-se, por analogia, as orientações para quadrinhos: marcas de expressão sem interpretação e linguagem denotativa.", fonte: ["GEPA", "p. 60"] },
    { texto: "A charge remete a um fato de seu tempo. Registre o contexto que o estudante precisa conhecer; ele pode entrar na nota introdutória, separado da descrição.", fonte: ["GPEAD", "p. 17-18"] },
    { texto: "Se houver balões, informar a intenção da fala pelo formato do balão (fala, sussurra, pensa, grita).", fonte: ["GPEAD", "p. 21-22"] }
  ],
  cartum: [
    { texto: "Aplicam-se, por analogia, as orientações para quadrinhos: marcas de expressão sem interpretação e linguagem denotativa.", fonte: ["GEPA", "p. 60"] },
    { texto: "Se o cartum tiver mais de um quadro, indique-os como Q1, Q2.", fonte: ["GEPA", "p. 60"] }
  ],
  meme: [
    { texto: "Indicar o número de quadros: [Meme \"título\" em quadro único/em x quadros:...].", fonte: ["GEPA", "p. 66"] },
    { texto: "Em quadro único, começar pelo recurso visual e seguir com o verbal, com o texto do meme entre aspas.", fonte: ["GEPA", "p. 66"] },
    { texto: "Indicar o tipo de recurso visual (fotografia, desenho, ilustração, colagem) e não descrever logomarcas de autoria.", fonte: ["GEPA", "p. 68-69"] }
  ],
  desenho: [
    { texto: "Adaptar desenhos somente quando não for possível reproduzi-los, fazendo a descrição.", fonte: ["GEPA", "p. 70"] }
  ],
  fotografia: [
    { texto: "Para pessoas, escolher as características físicas conforme o objetivo da imagem (gênero, cor da pele, estatura, biotipo, cabelo, vestuário).", fonte: ["GPEAD", "p. 16-18"] },
    { texto: "Descrever o que se vê: não usar informações como sem batom, sem blusa.", fonte: ["GPEAD", "p. 19"] }
  ],
  ilustracao: [
    { texto: "Proporção e cor declaradas como representação artística, sem correspondência com a realidade, não devem ser transcritas.", fonte: ["GEPA", "p. 51"] }
  ],
  pintura: [
    { texto: "A nota introdutória apresenta a obra em linhas gerais e não faz parte da audiodescrição.", fonte: ["GPEAD", "p. 17-18"] }
  ],
  esquema: [
    { texto: "Considere a alteração da forma original (por exemplo, regiões circulares em retangulares) quando ela preservar os dados e facilitar a leitura tátil.", fonte: ["GEPA", "p. 25-27"] }
  ]
};

/* Orientações gerais do roteiro de imagem estática (GPEAD, 2025, p. 14-17) */
const ORIENTACOES_ROTEIRO = [
  { texto: "Identificar o tipo de imagem, o ambiente e o espaço.", fonte: ["GPEAD", "p. 16"] },
  { texto: "Descrever do geral para o específico, de cima para baixo e da esquerda para a direita.", fonte: ["GPEAD", "p. 15-16"] },
  { texto: "Ser claro e objetivo, priorizando as informações importantes para a compreensão do conteúdo.", fonte: ["GPEAD", "p. 16"] },
  { texto: "Escolher vocabulário adequado ao grupo beneficiado.", fonte: ["GPEAD", "p. 16"] },
  { texto: "Usar no máximo 300 palavras.", fonte: ["GPEAD", "p. 17"] },
  { texto: "Redigir as descrições de forma clara, sucinta e contextualizada, com vocabulário compatível com a idade escolar.", fonte: ["GEPA", "p. 22"] },
  { texto: "A nota de transcrição começa com letra maiúscula, termina com ponto final e fica entre colchetes.", fonte: ["GEPA", "p. 31"] },
  { texto: "Quando não houver indicação de foto, desenho ou ilustração, usar a palavra imagem.", fonte: ["GEPA", "p. 32"] },
  { texto: "O roteiro pronto é enviado ao consultor com deficiência visual, que avalia e valida.", fonte: ["GPEAD", "p. 15"] }
];

/* Parâmetros para material ampliado (IBC, 2025, Manual de livros ampliados) */
const PARAMETROS_AMPLIADO = [
  { texto: "Fontes sem serifa, como APHont, Tahoma, Verdana ou Arial; evitar fontes condensadas ou estendidas.", fonte: ["AMPLIADO", "p. 13"] },
  { texto: "Corpo do texto entre 18 e 22 pontos; destaques e títulos em 24 pontos.", fonte: ["AMPLIADO", "p. 14"] },
  { texto: "Entrelinha 25% a 30% maior que o corpo do texto.", fonte: ["AMPLIADO", "p. 14"] },
  { texto: "Substituir itálico por negrito e evitar o uso excessivo de caixa alta.", fonte: ["AMPLIADO", "p. 14"] },
  { texto: "Indicar a página do original entre os símbolos < e >.", fonte: ["AMPLIADO", "p. 16"] },
  { texto: "Garantir contraste adequado; fundo escuro pede texto claro.", fonte: ["AMPLIADO", "p. 17"] },
  { texto: "Criar ou adaptar imagens acessíveis, por exemplo, ilustrações em estilo de traço.", fonte: ["AMPLIADO", "p. 17"] },
  { texto: "Imprimir em PDF a 300 dpi, escala 100%, papel offset 90 g.", fonte: ["AMPLIADO", "p. 18"] }
];

/* Itens de revisão do professor */
const CHECKLIST_PROFESSOR = [
  { id: "finalidade", texto: "A descrição atende à finalidade pedagógica registrada na etapa 2.", fonte: ["GEPA", "p. 23"] },
  { id: "necessario", texto: "Não há informações desnecessárias para a atividade.", fonte: ["GEPA", "p. 23-25"] },
  { id: "ordem", texto: "A descrição segue do geral para o específico, de cima para baixo e da esquerda para a direita.", fonte: ["GPEAD", "p. 15-16"] },
  { id: "vocabulario", texto: "O vocabulário é compatível com a série do estudante.", fonte: ["GEPA", "p. 22"] },
  { id: "literal", texto: "A linguagem é literal e não interpreta emoções.", fonte: ["GEPA", "p. 60"] },
  { id: "artistica", texto: "Proporções e cores apenas artísticas não foram transcritas como dados.", fonte: ["GEPA", "p. 51"] },
  { id: "nota", texto: "A nota de transcrição informa as alterações feitas (forma, legenda criada, sentido).", fonte: ["GEPA", "p. 25; 30"] },
  { id: "ia", texto: "Conferi cada informação do rascunho de IA com a imagem original.", fonte: ["MEC", "Oportunidade 5"] }
];

/* Dimensões da avaliação do consultor (GPEAD, 2025, p. 14) */
const DIMENSOES_CONSULTOR = [
  { id: "pertinencia", rotulo: "Pertinência das escolhas" },
  { id: "qualidade", rotulo: "Qualidade do texto" },
  { id: "eficacia", rotulo: "Eficácia para a compreensão" },
  { id: "funcionalidade", rotulo: "Funcionalidade na leitura (tátil ou por voz)" }
];

/* -------------------------------------------------------------------------
   Verificações automáticas do roteiro
   Cada verificação devolve null (ok) ou {nivel, mensagem, fonte}
   ------------------------------------------------------------------------- */
const LISTA_EMOCOES = ["feliz", "felizes", "triste", "tristes", "alegre", "alegres", "assustad", "com medo", "com raiva", "raivos", "irritad", "preocupad", "surpres", "zangad", "contente", "nervos", "ansios", "confus", "em dúvida", "desconfiad", "apaixonad", "tímid", "envergonhad", "emocionad", "orgulhos", "furios", "chatead", "animad", "pensativ", "aliviad"];
const LISTA_SUBJETIVOS = ["lindo", "linda", "lindos", "lindas", "bonito", "bonita", "bonitos", "bonitas", "feio", "feia", "maravilhos", "incrível", "encantador", "deslumbrante", "belíssim", "horrível", "fofo", "fofa", "magnífic", "espetacular", "agradável"];
const LISTA_EXPLICA_HUMOR = ["engraçad", "piada", "humor", "humorístic", "ironia", "irônic", "sarcasm", "sarcástic", "satiriz", "sátira", "critica", "crítica", "criticando", "zomba", "ridiculariz", "graça", "cômic"];
const ABERTURAS_GENERICAS = /^(esta|essa|a)\s+imagem\s+(mostra|apresenta|retrata|exibe)|^(nesta|nessa|na)\s+imagem\s+(vemos|podemos ver|há|temos)|^podemos ver|^vemos/i;

function contarPalavras(t) {
  return (t || "").trim().split(/\s+/).filter(Boolean).length;
}
function textosVerbais(item) {
  return (item.quadros || []).flatMap(q => (q.verbal || "").split(/\n+/).map(l => l.replace(/^[^:“"]{1,40}:\s*/, "").replace(/^["“]|["”]$/g, "").trim()).filter(Boolean));
}
/* Monta a nota de transcrição a partir dos quadros, no formato do GEPA (2025, p. 60; 66-68) */
function montarNotaGenero(item) {
  const a = item.analise || {}, qs = (item.quadros || []).filter(q => (q.visual || "").trim() || (q.verbal || "").trim());
  const titulo = (item.material && item.material.tituloObra) ? ` “${item.material.tituloObra}”` : "";
  const n = qs.length;
  const linhaVerbal = (l, meme) => {
    const m = l.match(/^([^:“"]{1,40}):\s*(.+)$/);
    const txt = (m ? m[2] : l).replace(/^["“]|["”]$/g, "").trim();
    if (!txt) return "";
    const fim = /[.!?…]$/.test(txt) ? "" : ".";
    if (meme && m && /superior/i.test(m[1])) return `Na parte superior, lê-se: “${txt}”${fim}`;
    if (meme && m && /inferior/i.test(m[1])) return `Na parte inferior, lê-se: “${txt}”${fim}`;
    if (m && /narrador/i.test(m[1])) return `O narrador diz: “${txt}”${fim}`;
    const verbo = m && m[1].trim().match(/^(.+?)\s+(fala|diz|pensa|grita|sussurra|pergunta|responde|exclama)$/i);
    if (verbo) return `${verbo[1]} ${verbo[2].toLowerCase()}: “${txt}”${fim}`;
    if (m) return `${m[1].trim()} diz: “${txt}”${fim}`;
    return `Lê-se: “${txt}”${fim}`;
  };
  const corpoQuadro = (q, meme) => [(q.visual || "").trim().replace(/([^.])$/, "$1."), ...(q.verbal || "").split(/\n+/).map(l => linhaVerbal(l.trim(), meme))].filter(x => x && x !== ".").join(" ");
  if (!n) return "";
  if (a.tipo === "hq") {
    const nome = /hist/i.test(item.material.subgenero || "") ? "História" : "Tirinha";
    return `${nome}${titulo} em ${n} quadrinho${n > 1 ? "s" : ""}:\n` + qs.map((q, i) => `Q${i + 1} ${corpoQuadro(q, false)}`).join("\n");
  }
  if (a.tipo === "meme") {
    if (n === 1) return `Meme${titulo} em quadro único: ${corpoQuadro(qs[0], true)}`;
    return `Meme${titulo} em ${n} quadros:\n` + qs.map((q, i) => `Q${i + 1} ${corpoQuadro(q, true)}`).join("\n");
  }
  const nomeG = a.tipo === "cartum" ? "Cartum" : "Charge";
  if (n === 1) return `${nomeG}${titulo}: ${corpoQuadro(qs[0], false)}`;
  return `${nomeG}${titulo} em ${n} quadros:\n` + qs.map((q, i) => `Q${i + 1} ${corpoQuadro(q, false)}`).join("\n");
}
function normalizar(t) {
  return (t || "").toLowerCase();
}
function encontrarTermos(texto, lista) {
  const t = normalizar(texto).replace(/[.,;:!?()"“”]/g, " ");
  const tokens = t.split(/\s+/).filter(Boolean);
  const achados = new Set();
  lista.forEach(p => {
    if (/\s/.test(p)) { if ((" " + t + " ").includes(" " + p + " ")) achados.add(p); }
    else tokens.forEach(tk => { if (tk.startsWith(p) && tk.length <= p.length + 3) achados.add(tk); });
  });
  return [...achados];
}
function verificarRoteiro(item) {
  const r = [];
  const d = (item.roteiro && item.roteiro.descricao) || "";
  const tipo = item.analise && item.analise.tipo;
  const n = contarPalavras(d);
  const add = (nivel, mensagem, fonte) => r.push({ nivel, mensagem, fonte });

  if (!d.trim()) {
    add("erro", "O roteiro ainda está vazio.", ["INTERNO", ""]);
    return r;
  }
  if (n > 300) add("erro", `O roteiro tem ${n} palavras. O limite para imagem estática é de 300 palavras.`, ["GPEAD", "p. 17"]);
  else if (n > 120) add("atencao", `O roteiro tem ${n} palavras. Descrições longas dificultam a leitura tátil; avalie se todas as informações são necessárias para a atividade.`, ["GEPA", "p. 22"]);
  else add("ok", `O roteiro tem ${n} palavras (limite de 300).`, ["GPEAD", "p. 17"]);

  const primeira = normalizar(d.replace(/^\s*\[/, "")).split(/\s+/).slice(0, 3).join(" ");
  const tipoDef = TIPOS_IMAGEM.find(x => x.id === tipo);
  if (tipoDef) {
    const ok = tipoDef.inicio.some(p => primeira.startsWith(p)) || (tipo !== "outro" && primeira.startsWith("imagem"));
    if (!ok) add("atencao", `O roteiro não começa pela identificação do tipo de imagem (${tipoDef.rotulo.toLowerCase()}).`, tipo === "mapa" ? ["GEPA", "p. 52"] : (tipo === "hq" ? ["GEPA", "p. 60"] : (tipo === "meme" ? ["GEPA", "p. 66"] : ["GPEAD", "p. 16"])));
    else add("ok", "O roteiro começa pela identificação do tipo de imagem.", ["GPEAD", "p. 16"]);
  }
  if (tipo === "hq" && !/\bQ1\b/.test(d)) add("atencao", "Em quadrinhos e tirinhas, indique cada quadrinho como Q1, Q2, Q3.", ["GEPA", "p. 60"]);
  if (tipo === "hq" && !/em\s+\w+\s+quadrinhos?/i.test(d)) add("atencao", "Informe na abertura o número de quadrinhos: \"em x quadrinhos\".", ["GEPA", "p. 60"]);
  if (tipo === "meme" && !/(quadro único|em\s+\w+\s+quadros)/i.test(d)) add("atencao", "Informe se o meme tem quadro único ou quantos quadros possui.", ["GEPA", "p. 66"]);

  if (ABERTURAS_GENERICAS.test(d.replace(/^\s*\[/, "").trim())) add("atencao", "Aberturas genéricas como \"a imagem mostra\" acrescentam pouca informação. Comece pelo tipo de imagem e pelo que ela representa.", ["PERDIGAO", "e2593"]);

  const neg = (d.match(/(?<![\p{L}])(sem\s+\p{L}+|não há|não tem|nenhum|nenhuma|ausência de)(?![\p{L}])/giu) || []);
  if (neg.length) add("atencao", `Há descrição pela negativa (${[...new Set(neg.map(x => x.toLowerCase()))].join(", ")}). Descreva o que se vê.`, ["GPEAD", "p. 19; 36"]);

  const emo = encontrarTermos(d, LISTA_EMOCOES);
  if (emo.length) add("atencao", `Há termos que interpretam emoções (${emo.join(", ")}). Descreva as marcas de expressão do rosto, sem nomear a reação.`, ["GEPA", "p. 60; 69"]);

  const sub = encontrarTermos(d, LISTA_SUBJETIVOS);
  if (sub.length) add("atencao", `Há adjetivos de valor (${sub.join(", ")}). Prefira linguagem literal e denotativa.`, ["GEPA", "p. 60; 70"]);

  if (/(?<![\p{L}])(abaixo|acima)(?![\p{L}])/iu.test(d)) add("atencao", "Substitua \"abaixo\" por \"a seguir\" e \"acima\" por \"anteriormente\" quando a palavra se refere à posição no texto.", ["GEPA", "p. 32"]);

  const frases = d.split(/(?<=[.!?])\s+/).filter(Boolean);
  const longas = frases.filter(f => contarPalavras(f) > 30).length;
  if (longas) add("atencao", `${longas} frase(s) com mais de 30 palavras. Frases curtas deixam o texto claro e objetivo.`, ["INTERNO", "com base em GPEAD (2025, p. 36)"]);

  const exp = encontrarTermos(d, LISTA_EXPLICA_HUMOR);
  if (exp.length) add("atencao", `A descrição parece explicar o efeito de sentido (${exp.join(", ")}). Ofereça os elementos verbais e visuais e deixe a inferência para o estudante.`, ["INTERNO", "com base em GEPA (2025, p. 60)"]);
  const faltando = textosVerbais(item).filter(t => !normalizar(d).includes(normalizar(t)));
  if (faltando.length) add("atencao", `${faltando.length} trecho(s) de texto verbal registrado(s) nos quadros não aparece(m) literalmente no roteiro: ${faltando.slice(0, 3).map(t => "“" + t + "”").join("; ")}${faltando.length > 3 ? "..." : ""}.`, ["GEPA", "p. 60; 66"]);
  else if (textosVerbais(item).length) add("ok", "Todo o texto verbal registrado nos quadros aparece no roteiro.", ["GEPA", "p. 60; 66"]);

  const fin = item.analise && item.analise.finalidade;
  if (!fin || !fin.trim()) add("erro", "A finalidade pedagógica não foi registrada. Sem ela, não é possível avaliar o que a descrição precisa conter.", ["GEPA", "p. 23"]);

  const dest = item.material && item.material.destinatarios || [];
  if (dest.includes("baixa") && !/(?<![\p{L}])(azul|vermelh|verde|amarel|pret|branc|cinz|laranj|rox|marrom|rosa|bege|dourad|pratead|colorid)/iu.test(d)) {
    add("info", "Nenhuma cor foi mencionada. Verifique se a cor é relevante para a atividade ou para o estudante com baixa visão.", ["GPEAD", "p. 36"]);
  }
  if (item.estrategia === "suprimir" && n > 0) add("info", "A estratégia escolhida é suprimir a imagem; o roteiro não será exportado.", ["GEPA", "p. 32"]);
  return r;
}

function verificarNotaTranscricao(texto) {
  const t = (texto || "").trim();
  if (!t) return null;
  // Quando o roteiro termina com fala transcrita, aceita a pontuação da própria fala antes das aspas (critério interno).
  const ok = /^[A-ZÁÉÍÓÚÂÊÔÃÕÀÇ"“]/.test(t) && (/\.$/.test(t) || /[.!?…]["”]$/.test(t));
  return ok ? null : { nivel: "atencao", mensagem: "A nota de transcrição deve começar com letra maiúscula e terminar com ponto final.", fonte: ["GEPA", "p. 31"] };
}

/* -------------------------------------------------------------------------
   Árvore de decisão da etapa 2 (GEPA, 2025, 6.1 D a G e 6.2.1 E)
   ------------------------------------------------------------------------- */
function recomendarEstrategia(a) {
  if (!a) return null;
  if (a.necessaria === "nao") {
    if (a.legenda === "sim" && a.legendaRelevante === "sim") return "sucinta_legenda";
    if (a.mencionada === "sim") return "nao_adaptada";
    return "suprimir";
  }
  if (a.necessaria === "sim") {
    if (a.tipo === "grafico") return "alterar_forma";
    if (a.tipo === "mapa") return "mista";
    if (a.tipo === "tabela") return "ajustar";
    return "descricao_didatica";
  }
  return null;
}

/* -------------------------------------------------------------------------
   Instrução para IA (rascunho). A instrução incorpora as regras acima.
   ------------------------------------------------------------------------- */
function montarInstrucaoIA(item) {
  const m = item.material || {}, a = item.analise || {};
  const tipo = (TIPOS_IMAGEM.find(x => x.id === a.tipo) || {}).rotulo || "não informado";
  const dest = (m.destinatarios || []).map(x => x === "cego" ? "estudantes cegos (leitura em braille ou por leitor de tela)" : "estudantes com baixa visão").join(" e ") || "estudantes com deficiência visual";
  const especificas = (REGRAS_POR_TIPO[a.tipo] || []).map(x => "- " + x.texto).join("\n");
  const est = ESTRATEGIAS[item.estrategia] ? ESTRATEGIAS[item.estrategia].rotulo : "a definir pelo professor";
  return [
    "Você vai redigir um RASCUNHO de audiodescrição didática de um gênero multimodal (tirinha, charge, cartum ou meme) de material didático de Língua Portuguesa. O rascunho será revisado por um professor e validado por um consultor com deficiência visual. Não invente elementos que não estejam visíveis. Quando não tiver certeza, registre a dúvida em vez de supor.",
    "",
    "CONTEXTO PEDAGÓGICO",
    `- Componente curricular: ${m.componente || "não informado"}`,
    `- Ano/série: ${m.ano || "não informado"}`,
    `- Público: ${dest}`,
    `- Tipo de imagem: ${tipo}`,
    `- Estratégia de adaptação escolhida pelo professor: ${est}`,
    `- Finalidade pedagógica (o que o estudante precisa perceber ou fazer): ${a.finalidade || "não informada"}`,
    `- Enunciado ou atividade associada: ${m.enunciado || "não informado"}`,
    `- Legenda original: ${m.legenda || "sem legenda"}`,
    `- Contexto necessário para a leitura: ${a.contexto || "não informado"}`,
    `- Número de quadros: ${a.quadros || "não informado"}`,
    textosVerbais(item).length ? "- Texto verbal já transcrito pelo professor (use exatamente, entre aspas):\n" + textosVerbais(item).map(t => "  “" + t + "”").join("\n") : null,
    "",
    "REGRAS (Manual de audiodescrição do IBC/GPEAD, 2025, e Manual de adaptação de textos para o Sistema Braille do IBC/GEPA, 2025)",
    "- Comece identificando o tipo de imagem; se não for foto, desenho ou ilustração identificável, use a palavra imagem.",
    "- Identifique o ambiente e o espaço; descreva do geral para o específico, de cima para baixo e da esquerda para a direita.",
    "- Priorize apenas o que a atividade exige; omita o que for desnecessário para a finalidade pedagógica.",
    "- Use no máximo 300 palavras, frases curtas e vocabulário compatível com a série do estudante.",
    "- Descreva o que se vê; não descreva pela negativa (por exemplo, sem blusa).",
    "- Não interprete emoções: descreva as marcas de expressão do rosto (sobrancelhas, boca, olhos), sem nomear a reação.",
    "- Use linguagem literal e denotativa; evite adjetivos de valor.",
    "- Proporções e cores apenas artísticas não são dados da realidade.",
    "- Não comece com expressões como 'a imagem mostra'.",
    "- Transcreva literalmente, entre aspas, todo texto verbal da imagem (falas, balões, legendas, placas, onomatopeias).",
    "- NÃO explique o humor, a ironia ou a crítica. Descreva os elementos verbais e visuais que permitem ao estudante fazer essa inferência sozinho.",
    especificas ? "Regras específicas para este tipo de imagem:\n" + especificas : null,
    "",
    "FORMATO DA RESPOSTA (use exatamente estes rótulos, em português do Brasil):",
    "NOTA INTRODUTÓRIA: (opcional; apresenta a obra em linhas gerais e não faz parte da audiodescrição)",
    "AUDIODESCRIÇÃO: (o roteiro, em um ou mais parágrafos)",
    "DÚVIDAS PARA O PROFESSOR: (o que não foi possível identificar com segurança)"
  ].filter(x => x !== null).join("\n");
}

/* Condição de comparação da pesquisa: instrução genérica, sem critérios */
const INSTRUCAO_GENERICA = "Descreva esta imagem.";

function interpretarRespostaIA(texto) {
  const pega = (rotulo, proximos) => {
    const re = new RegExp(rotulo + "\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:" + proximos.join("|") + ")\\s*:|$)", "i");
    const m = (texto || "").match(re);
    return m ? m[1].trim() : "";
  };
  const R = ["NOTA INTRODUTÓRIA", "AUDIODESCRIÇÃO", "REPRESENTAÇÃO ALTERNATIVA", "DÚVIDAS PARA O PROFESSOR"];
  const out = {
    nota: pega(R[0], R.slice(1)),
    descricao: pega(R[1], [R[2], R[3]]),
    alternativa: pega(R[2], [R[3]]),
    duvidas: pega(R[3], ["FIM"])
  };
  if (!out.descricao) out.descricao = (texto || "").trim();
  ["nota", "alternativa", "duvidas"].forEach(k => { if (/^\(?(opcional|somente|nenhum|nenhuma|não se aplica|n\/a)/i.test(out[k])) out[k] = ""; });
  return out;
}


/* -------------------------------------------------------------------------
   Checklist de acessibilidade (etapa 6)
   Reúne, em um só lugar, a conferência de todas as etapas antes da entrega.
   Itens automáticos: calculados a partir do que o professor registrou.
   Itens de conferência: dependem de verificação humana e são marcados pelo professor.
   ------------------------------------------------------------------------- */
const GRUPOS_CHECKLIST = [
  ["planejamento", "Planejamento da adaptação (etapas 1 e 2)"],
  ["roteiro", "Roteiro para estudantes cegos (etapa 3)"],
  ["baixa", "Versão para estudantes com baixa visão (etapa 4)"],
  ["humana", "Revisão humana e validação (etapa 5)"],
  ["entrega", "Conferência da entrega (marcada pelo professor)"]
];
const CHECKLIST_ENTREGA = [
  { id: "leitor", etapa: "exportar", texto: "Abri a versão do estudante com um leitor de tela (NVDA, TalkBack, VoiceOver ou outro) e a descrição foi lida por completo e na ordem correta.", fonte: ["MEC2010", "p. 25"], aplica: it => (it.material.destinatarios || []).includes("cego") && it.estrategia !== "suprimir" },
  { id: "braille", etapa: "exportar", texto: "Revisei a diagramação do texto para braille no Braille Fácil, ou programa equivalente, antes da impressão.", fonte: ["GEPA", "p. 18-21"], aplica: it => (it.material.destinatarios || []).includes("cego") },
  { id: "ampliado", etapa: "baixa", texto: "Conferi a versão ampliada com o estudante com baixa visão: tamanho da letra, contraste e posição da imagem em relação ao texto.", fonte: ["MEC2010", "p. 25"], aplica: it => (it.material.destinatarios || []).includes("baixa") },
  { id: "dados", etapa: "exportar", texto: "Os registros e os arquivos exportados não contêm nome nem outros dados pessoais de estudantes.", fonte: ["PNEEI", "art. 12, § 5º"], aplica: () => true }
];
const ROTULO_ESTADO = { ok: "Cumprido", pendente: "Pendente", na: "Não se aplica" };

function checklistAcessibilidade(it) {
  const m = it.material || {}, a = it.analise || {}, r = it.roteiro || {}, v = it.validacao || {};
  const rv = it.revisao || { checks: {} }, amp = it.ampliado || { ajustes: [] };
  const dest = m.destinatarios || [];
  const cego = dest.includes("cego"), baixa = dest.includes("baixa");
  const sup = it.estrategia === "suprimir";
  const d = r.descricao || "", n = contarPalavras(d), temRoteiro = !!d.trim();
  const L = [];
  const add = (grupo, id, etapa, texto, ok, detalhe, fonte, na) => L.push({ grupo, id, etapa, texto, estado: na ? "na" : (ok ? "ok" : "pendente"), detalhe: detalhe || "", fonte, auto: true });

  /* planejamento */
  add("planejamento", "registro", "material", "Material registrado com título, série e destinatários.", (m.titulo || "").trim() && m.ano && dest.length,
    dest.length ? "" : "Indique se o material se destina a estudantes cegos, com baixa visão ou ambos.", ["INTERNO", ""]);
  add("planejamento", "bncc", "material", "Habilidade da BNCC associada à atividade.", !!m.habilidade, m.habilidade ? m.habilidade : "Sem habilidade, a finalidade da leitura da imagem fica indefinida.", ["BNCC", ""]);
  add("planejamento", "genero", "analise", "Gênero e grau de dependência visual informados.", a.tipo && a.dependencia, "", ["GEPA", "p. 60; 66"]);
  add("planejamento", "finalidade", "analise", "Efeito de sentido e finalidade pedagógica registrados.", (a.finalidade || "").trim(), "", ["GEPA", "p. 23"]);
  add("planejamento", "estrategia", "analise", "Estratégia de adaptação definida.", !!it.estrategia, it.estrategia && ESTRATEGIAS[it.estrategia] ? ESTRATEGIAS[it.estrategia].rotulo + "." : "", ["GEPA", "p. 32-34"]);

  /* roteiro */
  if (sup || !cego) {
    const motivo = sup ? "A imagem foi suprimida por ser apenas ilustrativa." : "O material não foi indicado para estudantes cegos.";
    ["semErros", "limite", "abertura", "verbal", "inferencia", "literal"].forEach((id, i) => add("roteiro", id, "roteiro",
      ["Roteiro sem erros na verificação automática.", "Roteiro com até 300 palavras.", "Abertura pelo gênero e indicação dos quadros.", "Texto verbal transcrito literalmente.", "O roteiro não explica o efeito de sentido.", "Linguagem literal, sem nomear emoções nem usar adjetivos de valor."][i], false, motivo, ["INTERNO", ""], true));
  } else {
    const verif = verificarRoteiro(it), erros = verif.filter(x => x.nivel === "erro");
    add("roteiro", "semErros", "roteiro", "Roteiro sem erros na verificação automática.", temRoteiro && !erros.length, erros.map(x => x.mensagem).join(" "), ["INTERNO", "verificação da etapa 3"]);
    add("roteiro", "limite", "roteiro", "Roteiro com até 300 palavras.", temRoteiro && n <= 300, temRoteiro ? `${n} palavras.` : "Roteiro vazio.", ["GPEAD", "p. 17"]);
    const ini = normalizar(d.replace(/^\s*\[/, "")).split(/\s+/).slice(0, 3).join(" ");
    const tipoDef = TIPOS_IMAGEM.find(x => x.id === a.tipo);
    let abre = !!tipoDef && (tipoDef.inicio.some(p => ini.startsWith(p)) || ini.startsWith("imagem"));
    const faltas = [];
    if (!abre) faltas.push("o roteiro não começa pelo gênero");
    if (a.tipo === "hq") { if (!/\bQ1\b/.test(d)) faltas.push("faltam as marcas Q1, Q2"); if (!/em\s+\S+\s+quadrinhos?/i.test(d)) faltas.push("falta informar o número de quadrinhos"); }
    if (a.tipo === "meme" && !/(quadro único|em\s+\S+\s+quadros)/i.test(d)) faltas.push("falta informar quadro único ou número de quadros");
    add("roteiro", "abertura", "roteiro", "Abertura pelo gênero e indicação dos quadros.", temRoteiro && !faltas.length, faltas.length ? faltas.join("; ") + "." : "", ["GEPA", a.tipo === "meme" ? "p. 66" : "p. 60"]);
    const tv = textosVerbais(it), falt = tv.filter(t => !normalizar(d).includes(normalizar(t)));
    const temQuadros = (it.quadros || []).some(q => (q.visual || "").trim());
    if (tv.length) add("roteiro", "verbal", "roteiro", "Texto verbal transcrito literalmente.", temRoteiro && !falt.length, falt.length ? `${falt.length} trecho(s) não aparece(m) no roteiro.` : `${tv.length} trecho(s) conferido(s).`, ["GEPA", "p. 60; 66"]);
    else add("roteiro", "verbal", "roteiro", "Texto verbal transcrito literalmente.", temQuadros, temQuadros ? "Nenhum texto verbal foi registrado nos quadros. Confirme que a imagem não tem falas, balões, legendas ou letreiros." : "Registre os quadros e o texto verbal na etapa 3 para que a aplicação possa conferir.", ["GEPA", "p. 60; 66"]);
    const exp = encontrarTermos(d, LISTA_EXPLICA_HUMOR);
    add("roteiro", "inferencia", "roteiro", "O roteiro não explica o efeito de sentido.", temRoteiro && !exp.length, exp.length ? "Termos encontrados: " + exp.join(", ") + "." : "", ["INTERNO", "com base em GEPA (2025, p. 60)"]);
    const emo = encontrarTermos(d, LISTA_EMOCOES), sub = encontrarTermos(d, LISTA_SUBJETIVOS);
    add("roteiro", "literal", "roteiro", "Linguagem literal, sem nomear emoções nem usar adjetivos de valor.", temRoteiro && !emo.length && !sub.length, emo.concat(sub).length ? "Termos encontrados: " + emo.concat(sub).join(", ") + "." : "", ["GEPA", "p. 60; 69-70"]);
  }

  /* baixa visão */
  const tam = parseInt(amp.tamanho, 10);
  add("baixa", "ajustes", "baixa", "Ajustes da imagem previstos (ampliação, contraste, simplificação ou outros).", (amp.ajustes || []).length, baixa ? "" : "O material não foi indicado para estudantes com baixa visão.", ["AMPLIADO", "p. 17"], !baixa);
  add("baixa", "fonte", "baixa", "Texto ampliado entre 18 e 22 pontos, com entrelinha ampliada.", tam >= 18 && tam <= 22 && parseFloat(amp.entrelinha) >= 1.25, baixa ? `${amp.fonte || "Arial"}, ${amp.tamanho} pontos.` : "O material não foi indicado para estudantes com baixa visão.", ["AMPLIADO", "p. 14"], !baixa);

  /* revisão humana */
  const nck = CHECKLIST_PROFESSOR.filter(c => rv.checks && rv.checks[c.id]).length;
  const usouIA = r.origem === "ia" || r.origem === "ia-editado";
  add("humana", "checks", "revisao", "Todos os itens da revisão do professor conferidos.", nck === CHECKLIST_PROFESSOR.length, `${nck} de ${CHECKLIST_PROFESSOR.length} itens conferidos.`, ["GPEAD", "p. 14-15"], sup);
  add("humana", "ia", "revisao", "Rascunho de IA conferido, informação por informação, com a imagem original.", rv.checks && rv.checks.ia, usouIA ? (r.origem === "ia" ? "O rascunho de IA ainda não recebeu nenhuma edição." : "") : "O roteiro não partiu de rascunho de IA.", ["MEC", "Oportunidade 5"], !usouIA || sup);
  add("humana", "status", "revisao", "Roteiro marcado como revisado pelo professor.", rv.status === "revisado", "", ["GPEAD", "p. 14-15"], sup);
  add("humana", "consultor", "revisao", "Validação registrada por consultor com deficiência visual.", ["validado", "ajustes"].includes(v.decisao), v.decisao === "nao" ? "O consultor não validou o roteiro: refaça-o e submeta de novo." : (v.decisao === "ajustes" ? "Validado com ajustes: confirme que os ajustes foram feitos." : ""), ["GPEAD", "p. 14-15"], sup);
  add("humana", "teste", "revisao", "Teste de leitura realizado com estudante ou revisor braille.", it.teste && it.teste.realizado, "", ["GEPA", "p. 22"], sup);

  /* conferência da entrega (manual) */
  const ck = it.checklist || {};
  CHECKLIST_ENTREGA.forEach(c => L.push({ grupo: "entrega", id: c.id, etapa: c.etapa, texto: c.texto, estado: c.aplica(it) ? (ck[c.id] ? "ok" : "pendente") : "na", detalhe: c.aplica(it) ? "" : "Não se aplica aos destinatários ou à estratégia escolhida.", fonte: c.fonte, auto: false }));
  return L;
}
function resumoChecklist(L) {
  const ap = L.filter(x => x.estado !== "na");
  const ok = ap.filter(x => x.estado === "ok").length;
  return { total: ap.length, ok, pendentes: ap.length - ok };
}


/* Descrição das regras de verificação do roteiro (exibida no painel de regras). */
const REGRAS_VERIFICACAO = [
  { texto: "O roteiro tem no máximo 300 palavras (acima disso, erro); acima de 120 palavras, alerta para avaliar se tudo é necessário.", fonte: ["GPEAD", "p. 17"], extra: ["GEPA", "p. 22"] },
  { texto: "O roteiro começa pela identificação do tipo de imagem (tirinha, charge, cartum ou meme).", fonte: ["GPEAD", "p. 16"] },
  { texto: "Em tirinhas, cada quadrinho é indicado como Q1, Q2, Q3, e a abertura informa o número de quadrinhos.", fonte: ["GEPA", "p. 60"] },
  { texto: "Em memes, a abertura informa quadro único ou o número de quadros.", fonte: ["GEPA", "p. 66"] },
  { texto: "Aberturas genéricas, como “a imagem mostra”, são apontadas.", fonte: ["PERDIGAO", "e2593"] },
  { texto: "Descrições pela negativa (sem, não há, nenhum) são apontadas.", fonte: ["GPEAD", "p. 19; 36"] },
  { texto: "Palavras que nomeiam emoções são apontadas; descreve-se o rosto, sem nomear a reação.", fonte: ["GEPA", "p. 60; 69"] },
  { texto: "Adjetivos de valor (lindo, feio, horrível) são apontados.", fonte: ["GEPA", "p. 60; 70"] },
  { texto: "“Abaixo” e “acima”, quando indicam posição no texto, devem ser trocados por “a seguir” e “anteriormente”.", fonte: ["GEPA", "p. 32"] },
  { texto: "Frases com mais de 30 palavras são apontadas.", fonte: ["INTERNO", "com base em GPEAD (2025, p. 36)"] },
  { texto: "Palavras que costumam explicar o humor, a ironia ou a crítica (engraçado, irônico, crítica, satiriza) são apontadas.", fonte: ["INTERNO", "com base em GEPA (2025, p. 60)"] },
  { texto: "Todo o texto verbal registrado nos quadros deve aparecer literalmente no roteiro.", fonte: ["GEPA", "p. 60; 66"] },
  { texto: "A finalidade pedagógica (efeito de sentido) precisa estar registrada antes da verificação.", fonte: ["GEPA", "p. 23"] },
  { texto: "Para estudantes com baixa visão, o roteiro sem nenhuma cor gera aviso para avaliar se a cor é relevante.", fonte: ["GPEAD", "p. 36"] },
  { texto: "A nota de transcrição começa com letra maiúscula e termina com ponto final. Quando termina com uma fala transcrita, a pontuação da fala, antes das aspas, é aceita (critério interno da ferramenta).", fonte: ["GEPA", "p. 31"] }
];
