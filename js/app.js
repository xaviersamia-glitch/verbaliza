/* =========================================================================
   Verbaliza · aplicação
   Estrutura: preferências de acessibilidade, estado do material, sete etapas,
   integração opcional com IA, biblioteca local e exportação.
   ========================================================================= */
"use strict";

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const agora = () => new Date().toISOString();
const dataBR = iso => { try { return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }); } catch (e) { return iso; } };
function lerLocal(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function gravarLocal(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
function lerSessao(k) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function gravarSessao(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
function anunciar(msg) { const a = $("#anunciador"); a.textContent = ""; setTimeout(() => { a.textContent = msg; }, 60); }
function fonteTxt(f) { if (!f) return ""; const fo = FONTES[f[0]]; return fo ? `Fonte: ${fo.sigla}${f[1] ? ", " + f[1] : ""}.` : ""; }
function uid() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// As chaves mantêm o prefixo do nome anterior (AdaptaDV) para não perder dados já salvos.
const CHAVE_PREFS = "adaptadv-prefs-v1";
const CHAVE_ATUAL = "adaptadv-atual-v1";
const CHAVE_BIBLIO = "adaptadv-biblioteca-v1";
const CHAVE_IA = "adaptadv-ia-v1";

/* ---------- preferências de acessibilidade (mesmo padrão do Paisagens Sonoras) ---------- */
const prefs = Object.assign({ esquema: "branco-preto", escala: 1, espacamento: false, reduzirAnimacoes: false, vozNome: null, painelAberto: true }, lerLocal(CHAVE_PREFS) || {});
const TOKENS_TEMA = ["--paper", "--paper-raised", "--paper-sunk", "--ink", "--ink-soft", "--slate", "--line", "--line-strong", "--brass", "--brass-soft", "--brass-wash", "--focus", "--status-ai", "--status-ai-wash", "--status-review", "--status-review-wash", "--status-validated", "--status-validated-wash", "--status-warn", "--status-warn-wash"];
const ESQUEMAS_ALTO_CONTRASTE = {
  "branco-preto": { paper: "#000000", ink: "#ffffff", inkSoft: "#f2f2f2", line: "#ffffff", brass: "#ffd24d" },
  "preto-branco": { paper: "#ffffff", ink: "#000000", inkSoft: "#1a1a1a", line: "#000000", brass: "#003a8c" },
  "amarelo-preto": { paper: "#000000", ink: "#ffff00", inkSoft: "#ffff00", line: "#ffff00", brass: "#ffffff" },
  "preto-amarelo": { paper: "#ffff00", ink: "#000000", inkSoft: "#000000", line: "#000000", brass: "#14141f" }
};
function aplicarPrefs() {
  const root = document.documentElement;
  TOKENS_TEMA.forEach(t => root.style.removeProperty(t));
  root.removeAttribute("data-theme");
  const c = ESQUEMAS_ALTO_CONTRASTE[prefs.esquema];
  if (prefs.esquema === "escuro") root.setAttribute("data-theme", "dark");
  else if (prefs.esquema === "padrao") root.setAttribute("data-theme", "light");
  else if (c) {
    const set = (k, v) => root.style.setProperty(k, v);
    set("--paper", c.paper); set("--paper-raised", c.paper); set("--paper-sunk", c.paper);
    set("--ink", c.ink); set("--ink-soft", c.inkSoft); set("--slate", c.inkSoft);
    set("--line", c.line); set("--line-strong", c.line);
    set("--brass", c.brass); set("--brass-soft", c.brass); set("--brass-wash", c.paper); set("--focus", c.brass);
    ["--status-ai", "--status-review", "--status-validated", "--status-warn"].forEach(k => set(k, c.ink));
    ["--status-ai-wash", "--status-review-wash", "--status-validated-wash", "--status-warn-wash"].forEach(k => set(k, c.paper));
  }
  root.style.fontSize = (17 * prefs.escala).toFixed(2) + "px";
  root.classList.toggle("espacamento-ampliado", !!prefs.espacamento);
  root.classList.toggle("reduzir-animacoes", !!prefs.reduzirAnimacoes);
  $$(".esquema-btn").forEach(b => b.setAttribute("aria-pressed", b.dataset.esquema === prefs.esquema ? "true" : "false"));
  $("#fonte-atual").textContent = Math.round(prefs.escala * 100) + "%";
  $("#chk-espacamento").checked = !!prefs.espacamento;
  $("#chk-animacoes").checked = !!prefs.reduzirAnimacoes;
  gravarLocal(CHAVE_PREFS, prefs);
}
$$(".esquema-btn").forEach(b => b.addEventListener("click", () => { prefs.esquema = b.dataset.esquema; aplicarPrefs(); anunciar("Esquema de cores: " + b.textContent.replace(/^✓\s*/, "") + "."); }));
$("#fonte-mais").addEventListener("click", () => { prefs.escala = Math.min(2.4, +(prefs.escala + 0.15).toFixed(2)); aplicarPrefs(); });
$("#fonte-menos").addEventListener("click", () => { prefs.escala = Math.max(0.85, +(prefs.escala - 0.15).toFixed(2)); aplicarPrefs(); });
$("#chk-espacamento").addEventListener("change", e => { prefs.espacamento = e.target.checked; aplicarPrefs(); });
$("#chk-animacoes").addEventListener("change", e => { prefs.reduzirAnimacoes = e.target.checked; aplicarPrefs(); });

const btnAcess = $("#btn-acessibilidade"), painelAcess = $("#painel-acessibilidade");
function aplicarPainelAcess() {
  painelAcess.hidden = !prefs.painelAberto;
  btnAcess.setAttribute("aria-expanded", prefs.painelAberto ? "true" : "false");
  btnAcess.textContent = prefs.painelAberto ? "Ocultar ajustes de acessibilidade" : "Mostrar ajustes de acessibilidade";
}
btnAcess.addEventListener("click", () => {
  prefs.painelAberto = !prefs.painelAberto; aplicarPainelAcess(); gravarLocal(CHAVE_PREFS, prefs);
  if (prefs.painelAberto) { const p = painelAcess.querySelector(".esquema-btn[aria-pressed='true']"); p && p.focus(); }
});

/* voz */
let vozes = [];
function carregarVozes() {
  if (!("speechSynthesis" in window)) { $("#seletor-voz").innerHTML = "<option>Leitura em voz não disponível neste navegador</option>"; $("#seletor-voz").disabled = true; return; }
  vozes = speechSynthesis.getVoices().filter(v => /^pt/i.test(v.lang));
  const sel = $("#seletor-voz");
  sel.innerHTML = vozes.length ? vozes.map(v => `<option value="${esc(v.name)}"${v.name === prefs.vozNome ? " selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("") : "<option value=\"\">Voz padrão do sistema</option>";
}
if ("speechSynthesis" in window) { speechSynthesis.onvoiceschanged = carregarVozes; }
carregarVozes();
$("#seletor-voz").addEventListener("change", e => { prefs.vozNome = e.target.value; gravarLocal(CHAVE_PREFS, prefs); });
function falar(texto) {
  if (!("speechSynthesis" in window) || !texto) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-BR";
  const v = vozes.find(x => x.name === prefs.vozNome); if (v) u.voice = v;
  speechSynthesis.speak(u);
}

/* ---------- diálogos ---------- */
let origemFoco = null;
function abrirDialogo(id) { origemFoco = document.activeElement; const d = $(id); d.showModal(); const h = d.querySelector("h2"); h.setAttribute("tabindex", "-1"); h.focus(); }
$$("dialog").forEach(d => {
  d.addEventListener("close", () => { origemFoco && origemFoco.focus(); });
  $$("[data-fechar]", d).forEach(b => b.addEventListener("click", () => d.close()));
});
$("#btn-sobre").addEventListener("click", () => abrirDialogo("#dlg-sobre"));
$("#btn-atalhos").addEventListener("click", () => abrirDialogo("#dlg-atalhos"));
$("#btn-referenciais").addEventListener("click", () => { renderReferenciais(); abrirDialogo("#dlg-referenciais"); });
$("#btn-ia").addEventListener("click", () => { carregarIAnoForm(); abrirDialogo("#dlg-ia"); });

function renderReferenciais() {
  const grupos = {};
  const add = (f, texto) => { (grupos[f[0]] = grupos[f[0]] || []).push(texto + (f[1] ? ` (${f[1]})` : "")); };
  ORIENTACOES_ROTEIRO.forEach(r => add(r.fonte, r.texto));
  Object.values(ESTRATEGIAS).forEach(e => e.fontes.forEach(f => add(f, e.rotulo + ": " + e.texto)));
  Object.values(REGRAS_POR_TIPO).forEach(l => l.forEach(r => add(r.fonte, r.texto)));
  PARAMETROS_AMPLIADO.forEach(r => add(r.fonte, r.texto));
  const li = (t, f) => `<li>${esc(t)} <span class="fonte-regra">${esc(fonteTxt(f))}</span></li>`;
  const ck = checklistAcessibilidade(item);
  $("#ref-conteudo").innerHTML = `
    <section class="ref-grupo" aria-labelledby="ref-como">
      <h3 id="ref-como">Como as regras foram construídas</h3>
      <p>Os critérios dos manuais de adaptação, de audiodescrição e de livros ampliados do Instituto Benjamin Constant e as habilidades da BNCC foram convertidos em regras guardadas em um arquivo próprio da ferramenta. Cada regra traz a fonte e a página. Quando a regra não tem correspondência explícita nos manuais, ela aparece como “critério interno do Verbaliza” e será avaliada na pesquisa.</p>
    </section>
    <section class="ref-grupo" aria-labelledby="ref-verif">
      <h3 id="ref-verif">Regras da verificação automática do roteiro (etapa 3)</h3>
      <ul class="lista-regras">${REGRAS_VERIFICACAO.map(r => li(r.texto, r.fonte)).join("")}</ul>
    </section>
    <section class="ref-grupo" aria-labelledby="ref-rev">
      <h3 id="ref-rev">Itens da revisão do professor (etapa 5)</h3>
      <ul class="lista-regras">${CHECKLIST_PROFESSOR.map(c => li(c.texto, c.fonte)).join("")}</ul>
    </section>
    <section class="ref-grupo" aria-labelledby="ref-ck">
      <h3 id="ref-ck">Itens do checklist de acessibilidade (etapa 6)</h3>
      ${GRUPOS_CHECKLIST.map(([g, rot]) => `<h4>${esc(rot)}</h4><ul class="lista-regras">${ck.filter(x => x.grupo === g).map(x => li(x.texto, x.fonte)).join("")}</ul>`).join("")}
    </section>
    <h3>Regras agrupadas por referencial</h3>` + Object.keys(FONTES).filter(k => grupos[k] || k === "MEC").map(k => `
    <section class="ref-grupo" aria-labelledby="ref-${k}">
      <h4 id="ref-${k}">${esc(FONTES[k].sigla)}</h4>
      <p class="ref-completa">${esc(FONTES[k].ref)}</p>
      ${grupos[k] ? `<ul class="lista-regras">${[...new Set(grupos[k])].map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    </section>`).join("");
}

/* ---------- configuração de IA ---------- */
const MODELOS_PADRAO = { gemini: "gemini-2.5-flash", openai: "gpt-4.1-mini", anthropic: "claude-sonnet-4-5", nenhum: "" };
function lerIA() { return Object.assign({ provedor: "nenhum", modelo: "", chave: "" }, lerLocal(CHAVE_IA) || {}, lerSessao(CHAVE_IA) || {}); }
function carregarIAnoForm() {
  const c = lerIA();
  $("#ia-provedor").value = c.provedor; $("#ia-modelo").value = c.modelo || MODELOS_PADRAO[c.provedor];
  $("#ia-chave").value = c.chave || ""; $("#ia-lembrar").checked = !!(lerLocal(CHAVE_IA) || {}).chave;
}
$("#ia-provedor").addEventListener("change", e => { $("#ia-modelo").value = MODELOS_PADRAO[e.target.value] || ""; });
$("#ia-salvar").addEventListener("click", () => {
  const c = { provedor: $("#ia-provedor").value, modelo: $("#ia-modelo").value.trim(), chave: $("#ia-chave").value.trim() };
  const lembrar = $("#ia-lembrar").checked;
  gravarLocal(CHAVE_IA, { provedor: c.provedor, modelo: c.modelo, chave: lembrar ? c.chave : "" });
  gravarSessao(CHAVE_IA, c);
  $("#dlg-ia").close();
  anunciar(c.provedor === "nenhum" ? "Configuração salva. Nenhum serviço de IA será usado." : "Configuração de IA salva.");
  if (etapaAtual === "roteiro") renderEtapa(false);
});

async function chamarIA(instrucao, dataURL) {
  const c = lerIA();
  if (c.provedor === "nenhum" || !c.chave) throw new Error("Nenhum serviço de IA configurado.");
  const b64 = dataURL.split(",")[1];
  const mime = (dataURL.match(/^data:([^;]+)/) || [])[1] || "image/jpeg";
  let r, j;
  if (c.provedor === "gemini") {
    r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(c.modelo)}:generateContent`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": c.chave },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: instrucao }, { inline_data: { mime_type: mime, data: b64 } }] }] })
    });
    j = await r.json(); if (!r.ok) throw new Error((j.error && j.error.message) || r.statusText);
    return (j.candidates && j.candidates[0] && j.candidates[0].content.parts.map(p => p.text || "").join("")) || "";
  }
  if (c.provedor === "openai") {
    r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + c.chave },
      body: JSON.stringify({ model: c.modelo, messages: [{ role: "user", content: [{ type: "text", text: instrucao }, { type: "image_url", image_url: { url: dataURL } }] }] })
    });
    j = await r.json(); if (!r.ok) throw new Error((j.error && j.error.message) || r.statusText);
    return j.choices[0].message.content || "";
  }
  if (c.provedor === "anthropic") {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "content-type": "application/json", "x-api-key": c.chave, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: c.modelo, max_tokens: 1500, messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: mime, data: b64 } }, { type: "text", text: instrucao }] }] })
    });
    j = await r.json(); if (!r.ok) throw new Error((j.error && j.error.message) || r.statusText);
    return (j.content || []).map(x => x.text || "").join("");
  }
  throw new Error("Serviço desconhecido.");
}

/* ---------- estado ---------- */
function itemVazio() {
  return {
    id: uid(), criadoEm: agora(), atualizadoEm: agora(),
    material: { titulo: "", componente: "Língua Portuguesa", ano: "", destinatarios: [], tituloObra: "", fonte: "", pagina: "", enunciado: "", legenda: "", imagem: "", imagemNome: "" },
    analise: { tipo: "", necessaria: "sim", legenda: "", legendaRelevante: "", mencionada: "sim", finalidade: "", contexto: "", quadros: "1" },
    quadros: [{ visual: "", verbal: "" }],
    pesquisa: { generica: "", guiadaBruta: "", origemGenerica: "" },
    estrategia: "",
    roteiro: { nota: "", descricao: "", alternativa: "", duvidas: "", origem: "" },
    ampliado: { fonte: "Arial", tamanho: "20", entrelinha: "1.3", ajustes: [] },
    revisao: { checks: {}, status: "rascunho" },
    validacao: { consultor: "", data: "", dimensoes: {}, parecer: "", decisao: "" },
    teste: { realizado: false, notas: "" },
    checklist: {}
  };
}
let item = Object.assign(itemVazio(), lerLocal(CHAVE_ATUAL) || {});
let imagemEnvio = ""; // versão de maior resolução, mantida só em memória
let timerSalvar = null;
function salvarAtual() {
  clearTimeout(timerSalvar);
  timerSalvar = setTimeout(() => { item.atualizadoEm = agora(); if (!gravarLocal(CHAVE_ATUAL, item)) anunciar("Não foi possível salvar o rascunho neste navegador."); atualizarStatus(); }, 350);
}
function getPath(o, p) { return p.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }
function setPath(o, p, v) { const ks = p.split("."); const last = ks.pop(); const alvo = ks.reduce((a, k) => (a[k] = a[k] || {}), o); alvo[last] = v; }

function statusMaterial(it) {
  if (it.validacao && it.validacao.decisao === "validado") return { rotulo: "Validado por consultor", cls: "validado" };
  if (it.validacao && it.validacao.decisao === "ajustes") return { rotulo: "Validado com ajustes", cls: "revisado" };
  if (it.revisao && it.revisao.status === "revisado") return { rotulo: "Revisado pelo professor", cls: "revisado" };
  if (it.roteiro && (it.roteiro.origem === "ia")) return { rotulo: "Rascunho de IA", cls: "ia" };
  return { rotulo: "Rascunho", cls: "atencao" };
}
function atualizarStatus() {
  const s = statusMaterial(item);
  $("#status-strip").innerHTML = `<strong>${esc(item.material.titulo || "Material sem título")}</strong> &middot; ${esc(s.rotulo)} &middot; checklist ${(() => { const r = resumoChecklist(checklistAcessibilidade(item)); return r.ok + " de " + r.total; })()} &middot; salvo neste navegador às ${esc(new Date(item.atualizadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))}`;
}

/* ---------- etapas ---------- */
const ETAPAS = [
  { id: "material", rotulo: "Material", sub: "Atividade, série e imagem" },
  { id: "analise", rotulo: "Decisão de adaptação", sub: "Necessidade e finalidade" },
  { id: "roteiro", rotulo: "Roteiro", sub: "Audiodescrição didática" },
  { id: "baixa", rotulo: "Baixa visão", sub: "Imagem e texto ampliados" },
  { id: "revisao", rotulo: "Revisão e validação", sub: "Professor e consultor" },
  { id: "checklist", rotulo: "Checklist de acessibilidade", sub: "Conferência antes da entrega" },
  { id: "exportar", rotulo: "Biblioteca e exportação", sub: "Salvar e baixar" }
];
let etapaAtual = "material";
function renderNav() {
  $("#lista-etapas").innerHTML = ETAPAS.map((e, i) => `<li><button type="button" data-etapa="${e.id}"${e.id === etapaAtual ? ' aria-current="step"' : ""}><span class="num" aria-hidden="true">${i + 1}</span><span><span class="etapa-label">${i + 1}. ${esc(e.rotulo)}</span><span class="etapa-sub">${esc(e.sub)}</span></span></button></li>`).join("");
  $$("#lista-etapas button").forEach(b => b.addEventListener("click", () => irPara(b.dataset.etapa)));
}
function irPara(id, focar = true) { etapaAtual = id; renderNav(); renderEtapa(focar); }

const COMPONENTES = ["Língua Portuguesa", "Matemática", "Ciências", "Física", "Química", "Biologia", "História", "Geografia", "Arte", "Língua Inglesa", "Língua Espanhola", "Educação Física", "Filosofia", "Sociologia", "Outro"];
const ANOS = ["1ª série do ensino médio", "2ª série do ensino médio", "3ª série do ensino médio"];

function opcoes(lista, valor, vazio = "Selecione") { return `<option value="">${esc(vazio)}</option>` + lista.map(x => { const v = typeof x === "string" ? x : x.id, r = typeof x === "string" ? x : x.rotulo; return `<option value="${esc(v)}"${v === valor ? " selected" : ""}>${esc(r)}</option>`; }).join(""); }
function radios(nome, caminho, lista, valor, legenda, dica) {
  return `<div class="campo"><fieldset${dica ? ` aria-describedby="${nome}-dica"` : ""}><legend>${legenda}</legend><div class="radios">${lista.map(([v, r]) => `<label><input type="radio" name="${nome}" value="${esc(v)}" data-k="${caminho}"${v === valor ? " checked" : ""}> ${esc(r)}</label>`).join("")}</div>${dica ? `<p class="hint" id="${nome}-dica">${dica}</p>` : ""}</fieldset></div>`;
}
function rodape(anterior, proxima) {
  return `<div class="nav-etapas-rodape">${anterior ? `<button type="button" class="btn secundario" data-ir="${anterior}">Voltar</button>` : "<span></span>"}${proxima ? `<button type="button" class="btn" data-ir="${proxima}">Continuar</button>` : ""}</div>`;
}

let ctrlRender = null;
function renderEtapa(focar) {
  const p = $("#painel");
  if (ctrlRender) ctrlRender.abort();
  ctrlRender = new AbortController();
  const f = { material: telaMaterial, analise: telaAnalise, roteiro: telaRoteiro, baixa: telaBaixa, revisao: telaRevisao, checklist: telaChecklist, exportar: telaExportar }[etapaAtual];
  p.innerHTML = f();
  ligarCampos(p);
  $$("[data-ir]", p).forEach(b => b.addEventListener("click", () => irPara(b.dataset.ir)));
  const pos = { material: posMaterial, analise: posAnalise, roteiro: posRoteiro, baixa: posBaixa, revisao: null, checklist: posChecklist, exportar: posExportar }[etapaAtual];
  pos && pos(p);
  if (focar) { const h = p.querySelector("h2"); h.setAttribute("tabindex", "-1"); h.focus(); }
  atualizarStatus();
}

/* ligação genérica campo -> estado */
function ligarCampos(raiz) {
  $$("[data-k]", raiz).forEach(el => {
    const k = el.dataset.k;
    const ev = (el.tagName === "SELECT" || el.type === "radio" || el.type === "checkbox") ? "change" : "input";
    el.addEventListener(ev, () => {
      if (el.type === "checkbox" && el.dataset.grupo) {
        const atual = new Set(getPath(item, k) || []);
        el.checked ? atual.add(el.value) : atual.delete(el.value);
        setPath(item, k, [...atual]);
      } else if (el.type === "checkbox") setPath(item, k, el.checked);
      else if (el.type === "radio") { if (el.checked) setPath(item, k, el.value); }
      else setPath(item, k, el.value);
      if (k === "roteiro.descricao" && item.roteiro.origem === "ia") item.roteiro.origem = "ia-editado";
      salvarAtual();
      el.dispatchEvent(new CustomEvent("trama:mudou", { bubbles: true }));
    });
  });
}

/* ===== Etapa 1: Material ===== */
function telaMaterial() {
  const m = item.material;
  return `
  <h2>1. Material</h2>
  <p class="lead">Registre a atividade de Língua Portuguesa e a tirinha, charge, cartum ou meme que precisa ser adaptado. A aplicação trabalha com um texto multimodal por vez, sempre ligado a uma atividade.</p>
  <div class="campo"><label for="m-titulo">Título do material ou da atividade <span class="obrigatorio" aria-hidden="true">*</span></label>
    <input type="text" id="m-titulo" data-k="material.titulo" value="${esc(m.titulo)}" required aria-required="true"></div>
  <div class="grid-2">
    <div class="campo"><label for="m-ano">Série</label><select id="m-ano" data-k="material.ano">${opcoes(ANOS, m.ano)}</select></div>
    <div class="campo"><label for="m-obra">Título da tirinha, charge, cartum ou meme (se houver)</label><input type="text" id="m-obra" data-k="material.tituloObra" value="${esc(m.tituloObra)}"></div>
  </div>
  <div class="campo"><label for="m-hab">Habilidade da BNCC mobilizada pela atividade</label><select id="m-hab" data-k="material.habilidade">${opcoes(HABILIDADES_BNCC, m.habilidade || "")}</select></div>
  <div class="campo"><label for="m-fonte">Autoria e fonte (por exemplo, autor da tirinha, livro didático)</label><input type="text" id="m-fonte" data-k="material.fonte" value="${esc(m.fonte)}"></div>
  <div class="campo"><fieldset><legend>Estudantes a quem o material se destina</legend><div class="checks">
    <label><input type="checkbox" value="cego" data-grupo="1" data-k="material.destinatarios"${m.destinatarios.includes("cego") ? " checked" : ""}> Estudantes cegos (braille ou leitor de tela)</label>
    <label><input type="checkbox" value="baixa" data-grupo="1" data-k="material.destinatarios"${m.destinatarios.includes("baixa") ? " checked" : ""}> Estudantes com baixa visão (material ampliado)</label>
  </div></fieldset></div>
  <div class="campo"><label for="m-pag">Página do material original</label><input type="text" id="m-pag" data-k="material.pagina" value="${esc(m.pagina)}" inputmode="numeric" aria-describedby="m-pag-dica">
    <p class="hint" id="m-pag-dica">No material ampliado, a página do original é indicada entre os símbolos menor que e maior que. ${esc(fonteTxt(["AMPLIADO", "p. 16"]))}</p></div>
  <div class="campo"><label for="m-enun">Enunciado ou atividade ligada à imagem</label><textarea id="m-enun" rows="4" data-k="material.enunciado">${esc(m.enunciado)}</textarea></div>
  <div class="campo"><label for="m-leg">Legenda da imagem no original</label><textarea id="m-leg" rows="2" data-k="material.legenda" aria-describedby="m-leg-dica">${esc(m.legenda)}</textarea>
    <p class="hint" id="m-leg-dica">Deixe em branco se a imagem não tem legenda.</p></div>
  <div class="campo" role="group" aria-labelledby="m-img-rot"><p class="rotulo-campo" id="m-img-rot">Imagem ou PDF da atividade</p>
    <input type="file" id="m-img" hidden tabindex="-1" accept="image/png,image/jpeg,image/webp,image/gif,application/pdf">
    <div class="acoes-linha" style="align-items:center"><button type="button" class="btn secundario" id="m-img-btn" aria-describedby="m-img-nome m-img-dica">Escolher imagem ou PDF</button>
    <span id="m-img-nome">${m.imagemNome ? "Arquivo atual: " + esc(m.imagemNome) : "Nenhum arquivo escolhido"}</span></div>
    <p class="hint" id="m-img-dica">Aceita imagem (PNG, JPG, WEBP) ou PDF. No PDF, escolha a página que contém a tirinha, a charge, o cartum ou o meme; o texto da página pode ser copiado para o enunciado. A imagem fica neste navegador. Ela só é enviada a um serviço de IA se você pedir um rascunho na etapa 3. Não use imagens que identifiquem estudantes.</p>
    <div id="m-pdf" hidden></div>
    <div id="m-img-previa">${m.imagem ? `<img class="previa-imagem" src="${m.imagem}" alt="Prévia da imagem anexada (${esc(m.imagemNome || "sem nome")}). A descrição é construída na etapa 3.">
      <button type="button" class="btn secundario pequeno" id="m-img-remover" style="margin-top:.6rem">Remover imagem</button>` : ""}</div>
  </div>
  ${rodape(null, "analise")}`;
}
function reduzirImagem(dataURL, max, qual) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => { const s = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL("image/jpeg", qual)); };
    im.onerror = () => rej(new Error("Não foi possível ler a imagem."));
    im.src = dataURL;
  });
}
let pdfAtual = null;
function carregarPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  return new Promise((ok, falha) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; ok(window.pdfjsLib); };
    s.onerror = () => falha(new Error("Não foi possível carregar o leitor de PDF. Verifique a conexão com a internet ou anexe a imagem da página."));
    document.head.appendChild(s);
  });
}
async function usarImagem(dataURL, nome) {
  imagemEnvio = await reduzirImagem(dataURL, 1600, 0.85);
  item.material.imagem = await reduzirImagem(dataURL, 640, 0.72);
  item.material.imagemNome = nome; salvarAtual();
}
function montarCaixaPdf(p, foco) {
  if (!pdfAtual) return;
  const n = pdfAtual.doc.numPages, box = $("#m-pdf", p);
  box.hidden = false;
  box.innerHTML = `<fieldset class="cartao"><legend>PDF anexado: ${esc(pdfAtual.nome)} (${n} página${n > 1 ? "s" : ""})</legend>
    <div class="campo"><label for="m-pdf-pag">Página que contém a imagem</label><input type="number" id="m-pdf-pag" min="1" max="${n}" value="${pdfAtual.pagina || 1}" inputmode="numeric"></div>
    <div class="acoes-linha"><button type="button" class="btn secundario pequeno" id="m-pdf-usar">Usar esta página como imagem</button>
    <button type="button" class="btn secundario pequeno" id="m-pdf-texto">Copiar o texto desta página para o enunciado</button></div></fieldset>`;
  const pag = () => Math.min(n, Math.max(1, parseInt($("#m-pdf-pag", p).value, 10) || 1));
  $("#m-pdf-usar", p).addEventListener("click", async () => {
    const k = pag(); pdfAtual.pagina = k;
    try {
      const page = await pdfAtual.doc.getPage(k), vp = page.getViewport({ scale: 2 });
      const cv = document.createElement("canvas"); cv.width = vp.width; cv.height = vp.height;
      await page.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
      await usarImagem(cv.toDataURL("image/png"), `${pdfAtual.nome}, página ${k}`);
      renderEtapa(false); anunciar(`Página ${k} do PDF anexada como imagem.`); $("#m-pdf-pag") ? $("#m-pdf-pag").focus() : $("#m-img-btn").focus();
    } catch (err) { anunciar("Não foi possível converter a página: " + err.message); }
  });
  $("#m-pdf-texto", p).addEventListener("click", async () => {
    const k = pag();
    const page = await pdfAtual.doc.getPage(k), tc = await page.getTextContent();
    const txt = tc.items.map(x => x.str).join(" ").replace(/\s+/g, " ").trim();
    if (!txt) { anunciar("A página não tem texto selecionável."); return; }
    item.material.enunciado = (item.material.enunciado ? item.material.enunciado + "\n" : "") + txt; salvarAtual();
    const en = $("#m-enun", p); if (en) en.value = item.material.enunciado;
    anunciar("Texto da página copiado para o enunciado. Revise e apague o que não for da atividade.");
  });
  if (foco) $("#m-pdf-pag", p).focus();
}
function posMaterial(p) {
  montarCaixaPdf(p, false);
  $("#m-img-btn", p).addEventListener("click", () => $("#m-img", p).click());
  $("#m-img", p).addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const fr = new FileReader();
    if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) {
      fr.onload = async () => {
        try {
          anunciar("Abrindo o PDF.");
          const lib = await carregarPdfJs();
          pdfAtual = { doc: await lib.getDocument({ data: new Uint8Array(fr.result) }).promise, nome: f.name, pagina: 1 };
          const nm = $("#m-img-nome", p); if (nm) nm.textContent = "Arquivo atual: " + f.name;
          montarCaixaPdf(p, true);
          anunciar(`PDF aberto, com ${pdfAtual.doc.numPages} página(s). Escolha a página que contém a imagem.`);
        } catch (err) { anunciar(err.message); }
      };
      fr.readAsArrayBuffer(f);
      return;
    }
    pdfAtual = null;
    fr.onload = async () => {
      try {
        await usarImagem(fr.result, f.name); renderEtapa(false);
        anunciar("Imagem anexada: " + f.name + ".");
        $("#m-img-btn").focus();
      } catch (err) { anunciar(err.message); }
    };
    fr.readAsDataURL(f);
  });
  const rem = $("#m-img-remover", p);
  rem && rem.addEventListener("click", () => { item.material.imagem = ""; item.material.imagemNome = ""; imagemEnvio = ""; pdfAtual = null; salvarAtual(); renderEtapa(false); $("#m-img-btn").focus(); anunciar("Imagem removida."); });
}

/* ===== Etapa 2: Análise ===== */
function telaAnalise() {
  const a = item.analise;
  if (!a.legenda && item.material.legenda.trim()) a.legenda = "sim";
  return `
  <h2>2. Decisão de adaptação</h2>
  <p class="lead">Antes de descrever, decida se a imagem precisa ser adaptada e para quê. Na audiodescrição didática, a mesma imagem pode receber descrições diferentes conforme a atividade. ${esc(fonteTxt(["GEPA", "p. 23"]))}</p>
  <div class="grid-2">
    <div class="campo"><label for="a-tipo">Gênero</label><select id="a-tipo" data-k="analise.tipo" aria-describedby="a-tipo-dica">${opcoes(TIPOS_IMAGEM, a.tipo)}</select>
      <p class="hint" id="a-tipo-dica">${esc(fonteTxt(["GEPA", "p. 60; 66"]))}</p></div>
    <div class="campo"><label for="a-nq">Número de quadros</label><input type="number" id="a-nq" min="1" max="12" data-k="analise.quadros" value="${esc(a.quadros || "1")}" aria-describedby="a-nq-dica" style="width:100%;border:1.5px solid var(--line-strong);border-radius:8px;background:var(--paper-raised);color:var(--ink);padding:.65rem .75rem">
      <p class="hint" id="a-nq-dica">Charges e cartuns costumam ter quadro único.</p></div>
  </div>
  ${radios("a-dep", "analise.dependencia", [["verbal", "Predominantemente verbal: a imagem apenas ilustra a fala"], ["verbovisual", "Verbo-visual: o efeito nasce do contraste entre fala e imagem"], ["visual", "Predominantemente visual: o efeito está no desenho"]], a.dependencia, "Quanto o efeito de sentido depende da imagem?", "Teste: o efeito se mantém se você ler apenas o texto verbal? Esse registro é usado na análise da pesquisa.")}
  ${radios("a-nec", "analise.necessaria", [["sim", "Sim, a atividade depende da informação da imagem"], ["nao", "Não, a imagem é apenas ilustrativa"]], a.necessaria, "A imagem é necessária para compreender o texto ou realizar a atividade?")}
  ${radios("a-leg", "analise.legenda", [["sim", "Sim"], ["nao", "Não"]], a.legenda, "A imagem tem legenda?")}
  <div id="a-bloco-relevante"${a.necessaria === "nao" && a.legenda === "sim" ? "" : " hidden"}>
  ${radios("a-rel", "analise.legendaRelevante", [["sim", "Sim, traz informação que não está no texto"], ["nao", "Não, é redundante ou não fundamental"]], a.legendaRelevante, "A legenda traz informação relevante?")}
  </div>
  ${radios("a-men", "analise.mencionada", [["sim", "Sim"], ["nao", "Não"]], a.mencionada, "A imagem é mencionada no texto ou no enunciado?")}
  <div class="campo"><label for="a-fin">Efeito de sentido e finalidade: o que o estudante precisa perceber (humor, ironia, crítica) e o que a atividade pede?</label>
    <textarea id="a-fin" rows="3" data-k="analise.finalidade" aria-describedby="a-fin-dica">${esc(a.finalidade)}</textarea>
    <p class="hint" id="a-fin-dica">Registre aqui, e não na descrição, o efeito que o estudante deve inferir. A descrição oferece os elementos; a inferência é do estudante. A mesma imagem pode exigir descrições diferentes conforme a atividade. ${esc(fonteTxt(["GEPA", "p. 23"]))}</p></div>
  <div class="campo"><label for="a-ctx">Contexto necessário para a leitura (fato, personagem ou referência que o estudante precisa conhecer)</label>
    <textarea id="a-ctx" rows="2" data-k="analise.contexto" aria-describedby="a-ctx-dica">${esc(a.contexto || "")}</textarea>
    <p class="hint" id="a-ctx-dica">Comum nas charges. Pode virar nota introdutória, que não faz parte da audiodescrição. ${esc(fonteTxt(["GPEAD", "p. 17-18"]))}</p></div>
  <div id="a-recomendacao" aria-live="polite"></div>
  ${rodape("material", "roteiro")}`;
}
function htmlRecomendacao() {
  const rec = recomendarEstrategia(item.analise);
  if (!rec) return `<p class="hint">Responda às perguntas para ver a estratégia recomendada.</p>`;
  const e = ESTRATEGIAS[rec];
  const especificas = REGRAS_POR_TIPO[item.analise.tipo] || [];
  if (!item.estrategia) item.estrategia = rec;
  const escolhida = item.estrategia || rec;
  return `<section class="recomendacao" aria-labelledby="rec-titulo">
    <h3 id="rec-titulo">Estratégia recomendada: ${esc(e.rotulo)}</h3>
    <p>${esc(e.texto)}</p>
    <p class="fonte-regra">${e.fontes.map(fonteTxt).join(" ")}</p>
    ${especificas.length ? `<h4>Regras para ${esc((TIPOS_IMAGEM.find(t => t.id === item.analise.tipo) || {}).rotulo || "este tipo")}</h4><ul class="lista-regras">${especificas.map(r => `<li>${esc(r.texto)} <span class="fonte-regra">${esc(fonteTxt(r.fonte))}</span></li>`).join("")}</ul>` : ""}
    <div class="campo" style="margin-top:1rem"><label for="a-est">Estratégia adotada (decisão do professor)</label>
      <select id="a-est">${Object.entries(ESTRATEGIAS).map(([k, v]) => `<option value="${k}"${k === escolhida ? " selected" : ""}>${esc(v.rotulo)}${k === rec ? " (recomendada)" : ""}</option>`).join("")}</select></div>
  </section>`;
}
function posAnalise(p) {
  const atualizar = () => {
    $("#a-bloco-relevante", p).hidden = !(item.analise.necessaria === "nao" && item.analise.legenda === "sim");
    const box = $("#a-recomendacao", p);
    box.innerHTML = htmlRecomendacao();
    const sel = $("#a-est", box);
    sel && sel.addEventListener("change", () => { item.estrategia = sel.value; salvarAtual(); anunciar("Estratégia adotada: " + sel.options[sel.selectedIndex].text + "."); });
    salvarAtual();
  };
  p.addEventListener("trama:mudou", ev => {
    if (/analise\.(necessaria|legenda|legendaRelevante|mencionada|tipo)/.test(ev.target.dataset.k || "")) { item.estrategia = ""; atualizar(); }
  }, { signal: ctrlRender.signal });
  atualizar();
}

/* ===== Etapa 3: Roteiro ===== */
function quadrosAtuais() {
  const n = Math.max(1, Math.min(12, parseInt(item.analise.quadros, 10) || 1));
  item.quadros = item.quadros || [];
  while (item.quadros.length < n) item.quadros.push({ visual: "", verbal: "" });
  if (item.quadros.length > n) item.quadros = item.quadros.slice(0, n);
  return item.quadros;
}
function telaRoteiro() {
  const r = item.roteiro, c = lerIA();
  const tipoRegras = REGRAS_POR_TIPO[item.analise.tipo] || [];
  const precisaAlt = ["alterar_forma", "mista", "ajustar"].includes(item.estrategia);
  const s = statusMaterial(item);
  if (item.estrategia === "suprimir") {
    return `<h2>3. Roteiro</h2>
    <div class="aviso-ok"><strong>Imagem suprimida.</strong> Pela decisão da etapa 2, esta imagem é apenas ilustrativa e não precisa de roteiro. ${esc(fonteTxt(["GEPA", "p. 32"]))} Se mudar de ideia, altere a estratégia na etapa 2.</div>
    ${rodape("analise", "baixa")}`;
  }
  return `
  <h2>3. Roteiro</h2>
  <p class="lead">Escreva ou revise a audiodescrição didática. Estratégia adotada: <strong>${esc((ESTRATEGIAS[item.estrategia] || {}).rotulo || "não definida (volte à etapa 2)")}</strong>.</p>
  <p><span class="pill ${s.cls}">${esc(s.rotulo)}</span></p>
  <details class="abrir-exp"><summary>Orientações dos manuais para este roteiro</summary>
    <ul class="lista-regras">${ORIENTACOES_ROTEIRO.concat(tipoRegras).map(o => `<li>${esc(o.texto)} <span class="fonte-regra">${esc(fonteTxt(o.fonte))}</span></li>`).join("")}</ul>
  </details>

  <section class="cartao" aria-labelledby="ia-sec" style="margin-top:1.2rem">
    <h3 id="ia-sec">Rascunho com inteligência artificial (opcional)</h3>
    <div class="aviso-ia"><strong>A IA produz apenas um ponto de partida.</strong> A instrução enviada contém as regras dos manuais e a finalidade pedagógica. Estudos com consultores com deficiência visual indicam descrições de IA com omissões e erros, o que exige revisão humana. ${esc(fonteTxt(["PERDIGAO", "e2593"]))}</div>
    ${c.provedor !== "nenhum" && c.chave ? `
      <label class="check-linha"><input type="checkbox" id="r-consent"> Confirmo que a imagem não identifica estudantes e autorizo o envio da imagem e do contexto ao serviço configurado (${esc(c.provedor)}).</label>
      <div class="acoes-linha"><button type="button" class="btn" id="r-gerar">Gerar rascunho com IA</button></div>
      <p class="progresso" id="r-progresso" role="status"></p>`
      : `<p class="hint">Nenhum serviço configurado. Use Configurar IA, no topo, ou copie a instrução para outro assistente.</p>`}
    <div class="acoes-linha"><button type="button" class="btn secundario" id="r-copiar">Copiar instrução com as regras</button></div>
    <details class="abrir-exp"><summary>Colar a resposta de outro assistente</summary>
      <div class="campo"><label for="r-colar">Resposta recebida</label><textarea id="r-colar" rows="6"></textarea></div>
      <button type="button" class="btn secundario" id="r-usar">Usar a resposta colada como rascunho</button>
    </details>
  </section>

  <section class="cartao" aria-labelledby="q-sec">
    <h3 id="q-sec">Quadros</h3>
    <p class="hint">Descreva cada quadro e transcreva o texto verbal. No campo de texto verbal, use uma linha por fala no formato <strong>Quem: texto</strong> (por exemplo, Menino: Por que a gente estuda?). Em memes, use <strong>Superior: texto</strong> e <strong>Inferior: texto</strong>. Para narração, use <strong>Narrador: texto</strong>. Se o formato do balão indicar pensamento, grito ou sussurro, escreva o verbo depois do nome: <strong>Menino pensa: texto</strong>, <strong>Pai grita: texto</strong>. Fontes: GEPA (2025), p. 60-68; GPEAD (2025), p. 21-22.</p>
    ${quadrosAtuais().map((q, i) => `<fieldset class="campo" style="border:1.5px solid var(--line-strong);border-radius:10px;padding:.9rem 1.1rem 1rem"><legend style="font-weight:700;padding:0 .4rem">Quadro ${i + 1}${quadrosAtuais().length > 1 ? " (Q" + (i + 1) + ")" : ""}</legend>
      <label for="q-vis-${i}">Descrição visual (personagens, cenário, gestos, marcas de expressão, recursos gráficos)</label>
      <textarea id="q-vis-${i}" rows="3" data-k="quadros.${i}.visual">${esc(q.visual)}</textarea>
      <label for="q-ver-${i}" style="margin-top:.7rem">Texto verbal, transcrito literalmente</label>
      <textarea id="q-ver-${i}" rows="3" data-k="quadros.${i}.verbal">${esc(q.verbal)}</textarea>
    </fieldset>`).join("")}
    <div class="acoes-linha"><button type="button" class="btn secundario" id="q-montar">Montar a nota de transcrição a partir dos quadros</button></div>
  </section>

  <div class="campo"><label for="r-nota">Nota introdutória (opcional)</label>
    <textarea id="r-nota" rows="2" data-k="roteiro.nota" aria-describedby="r-nota-dica">${esc(r.nota)}</textarea>
    <p class="hint" id="r-nota-dica">Apresenta a obra em linhas gerais e não faz parte da audiodescrição. ${esc(fonteTxt(["GPEAD", "p. 17-18"]))}</p></div>
  <div class="campo"><label for="r-desc">Audiodescrição didática (nota de transcrição)</label>
    <textarea id="r-desc" rows="9" data-k="roteiro.descricao" aria-describedby="r-cont r-desc-dica">${esc(r.descricao)}</textarea>
    <p class="contador" id="r-cont">${contarPalavras(r.descricao)} de 300 palavras</p>
    <p class="hint" id="r-desc-dica">Comece pelo tipo de imagem. Na exportação para braille, o texto vai entre colchetes, como nota de transcrição. ${esc(fonteTxt(["GEPA", "p. 31"]))}</p></div>
  ${precisaAlt ? `<div class="campo"><label for="r-alt">Representação alternativa (por exemplo, tabela com os dados do gráfico)</label>
    <textarea id="r-alt" rows="6" data-k="roteiro.alternativa" aria-describedby="r-alt-dica">${esc(r.alternativa)}</textarea>
    <p class="hint" id="r-alt-dica">Uma linha por registro e colunas separadas por ponto e vírgula. A primeira linha é o cabeçalho. Informe a alteração na nota de transcrição. ${esc(fonteTxt(["GEPA", "p. 25; 73"]))}</p></div>` : ""}
  ${r.duvidas ? `<div class="aviso-atencao"><strong>Dúvidas apontadas no rascunho:</strong> ${esc(r.duvidas)}</div>` : ""}
  <div class="acoes-linha">
    <button type="button" class="btn" id="r-verificar">Verificar roteiro</button>
    <button type="button" class="btn secundario" id="r-ouvir">Ouvir roteiro</button>
    <button type="button" class="btn secundario" id="r-parar">Parar leitura</button>
  </div>
  <details class="abrir-exp"><summary>Modo pesquisa: descrição de comparação (instrução genérica)</summary>
    <p class="hint">Para a pesquisa, guarde a descrição que a mesma IA produz quando recebe apenas a instrução "${esc(INSTRUCAO_GENERICA)}", sem os critérios. Ela será comparada, sem identificação, com o rascunho guiado e com a versão revisada.</p>
    ${item.pesquisa.guiadaBruta ? `<p class="hint"><strong>Rascunho guiado original guardado</strong> (${contarPalavras(item.pesquisa.guiadaBruta)} palavras).</p>` : `<p class="hint">O rascunho guiado será guardado automaticamente quando for gerado ou colado.</p>`}
    <div class="campo"><label for="p-gen">Descrição genérica</label><textarea id="p-gen" rows="5" data-k="pesquisa.generica">${esc(item.pesquisa.generica)}</textarea></div>
    ${c.provedor !== "nenhum" && c.chave ? `<button type="button" class="btn secundario" id="p-gerar">Gerar descrição genérica com o serviço configurado</button><p class="progresso" id="p-prog" role="status"></p>` : `<p class="hint">Sem serviço configurado: envie a imagem a um assistente com a instrução "${esc(INSTRUCAO_GENERICA)}" e cole a resposta acima.</p>`}
  </details>
  <section id="r-resultado" aria-labelledby="r-res-titulo" style="margin-top:1.2rem" hidden>
    <h3 id="r-res-titulo" tabindex="-1">Resultado da verificação</h3>
    <ul class="verif-lista" id="r-lista"></ul>
    <p class="hint">A verificação aponta indícios a partir das regras. A decisão final é do professor e a validação é do consultor.</p>
  </section>
  ${rodape("analise", "baixa")}`;
}
function verificarEMostrar(p, focar) {
  const res = verificarRoteiro(item);
  const nt = verificarNotaTranscricao(item.roteiro.descricao); if (nt) res.push(nt);
  const rotulos = { erro: "Corrigir", atencao: "Revisar", ok: "Adequado", info: "Observação" };
  $("#r-lista", p).innerHTML = res.map(x => `<li class="${x.nivel}"><span class="nivel">${rotulos[x.nivel]}</span>${esc(x.mensagem)} <span class="fonte-regra">${esc(fonteTxt(x.fonte))}</span></li>`).join("");
  $("#r-resultado", p).hidden = false;
  const n = { erro: 0, atencao: 0 }; res.forEach(x => { if (n[x.nivel] != null) n[x.nivel]++; });
  if (focar) $("#r-res-titulo", p).focus();
  anunciar(`Verificação concluída: ${n.erro} item(ns) para corrigir e ${n.atencao} para revisar.`);
}
function aplicarRascunho(texto, origem) {
  const out = interpretarRespostaIA(texto);
  if (out.descricao) item.roteiro.descricao = out.descricao;
  item.roteiro.nota = out.nota || item.roteiro.nota;
  if (out.alternativa) item.roteiro.alternativa = out.alternativa;
  item.roteiro.duvidas = out.duvidas;
  item.roteiro.origem = origem;
  item.pesquisa = item.pesquisa || {};
  item.pesquisa.guiadaBruta = out.descricao;
  item.revisao.status = "rascunho";
  salvarAtual(); renderEtapa(false);
  $("#r-desc").focus();
  anunciar("Rascunho inserido no campo de audiodescrição. Revise antes de aprovar.");
}
function posRoteiro(p) {
  if (item.estrategia === "suprimir") return;
  const desc = $("#r-desc", p);
  desc.addEventListener("input", () => { $("#r-cont", p).textContent = contarPalavras(desc.value) + " de 300 palavras"; });
  $("#r-verificar", p).addEventListener("click", () => verificarEMostrar(p, true));
  $("#q-montar", p).addEventListener("click", () => {
    const nota = montarNotaGenero(item);
    if (!nota) { anunciar("Preencha ao menos um quadro antes de montar a nota."); return; }
    if (item.roteiro.descricao.trim() && item.roteiro.descricao.trim() !== nota) item.roteiro.anterior = item.roteiro.descricao;
    item.roteiro.descricao = nota; if (!item.roteiro.origem) item.roteiro.origem = "professor";
    salvarAtual(); renderEtapa(false); $("#r-desc").focus();
    anunciar("Nota de transcrição montada a partir dos quadros. Revise o texto no campo de audiodescrição.");
  });
  const pg2 = $("#p-gerar", p);
  pg2 && pg2.addEventListener("click", async () => {
    const prog = $("#p-prog", p); const img = imagemEnvio || item.material.imagem;
    if (!img) { prog.textContent = "Anexe a imagem na etapa 1."; return; }
    pg2.disabled = true; prog.textContent = "Gerando a descrição genérica.";
    try { item.pesquisa.generica = (await chamarIA(INSTRUCAO_GENERICA, img)).trim(); item.pesquisa.origemGenerica = lerIA().provedor + " " + lerIA().modelo + " " + agora(); salvarAtual(); renderEtapa(false); $("#p-gen").focus(); anunciar("Descrição genérica guardada."); }
    catch (e) { prog.textContent = "Não foi possível gerar: " + e.message; pg2.disabled = false; }
  });
  $("#r-ouvir", p).addEventListener("click", () => falar([item.roteiro.nota, item.roteiro.descricao].filter(Boolean).join(". ")));
  $("#r-parar", p).addEventListener("click", () => { "speechSynthesis" in window && speechSynthesis.cancel(); });
  $("#r-copiar", p).addEventListener("click", async () => {
    const t = montarInstrucaoIA(item);
    try { await navigator.clipboard.writeText(t); anunciar("Instrução copiada. Cole no assistente de sua preferência junto com a imagem."); }
    catch (e) { const ta = $("#r-colar", p); ta.closest("details").open = true; ta.value = t; ta.select(); anunciar("Não foi possível copiar automaticamente. A instrução foi colocada no campo de resposta para você copiar."); }
  });
  $("#r-usar", p).addEventListener("click", () => { const t = $("#r-colar", p).value.trim(); if (!t) { anunciar("O campo de resposta está vazio."); return; } aplicarRascunho(t, "ia"); });
  const g = $("#r-gerar", p);
  g && g.addEventListener("click", async () => {
    const prog = $("#r-progresso", p);
    if (!$("#r-consent", p).checked) { prog.textContent = "Marque a confirmação antes de enviar a imagem."; $("#r-consent", p).focus(); return; }
    const img = imagemEnvio || item.material.imagem;
    if (!img) { prog.textContent = "Anexe a imagem na etapa 1 antes de gerar o rascunho."; return; }
    if (!item.analise.finalidade.trim()) { prog.textContent = "Registre a finalidade pedagógica na etapa 2. Ela orienta o rascunho."; return; }
    g.disabled = true; prog.textContent = "Gerando rascunho. Isso pode levar alguns segundos.";
    try { const resp = await chamarIA(montarInstrucaoIA(item), img); aplicarRascunho(resp, "ia"); }
    catch (e) { prog.textContent = "Não foi possível gerar o rascunho: " + e.message; g.disabled = false; }
  });
}

/* ===== Etapa 4: Baixa visão ===== */
const AJUSTES_IMAGEM = [
  ["ampliar", "Ampliar a imagem sem perder nitidez"],
  ["traco", "Simplificar em estilo de traço, com contornos definidos"],
  ["contraste", "Aumentar o contraste entre figura e fundo"],
  ["fundo", "Retirar do fundo elementos sem função na atividade"],
  ["rotulos", "Rótulos e legendas internos em fonte ampliada"],
  ["cores", "Substituir combinações de cor de baixo contraste"]
];
function telaBaixa() {
  const a = item.ampliado, temBaixa = item.material.destinatarios.includes("baixa");
  return `
  <h2>4. Baixa visão</h2>
  ${temBaixa ? "" : `<div class="aviso-atencao">Na etapa 1, o material não foi indicado para estudantes com baixa visão. Você pode pular esta etapa.</div>`}
  <p class="lead">Ajuste a imagem e o texto para o estudante com baixa visão. Os parâmetros seguem o manual de livros ampliados do IBC. ${esc(fonteTxt(["AMPLIADO", "p. 13-18"]))}</p>
  <div class="campo"><fieldset><legend>Ajustes previstos para a imagem</legend><div class="checks">
    ${AJUSTES_IMAGEM.map(([v, r]) => `<label><input type="checkbox" value="${v}" data-grupo="1" data-k="ampliado.ajustes"${a.ajustes.includes(v) ? " checked" : ""}> ${esc(r)}</label>`).join("")}
  </div><p class="hint">${esc(fonteTxt(["AMPLIADO", "p. 17"]))} O Verbaliza registra os ajustes; a edição da imagem é feita em programa próprio ou pelo setor de produção.</p></fieldset></div>
  <div class="grid-3">
    <div class="campo"><label for="b-fonte">Fonte</label><select id="b-fonte" data-k="ampliado.fonte">${["Arial", "Verdana", "Tahoma", "APHont"].map(x => `<option${x === a.fonte ? " selected" : ""}>${x}</option>`).join("")}</select></div>
    <div class="campo"><label for="b-tam">Corpo do texto</label><select id="b-tam" data-k="ampliado.tamanho">${["18", "19", "20", "21", "22"].map(x => `<option value="${x}"${x === a.tamanho ? " selected" : ""}>${x} pontos</option>`).join("")}</select></div>
    <div class="campo"><label for="b-ent">Entrelinha</label><select id="b-ent" data-k="ampliado.entrelinha"><option value="1.25"${a.entrelinha === "1.25" ? " selected" : ""}>25% maior que o corpo</option><option value="1.3"${a.entrelinha === "1.3" ? " selected" : ""}>30% maior que o corpo</option></select></div>
  </div>
  <p class="hint">Títulos em 24 pontos; itálico substituído por negrito; caixa alta e baixa. ${esc(fonteTxt(["AMPLIADO", "p. 14"]))}</p>
  <h3>Prévia do texto ampliado</h3>
  <div class="previa-ampliada" id="b-previa"></div>
  <div class="acoes-linha"><button type="button" class="btn secundario" id="b-baixar">Baixar versão ampliada para impressão (HTML)</button></div>
  ${rodape("roteiro", "revisao")}`;
}
function htmlAmpliado(it) {
  const a = it.ampliado, m = it.material, r = it.roteiro;
  const corpo = `font-family:${a.fonte},Arial,sans-serif;font-size:${a.tamanho}pt;line-height:${a.entrelinha};color:#000;background:#fff;`;
  const p = t => t ? `<p style="margin:0 0 .6em">${esc(t)}</p>` : "";
  return `<div style="${corpo}">
    <p class="titulo-ampliado" style="font-size:24pt;font-weight:700;margin:0 0 .5em">${esc(m.titulo || "Material sem título")}</p>
    ${m.pagina ? p("<" + m.pagina + ">") : ""}
    ${p(m.enunciado)}
    ${it.estrategia !== "suprimir" && r.descricao ? p("[" + r.descricao.replace(/^\[|\]$/g, "") + "]") : ""}
    ${m.legenda ? p("Legenda: " + m.legenda) : ""}
  </div>`;
}
function posBaixa(p) {
  const upd = () => { $("#b-previa", p).innerHTML = htmlAmpliado(item); };
  p.addEventListener("trama:mudou", upd, { signal: ctrlRender.signal }); upd();
  $("#b-baixar", p).addEventListener("click", () => baixar(`${slug(item.material.titulo)}-ampliado.html`, documentoHTML(item.material.titulo + " (versão ampliada)", htmlAmpliado(item)), "text/html"));
}

/* ===== Etapa 5: Revisão e validação ===== */
function telaRevisao() {
  const rv = item.revisao, v = item.validacao;
  return `
  <h2>5. Revisão e validação</h2>
  <p class="lead">O professor revisa o roteiro com a imagem original. Depois, um consultor com deficiência visual avalia a pertinência, a qualidade, a eficácia e a funcionalidade das escolhas. ${esc(fonteTxt(["GPEAD", "p. 14-15"]))}</p>
  <section class="cartao" aria-labelledby="rv-t">
    <h3 id="rv-t">Revisão do professor</h3>
    <div class="checks">${CHECKLIST_PROFESSOR.map(c => `<label><input type="checkbox" data-k="revisao.checks.${c.id}"${rv.checks[c.id] ? " checked" : ""}> <span>${esc(c.texto)} <span class="fonte-regra">${esc(fonteTxt(c.fonte))}</span></span></label>`).join("")}</div>
    ${radios("rv-st", "revisao.status", [["rascunho", "Ainda em rascunho"], ["revisado", "Revisado pelo professor e pronto para o consultor"]], rv.status, "Situação do roteiro")}
  </section>
  <section class="cartao" aria-labelledby="vc-t">
    <h3 id="vc-t">Validação pelo consultor com deficiência visual</h3>
    <div class="grid-2">
      <div class="campo"><label for="vc-nome">Nome ou código do consultor</label><input type="text" id="vc-nome" data-k="validacao.consultor" value="${esc(v.consultor)}" aria-describedby="vc-nome-dica"><p class="hint" id="vc-nome-dica">Na pesquisa, use um código no lugar do nome.</p></div>
      <div class="campo"><label for="vc-data">Data da validação</label><input type="date" id="vc-data" data-k="validacao.data" value="${esc(v.data)}"></div>
    </div>
    ${DIMENSOES_CONSULTOR.map(d => radios("vc-" + d.id, "validacao.dimensoes." + d.id, [["adequado", "Adequado"], ["parcial", "Parcialmente adequado"], ["inadequado", "Inadequado"]], v.dimensoes[d.id], d.rotulo)).join("")}
    <div class="campo"><label for="vc-par">Parecer e sugestões do consultor</label><textarea id="vc-par" rows="4" data-k="validacao.parecer">${esc(v.parecer)}</textarea></div>
    ${radios("vc-dec", "validacao.decisao", [["validado", "Validado"], ["ajustes", "Validado com ajustes"], ["nao", "Não validado: refazer o roteiro"]], v.decisao, "Decisão")}
  </section>
  <section class="cartao" aria-labelledby="te-t">
    <h3 id="te-t">Teste de leitura</h3>
    <p class="hint">O manual do GEPA recomenda testar as adaptações com estudantes ou revisores braille, pois só a leitura tátil confirma o resultado. ${esc(fonteTxt(["GEPA", "p. 22"]))}</p>
    <label class="check-linha"><input type="checkbox" data-k="teste.realizado"${item.teste.realizado ? " checked" : ""}> O teste de leitura foi realizado</label>
    <div class="campo" style="margin-top:.8rem"><label for="te-not">Registro do teste (sem identificar estudantes)</label><textarea id="te-not" rows="3" data-k="teste.notas">${esc(item.teste.notas)}</textarea></div>
  </section>
  ${rodape("baixa", "checklist")}`;
}

/* ===== Etapa 6: Checklist de acessibilidade ===== */
const NUM_ETAPA = id => ETAPAS.findIndex(e => e.id === id) + 1;
function htmlResumoChecklist(L) {
  const r = resumoChecklist(L);
  const txt = r.pendentes ? `${r.ok} de ${r.total} itens cumpridos. ${r.pendentes} pendente(s).` : `Todos os ${r.total} itens aplicáveis foram cumpridos.`;
  return `<p><strong>${esc(txt)}</strong></p><progress max="${r.total}" value="${r.ok}" aria-label="Itens cumpridos do checklist">${r.ok} de ${r.total}</progress>`;
}
function telaChecklist() {
  const L = checklistAcessibilidade(item);
  const li = x => `<li id="ck-${x.id}" class="${x.estado}">
      <span class="nivel" id="ck-${x.id}-e">${ROTULO_ESTADO[x.estado]}</span>
      ${x.auto ? `<span>${esc(x.texto)}</span>` : `<label class="check-inline"><input type="checkbox" data-k="checklist.${x.id}"${(item.checklist || {})[x.id] ? " checked" : ""}${x.estado === "na" ? " disabled" : ""}> ${esc(x.texto)}</label>`}
      <span class="ck-detalhe" id="ck-${x.id}-d">${esc(x.detalhe)}</span>
      <span class="fonte-regra">${esc(fonteTxt(x.fonte))}</span>
      ${x.auto && x.estado === "pendente" ? `<button type="button" class="btn secundario pequeno" data-ir="${x.etapa}">Ir para a etapa ${NUM_ETAPA(x.etapa)}</button>` : ""}
    </li>`;
  return `
  <h2>6. Checklist de acessibilidade</h2>
  <p class="lead">Confira se todas as etapas de acessibilidade foram cumpridas antes de entregar o material ao estudante. Os itens dos quatro primeiros grupos são calculados pela aplicação a partir do que foi registrado nas etapas anteriores. Os itens do último grupo dependem de verificação humana e devem ser marcados por você. O checklist não substitui a revisão do professor nem a validação do consultor com deficiência visual.</p>
  <div class="cartao resumo-checklist" id="ck-resumo" role="status" aria-live="polite">${htmlResumoChecklist(L)}</div>
  ${GRUPOS_CHECKLIST.map(([g, rot]) => `<section class="cartao" aria-labelledby="ck-g-${g}">
    <h3 id="ck-g-${g}">${esc(rot)}</h3>
    <ul class="verif-lista checklist-acess">${L.filter(x => x.grupo === g).map(li).join("")}</ul>
  </section>`).join("")}
  ${rodape("revisao", "exportar")}`;
}
function posChecklist(p) {
  p.addEventListener("trama:mudou", () => {
    const L = checklistAcessibilidade(item);
    L.forEach(x => { const el = $("#ck-" + x.id, p); if (!el) return; el.className = x.estado; $("#ck-" + x.id + "-e", p).textContent = ROTULO_ESTADO[x.estado]; });
    $("#ck-resumo", p).innerHTML = htmlResumoChecklist(L);
  }, { signal: ctrlRender.signal });
}
function avisoChecklist() {
  const r = resumoChecklist(checklistAcessibilidade(item));
  if (!r.pendentes) return `<div class="aviso-ok" role="note">Checklist de acessibilidade: todos os ${r.total} itens aplicáveis foram cumpridos.</div>`;
  return `<div class="aviso-atencao" role="note">Checklist de acessibilidade: ${r.ok} de ${r.total} itens cumpridos. Há ${r.pendentes} pendência(s). Os arquivos podem ser baixados, mas o registro indicará o que falta. <button type="button" class="btn secundario pequeno" data-ir="checklist">Ver o checklist</button></div>`;
}

/* ===== Etapa 7: Biblioteca e exportação ===== */
function biblioteca() { return lerLocal(CHAVE_BIBLIO) || []; }
function salvarNaBiblioteca() {
  if (!item.material.titulo.trim()) { anunciar("Informe o título do material na etapa 1 antes de salvar."); return false; }
  const b = biblioteca(); const i = b.findIndex(x => x.id === item.id);
  item.atualizadoEm = agora();
  if (i >= 0) b[i] = clone(item); else b.unshift(clone(item));
  if (!gravarLocal(CHAVE_BIBLIO, b)) { anunciar("Espaço do navegador esgotado. Exporte a biblioteca e remova itens antigos."); return false; }
  anunciar("Material salvo na biblioteca."); return true;
}
function telaExportar() {
  const b = biblioteca();
  return `
  <h2>7. Biblioteca e exportação</h2>
  <p class="lead">Salve o material na biblioteca deste navegador e baixe as versões para o estudante e para o registro da pesquisa.</p>
  ${avisoChecklist()}
  <div class="acoes-linha">
    <button type="button" class="btn" id="e-salvar">Salvar na biblioteca</button>
    <button type="button" class="btn secundario" id="e-novo">Começar novo material</button>
  </div>
  <section class="cartao" aria-labelledby="ex-t" style="margin-top:1.2rem">
    <h3 id="ex-t">Baixar este material</h3>
    <div class="acoes-linha">
      <button type="button" class="btn secundario" id="e-html">Versão do estudante (HTML acessível)</button>
      <button type="button" class="btn secundario" id="e-docx">Versão do estudante (DOCX, para editar no Word)</button>
      <button type="button" class="btn secundario" id="e-docx-amp">Versão ampliada (DOCX, fonte e entrelinha da etapa 4)</button>
      <button type="button" class="btn secundario" id="e-txt">Texto para transcrição em braille (TXT)</button>
      <button type="button" class="btn secundario" id="e-reg">Registro completo da adaptação (HTML)</button>
    </div>
    <p class="hint">O texto para braille segue a convenção do GEPA: a adaptação vai entre colchetes, como nota de transcrição, para depois ser transcrita no Braille Fácil. ${esc(fonteTxt(["GEPA", "p. 18-21; 31"]))}</p>
  </section>
  <section class="cartao" aria-labelledby="pq-t">
    <h3 id="pq-t">Pesquisa: pacote de avaliação cega</h3>
    <p class="hint">Reúne os materiais salvos que têm as três versões: descrição genérica, rascunho guiado e versão revisada pelo professor. As versões recebem códigos e ordem aleatória, sem indicar a origem. A chave dos códigos fica em um arquivo separado, só para a pesquisadora.</p>
    <p>${pacoteDisponivel().length} material(is) com as três versões.</p>
    <div class="acoes-linha">
      <button type="button" class="btn secundario" id="pq-html"${pacoteDisponivel().length ? "" : " disabled"}>Baixar pacote para os consultores (HTML)</button>
      <button type="button" class="btn secundario" id="pq-csv"${pacoteDisponivel().length ? "" : " disabled"}>Baixar chave dos códigos (CSV)</button>
    </div>
  </section>
  <section aria-labelledby="bi-t">
    <h3 id="bi-t">Materiais salvos (${b.length})</h3>
    ${b.length ? `<ul class="biblioteca-lista">${b.map(x => { const s = statusMaterial(x); return `<li><h4 style="margin:0 0 .25rem;font-size:1rem">${esc(x.material.titulo || "Sem título")}</h4>
      <p class="meta">${esc([x.material.componente, x.material.ano].filter(Boolean).join(" · ") || "Sem componente ou ano")} &middot; <span class="pill ${s.cls}">${esc(s.rotulo)}</span> &middot; atualizado em ${esc(dataBR(x.atualizadoEm))}</p>
      <div class="acoes-linha"><button type="button" class="btn pequeno" data-abrir="${x.id}">Abrir</button><button type="button" class="btn secundario pequeno" data-duplicar="${x.id}">Duplicar</button><button type="button" class="btn secundario pequeno" data-excluir="${x.id}">Excluir</button></div></li>`; }).join("")}</ul>` : `<p>Nenhum material salvo ainda.</p>`}
    <div class="acoes-linha" style="margin-top:1rem">
      <button type="button" class="btn secundario" id="e-exp-bib"${b.length ? "" : " disabled"}>Exportar biblioteca (arquivo de cópia)</button>
      <label class="btn secundario" for="e-imp" style="cursor:pointer">Importar biblioteca</label>
      <input type="file" id="e-imp" accept="application/json,.json" class="visually-hidden">
    </div>
  </section>
  ${rodape("checklist", null)}`;
}
function posExportar(p) {
  $("#e-salvar", p).addEventListener("click", () => { if (salvarNaBiblioteca()) { renderEtapa(false); $("#e-salvar").focus(); } });
  $("#e-novo", p).addEventListener("click", () => { item = itemVazio(); imagemEnvio = ""; gravarLocal(CHAVE_ATUAL, item); irPara("material"); anunciar("Novo material iniciado."); });
  $("#e-html", p).addEventListener("click", () => baixar(`${slug(item.material.titulo)}-estudante.html`, documentoHTML(item.material.titulo, htmlEstudante(item)), "text/html"));
  $("#e-docx", p).addEventListener("click", () => baixar(`${slug(item.material.titulo)}-estudante.docx`, gerarDocx(blocosEstudante(item), { titulo: item.material.titulo, tamanho: 12, entrelinha: 1.5 }), ""));
  $("#e-docx-amp", p).addEventListener("click", () => baixar(`${slug(item.material.titulo)}-ampliado.docx`, gerarDocx(blocosEstudante(item), { titulo: item.material.titulo + " (versão ampliada)", fonte: item.ampliado.fonte, tamanho: item.ampliado.tamanho, entrelinha: item.ampliado.entrelinha }), ""));
  $("#e-txt", p).addEventListener("click", () => baixar(`${slug(item.material.titulo)}-braille.txt`, textoBraille(item), "text/plain"));
  $("#e-reg", p).addEventListener("click", () => baixar(`${slug(item.material.titulo)}-registro.html`, documentoHTML("Registro da adaptação: " + item.material.titulo, htmlRegistro(item)), "text/html"));
  const ph = $("#pq-html", p), pc = $("#pq-csv", p);
  ph && ph.addEventListener("click", () => { pacoteAtual = gerarPacote(); baixar("pacote-avaliacao-consultores.html", documentoHTML("Avaliação de descrições", htmlPacote(pacoteAtual)), "text/html"); anunciar("Pacote gerado. Baixe agora a chave dos códigos correspondente a este pacote."); });
  pc && pc.addEventListener("click", () => { if (!pacoteAtual) { anunciar("Gere primeiro o pacote para os consultores; a chave corresponde a ele."); return; } baixar("chave-codigos-pesquisa.csv", csvPacote(pacoteAtual), "text/csv"); });
  const eb = $("#e-exp-bib", p); eb && eb.addEventListener("click", () => baixar("verbaliza-biblioteca.json", JSON.stringify({ app: "Verbaliza", versao: 1, exportadoEm: agora(), itens: biblioteca() }, null, 2), "application/json"));
  $("#e-imp", p).addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const d = JSON.parse(fr.result); const novos = (d.itens || []).filter(x => x && x.id && x.material);
        const b = biblioteca(); const ids = new Set(b.map(x => x.id));
        novos.forEach(x => { if (!ids.has(x.id)) b.push(x); });
        gravarLocal(CHAVE_BIBLIO, b); renderEtapa(false); anunciar(`${novos.length} material(is) lido(s) do arquivo.`);
      } catch (err) { anunciar("O arquivo não é uma biblioteca válida do Verbaliza."); }
    };
    fr.readAsText(f);
  });
  $$("[data-abrir]", p).forEach(bt => bt.addEventListener("click", () => { const x = biblioteca().find(y => y.id === bt.dataset.abrir); if (x) { item = Object.assign(itemVazio(), clone(x)); imagemEnvio = ""; gravarLocal(CHAVE_ATUAL, item); irPara("material"); anunciar("Material aberto: " + (x.material.titulo || "sem título") + "."); } }));
  $$("[data-duplicar]", p).forEach(bt => bt.addEventListener("click", () => { const b = biblioteca(); const x = b.find(y => y.id === bt.dataset.duplicar); if (!x) return; const n = clone(x); n.id = uid(); n.material.titulo += " (cópia)"; n.criadoEm = n.atualizadoEm = agora(); n.validacao = itemVazio().validacao; n.revisao = itemVazio().revisao; b.unshift(n); gravarLocal(CHAVE_BIBLIO, b); renderEtapa(false); anunciar("Cópia criada no início da lista."); }));
  $$("[data-excluir]", p).forEach(bt => bt.addEventListener("click", () => {
    if (bt.dataset.confirmar !== "1") { bt.dataset.confirmar = "1"; bt.textContent = "Confirmar exclusão"; anunciar("Pressione de novo para confirmar a exclusão."); return; }
    gravarLocal(CHAVE_BIBLIO, biblioteca().filter(y => y.id !== bt.dataset.excluir)); renderEtapa(false); anunciar("Material excluído da biblioteca.");
  }));
}

/* ---------- pacote de avaliação cega ---------- */
let pacoteAtual = null;
function pacoteDisponivel() { return biblioteca().filter(x => x.pesquisa && x.pesquisa.generica && x.pesquisa.guiadaBruta && x.roteiro && x.roteiro.descricao); }
function embaralhar(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function gerarPacote() {
  const itens = embaralhar(pacoteDisponivel());
  return itens.map((x, k) => {
    const cod = "M" + String(k + 1).padStart(2, "0");
    const versoes = embaralhar([["A", "genérica", x.pesquisa.generica], ["B", "guiada pelos critérios (rascunho de IA)", x.pesquisa.guiadaBruta], ["C", "guiada e revisada pelo professor", x.roteiro.descricao]]);
    return { cod, it: x, versoes: versoes.map((v, i) => ({ dcod: cod + "-D" + (i + 1), condicao: v[0], rotulo: v[1], texto: v[2] })) };
  });
}
function htmlPacote(pac) {
  const escala = DIMENSOES_CONSULTOR.map(d => `<li>${esc(d.rotulo)}: adequado, parcialmente adequado ou inadequado.</li>`).join("");
  return `<h1>Avaliação de descrições: pacote para consultores</h1>
  <p>Cada material apresenta a atividade e três descrições da mesma imagem, identificadas por códigos. A origem das descrições não é informada. Para cada descrição, avalie as dimensões listadas e indique se ela permite compreender a atividade.</p>
  ${pac.map(m => `<section aria-labelledby="${m.cod}"><h2 id="${m.cod}">Material ${m.cod}</h2>
    <p><strong>Ano:</strong> ${esc(m.it.material.ano || "não informado")}. <strong>Gênero:</strong> ${esc((TIPOS_IMAGEM.find(t => t.id === m.it.analise.tipo) || {}).rotulo || "não informado")}.</p>
    ${m.it.material.enunciado ? `<p><strong>Atividade:</strong> ${esc(m.it.material.enunciado)}</p>` : ""}
    ${m.versoes.map(v => `<h3>Descrição ${v.dcod}</h3><p>${esc(v.texto).replace(/\n/g, "<br>")}</p><ul>${escala}<li>A descrição permite realizar a atividade? Sim, parcialmente ou não.</li><li>Observações.</li></ul>`).join("")}
  </section>`).join("")}`;
}
function csvPacote(pac) {
  const q = t => '"' + String(t == null ? "" : t).replace(/"/g, '""') + '"';
  const linhas = [["codigo_material", "titulo", "genero", "habilidade_bncc", "dependencia_visual", "codigo_descricao", "condicao", "descricao_condicao", "palavras"]];
  pac.forEach(m => m.versoes.forEach(v => linhas.push([m.cod, m.it.material.titulo, m.it.analise.tipo, m.it.material.habilidade || "", m.it.analise.dependencia || "", v.dcod, v.condicao, v.rotulo, contarPalavras(v.texto)])));
  return "\ufeff" + linhas.map(l => l.map(q).join(";")).join("\r\n");
}

/* ---------- geração de arquivos ---------- */
function slug(t) { return (t || "material").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "material"; }
function baixar(nome, conteudo, tipo) {
  const blob = conteudo instanceof Blob ? conteudo : new Blob([conteudo], { type: tipo + ";charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nome; a.textContent = nome; a.hidden = true;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  anunciar("Arquivo gerado: " + nome + ".");
}
function documentoHTML(titulo, corpo) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(titulo)}</title>
<style>body{font-family:Arial,Verdana,sans-serif;font-size:1.15rem;line-height:1.6;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#000;background:#fff}table{border-collapse:collapse}th,td{border:1px solid #000;padding:.4rem .6rem;text-align:left}h1{font-size:1.6rem}h2{font-size:1.3rem;margin-top:1.6rem}.fonte{font-size:.9rem}</style></head><body><main>${corpo}</main></body></html>`;
}
function tabelaAlternativa(txt) {
  const linhas = (txt || "").split(/\n+/).map(l => l.trim()).filter(Boolean);
  if (linhas.length < 2 || !linhas.every(l => l.includes(";"))) return txt ? `<p>${esc(txt).replace(/\n/g, "<br>")}</p>` : "";
  const cel = l => l.split(";").map(c => c.trim());
  const [cab, ...corpo] = linhas.map(cel);
  return `<table><caption>Dados da imagem em forma de tabela</caption><thead><tr>${cab.map(c => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${corpo.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}
function htmlEstudante(it) {
  const m = it.material, r = it.roteiro;
  const sup = it.estrategia === "suprimir";
  return `<h1>${esc(m.titulo || "Material")}</h1>
  ${m.pagina ? `<p>Página do original: ${esc(m.pagina)}</p>` : ""}
  ${m.enunciado ? `<section aria-labelledby="s-at"><h2 id="s-at">Atividade</h2><p>${esc(m.enunciado).replace(/\n/g, "<br>")}</p></section>` : ""}
  ${!sup ? `<section aria-labelledby="s-ad"><h2 id="s-ad">Descrição da imagem</h2>${r.nota ? `<p><strong>Nota introdutória:</strong> ${esc(r.nota)}</p>` : ""}<p>${esc(r.descricao || "[não adaptada]").replace(/\n/g, "<br>")}</p>${tabelaAlternativa(r.alternativa)}</section>` : ""}
  ${m.legenda && !(sup && it.analise.legendaRelevante !== "sim") ? `<section aria-labelledby="s-lg"><h2 id="s-lg">Legenda</h2><p>${esc(m.legenda)}</p></section>` : ""}`;
}
function textoBraille(it) {
  const m = it.material, r = it.roteiro, L = [];
  L.push(`${m.titulo || "Material"}${m.pagina ? " (página " + m.pagina + " do original)" : ""}`);
  L.push("");
  if (m.enunciado) { L.push(m.enunciado); L.push(""); }
  if (it.estrategia === "suprimir") { L.push("(Imagem suprimida por ser apenas ilustrativa. Fonte: GEPA, 2025, p. 32.)"); }
  else if (it.estrategia === "nao_adaptada") { L.push("[não adaptada]"); }
  else if (it.estrategia === "peca_orientacao") { L.push("[Peça orientação]"); }
  else {
    const d = (r.descricao || "").trim().replace(/^\[|\]$/g, "");
    if (d) L.push("[" + d + "]");
    if (r.alternativa) { L.push(""); L.push(r.alternativa.split(/\n+/).map(l => l.split(";").map(c => c.trim()).join(" – ")).join("\n")); }
  }
  if (m.legenda && it.estrategia !== "suprimir") { L.push(""); L.push("Legenda: " + m.legenda); }
  L.push(""); L.push("---"); L.push("Gerado pelo Verbaliza. Revise a diagramação no Braille Fácil antes da impressão.");
  return L.join("\r\n");
}
function htmlRegistro(it) {
  const s = statusMaterial(it), a = it.analise, v = it.validacao;
  const tipo = (TIPOS_IMAGEM.find(t => t.id === a.tipo) || {}).rotulo || "não informado";
  const sn = x => x === "sim" ? "sim" : x === "nao" ? "não" : "não respondido";
  const dim = DIMENSOES_CONSULTOR.map(d => `<tr><th scope="row">${esc(d.rotulo)}</th><td>${esc({ adequado: "Adequado", parcial: "Parcialmente adequado", inadequado: "Inadequado" }[v.dimensoes[d.id]] || "não avaliado")}</td></tr>`).join("");
  const verif = verificarRoteiro(it).map(x => `<li>${esc(x.mensagem)} <span class="fonte">${esc(fonteTxt(x.fonte))}</span></li>`).join("");
  return `<h1>Registro da adaptação</h1>
  <p><strong>Material:</strong> ${esc(it.material.titulo)}. <strong>Situação:</strong> ${esc(s.rotulo)}. <strong>Criado em</strong> ${esc(dataBR(it.criadoEm))}; <strong>atualizado em</strong> ${esc(dataBR(it.atualizadoEm))}.</p>
  <h2>Material</h2><p>${esc([it.material.componente, it.material.ano].filter(Boolean).join(" · "))}. Destinatários: ${esc(it.material.destinatarios.map(x => x === "cego" ? "estudantes cegos" : "estudantes com baixa visão").join(" e ") || "não informado")}.</p>
  <h2>Decisão de adaptação</h2>
  <ul><li>Habilidade da BNCC: ${esc(it.material.habilidade || "não informada")}</li><li>Dependência visual: ${esc({ verbal: "predominantemente verbal", verbovisual: "verbo-visual", visual: "predominantemente visual" }[a.dependencia] || "não informada")}</li><li>Gênero: ${esc(tipo)}</li><li>Necessária para a atividade: ${sn(a.necessaria)}</li><li>Tem legenda: ${sn(a.legenda)}</li><li>Legenda relevante: ${sn(a.legendaRelevante)}</li><li>Mencionada no texto: ${sn(a.mencionada)}</li>
  <li>Estratégia recomendada: ${esc((ESTRATEGIAS[recomendarEstrategia(a)] || {}).rotulo || "nenhuma")}</li><li>Estratégia adotada: ${esc((ESTRATEGIAS[it.estrategia] || {}).rotulo || "não definida")}</li></ul>
  <p><strong>Finalidade pedagógica:</strong> ${esc(a.finalidade || "não registrada")}</p>
  <h2>Roteiro</h2><p><strong>Origem:</strong> ${esc({ ia: "rascunho de IA sem edição", "ia-editado": "rascunho de IA editado pelo professor" }[it.roteiro.origem] || "escrito pelo professor")}.</p>
  ${it.roteiro.nota ? `<p><strong>Nota introdutória:</strong> ${esc(it.roteiro.nota)}</p>` : ""}<p>${esc(it.roteiro.descricao).replace(/\n/g, "<br>")}</p>
  <h3>Quadros registrados</h3><ul>${(it.quadros || []).map((q, i) => `<li>Q${i + 1}: ${esc(q.visual)}${q.verbal ? " | Texto verbal: " + esc(q.verbal).replace(/\n/g, " / ") : ""}</li>`).join("")}</ul>
  <h3>Dados da pesquisa</h3><p>Descrição genérica: ${it.pesquisa && it.pesquisa.generica ? "registrada" : "não registrada"}. Rascunho guiado original: ${it.pesquisa && it.pesquisa.guiadaBruta ? "registrado" : "não registrado"}.</p>${tabelaAlternativa(it.roteiro.alternativa)}
  <h3>Verificação automática</h3><ul>${verif}</ul>
  <h2>Revisão do professor</h2><ul>${CHECKLIST_PROFESSOR.map(c => `<li>${it.revisao.checks[c.id] ? "Conferido" : "Não conferido"}: ${esc(c.texto)}</li>`).join("")}</ul>
  <h2>Validação do consultor</h2><p>Consultor: ${esc(v.consultor || "não informado")}. Data: ${esc(v.data || "não informada")}.</p>
  <table><caption>Avaliação por dimensão (GPEAD, 2025, p. 14)</caption><thead><tr><th scope="col">Dimensão</th><th scope="col">Avaliação</th></tr></thead><tbody>${dim}</tbody></table>
  <p><strong>Parecer:</strong> ${esc(v.parecer || "não registrado")}</p><p><strong>Decisão:</strong> ${esc({ validado: "validado", ajustes: "validado com ajustes", nao: "não validado" }[v.decisao] || "pendente")}</p>
  <h2>Teste de leitura</h2><p>${it.teste.realizado ? "Realizado." : "Não realizado."} ${esc(it.teste.notas)}</p>
  ${(() => { const L = checklistAcessibilidade(it), r = resumoChecklist(L); return `<h2>Checklist de acessibilidade</h2><p>${r.ok} de ${r.total} itens aplicáveis cumpridos na data deste registro.</p>
  <table><caption>Situação de cada item do checklist</caption><thead><tr><th scope="col">Grupo</th><th scope="col">Item</th><th scope="col">Situação</th><th scope="col">Tipo</th></tr></thead><tbody>${L.map(x => `<tr><td>${esc((GRUPOS_CHECKLIST.find(g => g[0] === x.grupo) || ["", ""])[1])}</td><th scope="row">${esc(x.texto)}</th><td>${esc(ROTULO_ESTADO[x.estado])}${x.detalhe ? ". " + esc(x.detalhe) : ""}</td><td>${x.auto ? "automático" : "conferido pelo professor"}</td></tr>`).join("")}</tbody></table>`; })()}
  <h2>Material ampliado</h2><p>Fonte ${esc(it.ampliado.fonte)}, ${esc(it.ampliado.tamanho)} pontos, entrelinha ${esc(it.ampliado.entrelinha)}. Ajustes previstos: ${esc(it.ampliado.ajustes.map(x => (AJUSTES_IMAGEM.find(y => y[0] === x) || [x, x])[1].toLowerCase()).join("; ") || "nenhum")}.</p>
  <h2>Referências</h2><ul>${["GPEAD", "GEPA", "AMPLIADO", "MEC2010", "PNEEI"].map(k => `<li>${esc(FONTES[k].ref)}</li>`).join("")}</ul>`;
}


/* ---------- DOCX sem bibliotecas externas (ZIP sem compressão) ---------- */
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zipSemCompressao(arquivos) {
  const enc = new TextEncoder(), partes = [], central = []; let off = 0;
  for (const f of arquivos) {
    const nome = enc.encode(f.nome), d = enc.encode(f.texto), crc = crc32(d);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(12, 0x21, true);
    h.setUint32(14, crc, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, nome.length, true);
    partes.push(new Uint8Array(h.buffer), nome, d);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(14, 0x21, true);
    c.setUint32(16, crc, true); c.setUint32(20, d.length, true); c.setUint32(24, d.length, true); c.setUint16(28, nome.length, true); c.setUint32(42, off, true);
    central.push(new Uint8Array(c.buffer), nome);
    off += 30 + nome.length + d.length;
  }
  const tam = central.reduce((a, b) => a + b.length, 0), e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, arquivos.length, true); e.setUint16(10, arquivos.length, true); e.setUint32(12, tam, true); e.setUint32(16, off, true);
  return new Blob([...partes, ...central, new Uint8Array(e.buffer)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
function xmlEsc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function gerarDocx(blocos, o = {}) {
  const fonte = xmlEsc(o.fonte || "Arial"), sz = Math.round((parseFloat(o.tamanho) || 12) * 2), linha = Math.round(240 * (parseFloat(o.entrelinha) || 1.5));
  const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const par = (t, est) => `<w:p>${est ? `<w:pPr><w:pStyle w:val="${est}"/></w:pPr>` : ""}<w:r><w:t xml:space="preserve">${xmlEsc(t)}</w:t></w:r></w:p>`;
  const corpo = blocos.map(b => b.h ? par(b.t, "Titulo" + b.h) : par(b.t)).join("");
  const estilo = (id, nome, nivel, tam) => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${nome}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="${nivel}"/></w:pPr><w:rPr><w:b/><w:sz w:val="${tam}"/><w:szCs w:val="${tam}"/></w:rPr></w:style>`;
  const estilos = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="${W}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${fonte}" w:hAnsi="${fonte}" w:cs="${fonte}" w:eastAsia="${fonte}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:lang w:val="pt-BR" w:eastAsia="pt-BR" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="${linha}" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>${estilo("Titulo1", "heading 1", 0, sz + 8)}${estilo("Titulo2", "heading 2", 1, sz + 4)}</w:styles>`;
  const documento = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="${W}"><w:body>${corpo}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1134" w:bottom="1418" w:left="1134" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xmlEsc(o.titulo || "Material")}</dc:title><dc:creator>Verbaliza</dc:creator><dc:language>pt-BR</dc:language></cp:coreProperties>`;
  return zipSemCompressao([
    { nome: "[Content_Types].xml", texto: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>` },
    { nome: "_rels/.rels", texto: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>` },
    { nome: "word/_rels/document.xml.rels", texto: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { nome: "word/document.xml", texto: documento },
    { nome: "word/styles.xml", texto: estilos },
    { nome: "docProps/core.xml", texto: core }
  ]);
}
function blocosEstudante(it) {
  const m = it.material, r = it.roteiro, sup = it.estrategia === "suprimir", B = [];
  const linhas = t => String(t || "").split(/\n+/).map(l => l.trim()).filter(Boolean);
  B.push({ h: 1, t: m.titulo || "Material" });
  if (m.pagina) B.push({ t: "Página do original: " + m.pagina });
  if (m.enunciado) { B.push({ h: 2, t: "Atividade" }); linhas(m.enunciado).forEach(t => B.push({ t })); }
  if (!sup) {
    B.push({ h: 2, t: "Descrição da imagem" });
    if (r.nota) B.push({ t: "Nota introdutória: " + r.nota });
    (linhas(r.descricao).length ? linhas(r.descricao) : ["[não adaptada]"]).forEach(t => B.push({ t }));
    linhas(r.alternativa).forEach(t => B.push({ t: t.split(";").map(c => c.trim()).join("; ") }));
  }
  if (m.legenda && !(sup && it.analise.legendaRelevante !== "sim")) { B.push({ h: 2, t: "Legenda" }); B.push({ t: m.legenda }); }
  return B;
}

/* ---------- ambiente do estudante ---------- */
let vistaAtual = "professor";
let estudanteSel = "";
const narracao = { ativa: false, pausada: false, fila: [], i: 0 };
function materiaisEstudante() {
  const b = biblioteca().filter(x => x.estrategia !== "suprimir");
  const lista = b.map(x => ({ id: x.id, it: x, previa: false }));
  if (!b.some(x => x.id === item.id) && item.material.titulo.trim()) lista.unshift({ id: item.id, it: item, previa: true });
  return lista;
}
function pararNarracao() {
  narracao.ativa = false; narracao.pausada = false;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  $$(".lendo").forEach(e => e.classList.remove("lendo"));
  const b = $("#btn-narrar-toggle"); if (b) b.textContent = "Ouvir este material";
}
function narrarProximo() {
  $$(".lendo").forEach(e => e.classList.remove("lendo"));
  if (!narracao.ativa || narracao.i >= narracao.fila.length) { pararNarracao(); anunciar("Fim do material."); return; }
  const el = narracao.fila[narracao.i];
  el.classList.add("lendo");
  el.scrollIntoView({ block: "center", behavior: prefs.reduzirAnimacoes ? "auto" : "smooth" });
  const u = new SpeechSynthesisUtterance(el.textContent.replace(/\s+/g, " ").trim());
  u.lang = "pt-BR"; const v = vozes.find(x => x.name === prefs.vozNome); if (v) u.voice = v;
  u.onend = () => { if (narracao.ativa && !narracao.pausada) { narracao.i++; narrarProximo(); } };
  speechSynthesis.speak(u);
}
function alternarNarracao() {
  if (!("speechSynthesis" in window)) { anunciar("A narração por voz não está disponível neste navegador."); return; }
  const b = $("#btn-narrar-toggle");
  if (!narracao.ativa) {
    narracao.fila = $$("#blocos-material .bloco"); narracao.i = 0; narracao.ativa = true; narracao.pausada = false;
    b.textContent = "Pausar narração"; narrarProximo();
  } else if (!narracao.pausada) { narracao.pausada = true; speechSynthesis.pause(); b.textContent = "Continuar narração"; }
  else { narracao.pausada = false; speechSynthesis.resume(); b.textContent = "Pausar narração"; }
}
function renderEstudante() {
  pararNarracao();
  const alvo = $("#conteudo-estudante");
  const lista = materiaisEstudante();
  if (!lista.length) {
    alvo.innerHTML = `<div class="banner-vazio"><h2>Nenhum material disponível</h2><p>Se você é estudante, abra o arquivo enviado pelo professor. Se você é professor, salve um material na biblioteca, na etapa 6 do seu ambiente.</p></div>`;
    return;
  }
  if (!lista.some(x => x.id === estudanteSel)) estudanteSel = lista[0].id;
  const sel = lista.find(x => x.id === estudanteSel), it = sel.it, m = it.material, r = it.roteiro;
  const st = statusMaterial(it);
  const blocos = [];
  if (m.enunciado) blocos.push(`<div class="bloco narracao">${esc(m.enunciado)}</div>`);
  if (it.estrategia === "nao_adaptada") blocos.push(`<div class="bloco nota">[não adaptada]</div>`);
  else if (it.estrategia === "peca_orientacao") blocos.push(`<div class="bloco nota">[Peça orientação]</div>`);
  else if (r.descricao) {
    if (r.nota) blocos.push(`<div class="bloco nota"><strong>Nota introdutória:</strong> ${esc(r.nota)}</div>`);
    blocos.push(`<div class="bloco ad"><span class="ad-rotulo">Descrição da imagem</span>${esc(r.descricao).replace(/\n/g, "<br>")}</div>`);
    if (r.alternativa) blocos.push(`<div class="bloco">${tabelaAlternativa(r.alternativa)}</div>`);
  } else blocos.push(`<div class="bloco nota">O professor ainda não escreveu a descrição desta imagem.</div>`);
  if (m.legenda && it.estrategia !== "suprimir") blocos.push(`<div class="bloco narracao"><strong>Legenda:</strong> ${esc(m.legenda)}</div>`);
  alvo.innerHTML = `
    ${lista.length > 1 ? `<div class="campo"><label for="est-sel">Escolha o material</label><select id="est-sel" class="ui-select" style="width:100%">${lista.map(x => `<option value="${x.id}"${x.id === estudanteSel ? " selected" : ""}>${esc(x.it.material.titulo || "Sem título")}${x.previa ? " (pré-visualização)" : ""}</option>`).join("")}</select></div>` : ""}
    <section class="como-usar" aria-labelledby="como-usar-est">
      <h2 id="como-usar-est">Como usar este material</h2>
      <p>O botão grande "Ouvir este material" inicia a narração; apertado de novo, pausa e continua. Pelo teclado, a tecla O faz o mesmo. Quem usa leitor de tela pode ler o material pelos títulos e parágrafos. Os ajustes de cores, tamanho da letra e voz ficam no topo da página.</p>
    </section>
    <header class="obra-cab">
      <span class="rotulo-serie">${esc([m.componente, m.ano].filter(Boolean).join(" · ") || "Material adaptado")}</span>
      <h2 id="titulo-material" tabindex="-1" style="font-size:2rem;margin:.15rem 0 .2rem">${esc(m.titulo || "Material sem título")}</h2>
      <p class="autoria">${m.fonte ? esc(m.fonte) + ". " : ""}${m.pagina ? "Página do original: " + esc(m.pagina) + ". " : ""}${sel.previa || st.cls !== "validado" ? `<em>(${esc(sel.previa ? "pré-visualização" : st.rotulo.toLowerCase())})</em>` : ""}</p>
    </header>
    <button type="button" class="btn-narrar" id="btn-narrar-toggle">Ouvir este material</button>
    ${m.imagem && it.estrategia !== "suprimir" && (m.destinatarios || []).includes("baixa") ? `<figure style="margin:0 0 1.2rem"><img class="previa-imagem" style="max-height:none;width:100%" src="${m.imagem}" alt="${esc(r.descricao ? "Imagem descrita a seguir." : "Imagem do material.")}"></figure>` : ""}
    <div id="blocos-material">${blocos.join("")}</div>
    <div class="rodape-parte"><span class="status-leitura" id="status-leitura" aria-live="polite"></span></div>`;
  const s2 = $("#est-sel"); s2 && s2.addEventListener("change", () => { estudanteSel = s2.value; renderEstudante(); $("#est-sel").focus(); });
  $("#btn-narrar-toggle").addEventListener("click", alternarNarracao);
}
function mudarVista(v) {
  vistaAtual = v;
  const prof = v === "professor";
  $("#vista-professor").hidden = !prof; $("#vista-estudante").hidden = prof;
  $("#btn-vista-professor").setAttribute("aria-pressed", prof ? "true" : "false");
  $("#btn-vista-estudante").setAttribute("aria-pressed", prof ? "false" : "true");
  if (prof) { pararNarracao(); renderEtapa(false); $("#titulo-vista-professor").focus(); }
  else { renderEstudante(); const h = $("#titulo-material") || $("#titulo-vista-estudante"); h.focus(); }
  anunciar(prof ? "Ambiente do professor." : "Ambiente do estudante.");
}
$("#btn-vista-professor").addEventListener("click", () => mudarVista("professor"));
$("#btn-vista-estudante").addEventListener("click", () => mudarVista("estudante"));
document.addEventListener("keydown", e => {
  if (vistaAtual !== "estudante" || e.altKey || e.ctrlKey || e.metaKey) return;
  const tag = (document.activeElement && document.activeElement.tagName) || "";
  if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  if (e.key.toLowerCase() === "o" && $("#btn-narrar-toggle")) { e.preventDefault(); alternarNarracao(); }
});

/* ---------- atalhos ---------- */
document.addEventListener("keydown", e => {
  if (!e.altKey || e.ctrlKey || e.metaKey || vistaAtual !== "professor") return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= ETAPAS.length) { e.preventDefault(); irPara(ETAPAS[n - 1].id); }
  else if (e.key.toLowerCase() === "v" && etapaAtual === "roteiro" && $("#r-verificar")) { e.preventDefault(); verificarEMostrar($("#painel"), true); }
  else if (e.key.toLowerCase() === "s") { e.preventDefault(); salvarNaBiblioteca(); }
});

/* ---------- início ---------- */
aplicarPrefs();
aplicarPainelAcess();
renderNav();
renderEtapa(false);
