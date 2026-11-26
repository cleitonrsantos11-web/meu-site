const CHAVE = 'ceramica_seg_v2';
const SESSAO = 'ceramica_sessao';
const DIAS_BAIXO_GIRO = 180;
const REGEX_ENDERECO = /^(GALPAO-[A-D]|PATIO)-RUA-\d{2}-PAL-\d{2}$/;

const UNIDADES = ['Matriz', 'Filial_01', 'Filial_02'];
const CATEGORIAS = ['Todos', 'Porcelanatos', 'Pisos Ceramicos', 'Revestimentos', 'Telhas', 'Baixo Giro'];
const JUSTIFICATIVAS = ['Quebra/Avaria', 'Erro de Transferencia', 'Ajuste de Contagem'];
const PREFIXO = { Encarregado: 'ENC', Estoquista: 'EST', Vendedor: 'VND' };
const TIPOS = {
  entrada: 'Entrada (Fabrica)',
  saida: 'Saida (Venda)',
  quebra: 'Quebra/Avaria',
  transferencia: 'Transferencia entre unidades'
};

const TODOS_TIPOS = Object.keys(TIPOS);
const PERMISSOES = {
  Vendedor: { abas: ['inicio', 'consulta'], tipos: [] },
  Estoquista: { abas: ['inicio', 'consulta', 'movimento', 'inventario', 'conferencia'], tipos: TODOS_TIPOS },
  Encarregado: { abas: ['inicio', 'consulta', 'movimento', 'inventario', 'conferencia', 'auditoria', 'usuarios'], tipos: TODOS_TIPOS }
};

// Ícones SVG padronizados (traço fino e consistente)
const ICONES = {
  inicio: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  consulta: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  movimento: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  inventario: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  conferencia: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  auditoria: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  usuarios: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  pin: '<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
};

const USUARIOS_INICIAIS = [
  { codigo: 'ENC-901', senha: '123', nome: 'Juliana Alves', cargo: 'Encarregado', unidade: 'Matriz' },
  { codigo: 'EST-402', senha: '123', nome: 'Carlos Mendes', cargo: 'Estoquista', unidade: 'Matriz' },
  { codigo: 'VND-703', senha: '123', nome: 'Patricia Lima', cargo: 'Vendedor', unidade: 'Filial_01' },
  { codigo: 'EST-405', senha: '123', nome: 'Rafael Souza', cargo: 'Estoquista', unidade: 'Filial_01' }
];

const S = (Matriz, Filial_01, Filial_02) => ({ Matriz, Filial_01, Filial_02 });
const PRODUTOS_INICIAIS = [
  { sku: 'CER-001', nome: 'Porcelanato Polido 80x80 Cinza', cat: 'Porcelanatos', un: 'Caixa', end: 'GALPAO-A-RUA-01-PAL-02', dias: 12, saldo: S(420, 180, 95) },
  { sku: 'CER-002', nome: 'Porcelanato Acetinado 60x120 Travertino Bege', cat: 'Porcelanatos', un: 'Caixa', end: 'GALPAO-A-RUA-02-PAL-04', dias: 8, saldo: S(260, 90, 60) },
  { sku: 'CER-003', nome: 'Porcelanato Retificado 120x120 Calacatta (Fora de Linha)', cat: 'Porcelanatos', un: 'Caixa', end: 'SEM_ENDERECO', dias: 240, saldo: S(210, 40, 35) },
  { sku: 'CER-004', nome: 'Piso Ceramico 60x60 Madeira Natural', cat: 'Pisos Ceramicos', un: 'Caixa', end: 'GALPAO-B-RUA-01-PAL-03', dias: 3, saldo: S(620, 320, 280) },
  { sku: 'CER-005', nome: 'Piso Antiderrapante 50x50 Externo Cinza', cat: 'Pisos Ceramicos', un: 'Caixa', end: 'GALPAO-B-RUA-03-PAL-01', dias: 15, saldo: S(380, 150, 120) },
  { sku: 'CER-006', nome: 'Piso Ceramico 57x57 Marmore Branco (Linha Anterior)', cat: 'Pisos Ceramicos', un: 'Caixa', end: 'GALPAO-B-RUA-05-PAL-08', dias: 210, saldo: S(160, 30, 25) },
  { sku: 'CER-007', nome: 'Revestimento Brilhante 30x60 Branco', cat: 'Revestimentos', un: 'Caixa', end: 'GALPAO-C-RUA-01-PAL-05', dias: 2, saldo: S(540, 260, 210) },
  { sku: 'CER-008', nome: 'Pastilha Ceramica Azul 30x30', cat: 'Revestimentos', un: 'm2', end: 'SEM_ENDERECO', dias: 36, saldo: S(120, 45, 30) },
  { sku: 'CER-009', nome: 'Revestimento 3D 30x60 Ondulado Branco', cat: 'Revestimentos', un: 'Caixa', end: 'GALPAO-C-RUA-04-PAL-02', dias: 195, saldo: S(90, 20, 15) },
  { sku: 'CER-010', nome: 'Telha Ceramica Esmaltada Colonial', cat: 'Telhas', un: 'm2', end: 'PATIO-RUA-01-PAL-01', dias: 22, saldo: S(300, 120, 80) },
  { sku: 'CER-011', nome: 'Rodape Porcelanato 15x80 Cinza', cat: 'Telhas', un: 'Caixa', end: 'GALPAO-C-RUA-06-PAL-01', dias: 9, saldo: S(350, 140, 110) },
  { sku: 'CER-012', nome: 'Porcelanato Rustico 60x60 Ardosia Externo', cat: 'Porcelanatos', un: 'Caixa', end: 'GALPAO-A-RUA-04-PAL-06', dias: 28, saldo: S(230, 85, 70) }
];

const TRANSF_INICIAIS = [{
  id: 'TRF-0001', sku: 'CER-004', qtd: 80, origem: 'Matriz', destino: 'Filial_01',
  status: 'Pendente de Recebimento', solicitante: { codigo: 'EST-402', nome: 'Carlos Mendes' },
  dh: '2026-11-16T09:30:00', recebidoPor: ''
}];

const LOG_INICIAL = [{
  id: 'LOG-00001', dh: '2026-11-16T09:30:00', codigo: 'EST-402', nome: 'Carlos Mendes',
  cargo: 'Estoquista', acao: 'Transferencia entre unidades', sku: 'CER-004', qtd: 80,
  detalhe: 'Matriz -> Filial_01 (Pendente de Recebimento)'
}];

// --- HELPERS ---
const $ = (id) => document.getElementById(id);
const copia = (x) => structuredClone(x);
const fmt = (n) => Number(n).toLocaleString('pt-BR');
const opcoes = (lista) => lista.map((v) => `<option>${v}</option>`).join('');
const semAcento = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const iniciais = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
const dataHora = (iso) => new Date(iso).toLocaleString('pt-BR');
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// --- ESTADO & SESSÃO ---
const novoEstado = (manter) => ({
  produtos: copia(PRODUTOS_INICIAIS),
  transferencias: copia(TRANSF_INICIAIS),
  contagens: {},
  confMatrizRascunho: {},
  confMatrizHistorico: [],
  usuarios: manter ? manter.usuarios : copia(USUARIOS_INICIAIS),
  log: manter ? manter.log : copia(LOG_INICIAL)
});

const carregar = () => {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE));
    if (!dados) return novoEstado();
    dados.confMatrizRascunho ??= {};
    dados.confMatrizHistorico ??= [];
    return dados;
  } catch {
    return novoEstado();
  }
};
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch { } };

let estado = carregar();
let abaAtual = 'inicio';
let catAtual = 'Todos';
let codigoSessao = sessionStorage.getItem(SESSAO);

const setSessao = (c) => {
  codigoSessao = c;
  c ? sessionStorage.setItem(SESSAO, c) : sessionStorage.removeItem(SESSAO);
};

const usuario = () => estado.usuarios.find((u) => u.codigo === codigoSessao && u.ativo !== false);
const ehEnc = () => usuario()?.cargo === 'Encarregado';
const permissao = () => PERMISSOES[usuario().cargo];
const produtoDe = (sku) => estado.produtos.find((p) => p.sku === sku);

let timerToast;
function toast(msg, tipo = '') {
  const t = $('toast');
  t.textContent = msg;
  t.className = `mostra ${tipo}`;
  clearTimeout(timerToast);
  timerToast = setTimeout(() => (t.className = ''), 3400);
}

function registrarLog(acao, sku = '', qtd = '', detalhe = '') {
  const u = usuario();
  estado.log.push(Object.freeze({
    id: 'LOG-' + String(estado.log.length + 1).padStart(5, '0'),
    dh: new Date().toISOString(),
    codigo: u.codigo, nome: u.nome, cargo: u.cargo,
    acao, sku, qtd, detalhe
  }));
  salvar();
}

// Injeta ícones SVG nos botões do menu
document.querySelectorAll('#menu button[data-aba]').forEach((btn) => {
  const ic = ICONES[btn.dataset.aba];
  if (ic) btn.innerHTML = `${ic}<span>${btn.textContent}</span>`;
});

// --- AUTENTICAÇÃO ---
$('creds').innerHTML = USUARIOS_INICIAIS.map((u) =>
  `<button type="button" class="cred" data-c="${u.codigo}"><b>${u.codigo}</b><span>${u.nome} - ${u.cargo}</span><small>Senha</small><span>${u.senha}</span></button>`
).join('');

$('btnCreds').onclick = () => $('creds').classList.toggle('oculto');
$('creds').onclick = (e) => {
  const b = e.target.closest('.cred');
  if (b) { $('lCodigo').value = b.dataset.c; $('lSenha').value = '123'; }
};

$('formLogin').onsubmit = (e) => {
  e.preventDefault();
  const cod = $('lCodigo').value.trim().toUpperCase();
  const senha = $('lSenha').value;
  const u = estado.usuarios.find((x) => x.codigo === cod && x.senha === senha);

  if (!cod || !senha || !u || u.ativo === false) {
    $('loginErro').textContent = u?.ativo === false
      ? 'ACESSO NEGADO: colaborador desativado. Procure o Encarregado.'
      : 'ACESSO NEGADO: codigo ou senha incorretos.';
    $('loginErro').classList.remove('oculto');
    $('lSenha').value = '';
    return;
  }

  $('loginErro').classList.add('oculto');
  setSessao(u.codigo);
  registrarLog('Login');
  mostrarApp();
};

$('btnSair').onclick = () => {
  registrarLog('Logout');
  setSessao(null);
  mostrarApp();
};

function mostrarApp() {
  const u = usuario();
  $('login').classList.toggle('oculto', !!u);
  $('app').classList.toggle('oculto', !u);

  if (!u) {
    $('formLogin').reset();
    document.querySelectorAll('#grade,#listaInv,#audCorpo,#listaTransf,#usrCorpo,#cmCorpo,#cmHistCorpo,#iniPendencias,#iniAtividades').forEach((el) => (el.innerHTML = ''));
    return;
  }

  $('hAvatar').textContent = iniciais(u.nome);
  $('hNome').textContent = u.nome;
  $('hCargo').textContent = `${u.codigo} - ${u.cargo} - ${u.unidade}`;
  document.querySelectorAll('#menu button').forEach((b) =>
    b.classList.toggle('oculto', !permissao().abas.includes(b.dataset.aba))
  );
  showAba('inicio');
}

// --- NAVEGAÇÃO ---
const RENDER_ABA = {
  inicio: renderInicio,
  consulta: renderConsulta,
  movimento: prepararMovimento,
  inventario: renderInventario,
  conferencia: renderConferenciaMatriz,
  auditoria: renderAuditoria,
  usuarios: renderUsuarios
};

function showAba(nome) {
  if (!usuario()) {
    if (codigoSessao) { setSessao(null); mostrarApp(); toast('Sessao encerrada: acesso removido', 'erro'); }
    return;
  }
  if (!permissao().abas.includes(nome)) {
    toast('Acesso bloqueado para o seu cargo', 'erro');
    nome = 'inicio';
  }
  abaAtual = nome;
  document.querySelectorAll('main section').forEach((s) => s.classList.toggle('oculto', s.id !== `aba-${nome}`));
  document.querySelectorAll('#menu button').forEach((b) => b.classList.toggle('ativo', b.dataset.aba === nome));
  RENDER_ABA[nome]();
  window.scrollTo(0, 0);
}

$('menu').onclick = (e) => {
  const b = e.target.closest('button[data-aba]');
  if (b) showAba(b.dataset.aba);
};

// --- ABA 0: INÍCIO (CENTRAL OPERACIONAL) ---
const ATALHOS_CATALOGO = [
  { aba: 'consulta', titulo: 'Consultar Produtos e Endereços', desc: 'Verificar saldos por unidade e rua/palete.' },
  { aba: 'movimento', titulo: 'Registrar Movimentação', desc: 'Dar entrada, saída, quebra ou transferir.' },
  { aba: 'inventario', titulo: 'Inventário Físico', desc: 'Contagem rotativa e ajuste de divergências.' },
  { aba: 'conferencia', titulo: 'Conferência da Matriz', desc: 'Auditoria física independente da Matriz.' },
  { aba: 'auditoria', titulo: 'Exportar para Power BI', desc: 'Consultar log imutável e baixar CSV.' },
  { aba: 'usuarios', titulo: 'Gerenciar Equipe', desc: 'Cadastrar operadores e controlar acessos.' }
];

function renderInicio() {
  const u = usuario();
  const abasPermitidas = permissao().abas;

  $('iniUnidade').textContent = `${u.unidade} • ${u.cargo}`;
  $('iniSaudacao').textContent = `Olá, ${u.nome.split(' ')[0]}`;
  $('iniSubtitulo').textContent = `Turno ativo sob o código ${u.codigo}. Selecione uma operação ou resolva as pendências abaixo.`;

  // Renderiza atalhos conforme cargo
  $('iniAtalhos').innerHTML = ATALHOS_CATALOGO
    .filter((a) => abasPermitidas.includes(a.aba))
    .map((a) => `
      <button type="button" class="atalho-card" data-ir="${a.aba}">
        <div class="atalho-ic">${ICONES[a.aba]}</div>
        <div><b>${a.titulo}</b><span>${a.desc}</span></div>
      </button>
    `).join('');

  // Monta Central de Pendências reais do banco
  const pendencias = [];

  // 1. Produtos sem endereço físico
  const semEnd = estado.produtos.filter((p) => p.end === 'SEM_ENDERECO');
  if (semEnd.length) {
    pendencias.push({
      critica: true,
      titulo: `${semEnd.length} produto(s) sem endereço físico`,
      detalhe: semEnd.map((p) => p.sku).join(', ') + ' — risco de atraso na separação.',
      aba: 'consulta',
      botao: 'Endereçar'
    });
  }

  // 2. Peças paradas há muito tempo (Baixo Giro)
  const baixoGiro = estado.produtos.filter((p) => (p.dias || 0) > DIAS_BAIXO_GIRO);
  if (baixoGiro.length) {
    pendencias.push({
      critica: false,
      titulo: `${baixoGiro.length} produto(s) com Baixo Giro (+${DIAS_BAIXO_GIRO} dias sem saída)`,
      detalhe: baixoGiro.map((p) => `${p.sku} (${p.dias}d)`).join(', ') + ' — avaliar promoção ou remanejamento.',
      aba: 'consulta',
      catFiltro: 'Baixo Giro',
      botao: 'Ver itens'
    });
  }

  // 3. Transferências pendentes de recebimento
  const transfPend = estado.transferencias.filter((t) => t.status === 'Pendente de Recebimento');
  transfPend.forEach((t) => {
    if (abasPermitidas.includes('movimento')) {
      pendencias.push({
        critica: false,
        titulo: `Transferência ${t.id} aguardando recebimento`,
        detalhe: `${t.sku} (${fmt(t.qtd)} un.) • ${t.origem} -> ${t.destino}`,
        aba: 'movimento',
        botao: 'Conferir'
      });
    }
  });

  // 4. Divergências de inventário aguardando aprovação do Encarregado
  if (ehEnc()) {
    const divs = Object.entries(estado.contagens).filter(([, c]) => c.status === 'Pendente de Aprovacao');
    if (divs.length) {
      pendencias.push({
        critica: true,
        titulo: `${divs.length} divergência(s) de inventário aguardando aprovação`,
        detalhe: 'Contagens físicas divergentes aguardando validação.',
        aba: 'inventario',
        botao: 'Revisar'
      });
    }
  }

  // 5. Conferência da Matriz em andamento (rascunho salvo)
  const qtdRascunho = Object.keys(estado.confMatrizRascunho || {}).length;
  if (qtdRascunho > 0 && abasPermitidas.includes('conferencia')) {
    pendencias.push({
      critica: false,
      titulo: `Conferência da Matriz em andamento`,
      detalhe: `${qtdRascunho} de ${estado.produtos.length} produtos já contados.`,
      aba: 'conferencia',
      botao: 'Continuar'
    });
  }

  $('iniTotalPend').textContent = pendencias.length;
  $('iniPendencias').innerHTML = pendencias.map((p) => `
    <div class="pendencia-item ${p.critica ? 'critica' : ''}">
      <div><b>${esc(p.titulo)}</b><small>${esc(p.detalhe)}</small></div>
      <button type="button" class="btn sec sm" data-ir="${p.aba}" ${p.catFiltro ? `data-cat="${p.catFiltro}"` : ''}>${p.botao}</button>
    </div>
  `).join('') || '<p class="sub-compacta">Nenhuma pendência operacional no momento.</p>';

  // Exibe Últimas Atividades SOMENTE para o Encarregado
  const isEnc = ehEnc();
  $('cardAtividadesInicio').classList.toggle('oculto', !isEnc);
  $('gridInicio').style.gridTemplateColumns = isEnc ? '' : '1fr';

  if (isEnc) {
    $('iniAtividades').innerHTML = estado.log.slice(-6).reverse().map((l) => `
      <div class="atividade-item">
        <div>
          <b>${esc(l.acao)} ${l.sku ? `• ${l.sku}` : ''}</b>
          <small>${esc(l.nome)} (${l.codigo})${l.detalhe ? ` — ${esc(l.detalhe)}` : ''}</small>
        </div>
        <small>${dataHora(l.dh).slice(0, 16)}</small>
      </div>
    `).join('');
  } else {
    $('iniAtividades').innerHTML = '';
  }
}

$('formBuscaInicio').onsubmit = (e) => {
  e.preventDefault();
  $('busca').value = $('iniBusca').value;
  $('iniBusca').value = '';
  catAtual = 'Todos';
  showAba('consulta');
};

$('iniAtalhos').onclick = (e) => {
  const b = e.target.closest('[data-ir]');
  if (b) showAba(b.dataset.ir);
};

$('iniPendencias').onclick = (e) => {
  const b = e.target.closest('[data-ir]');
  if (!b) return;
  if (b.dataset.cat) catAtual = b.dataset.cat;
  showAba(b.dataset.ir);
};

$('btnVerLogCompleto').onclick = () => showAba('auditoria');

// --- CONSULTA ---
$('chips').innerHTML = CATEGORIAS.map((c) => `<button class="chip" data-cat="${c}">${c}</button>`).join('');
$('chips').onclick = (e) => {
  const b = e.target.closest('.chip');
  if (b) { catAtual = b.dataset.cat; renderConsulta(); }
};
$('busca').oninput = renderConsulta;

function renderConsulta() {
  document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('ativo', c.dataset.cat === catAtual));
  const termo = semAcento($('busca').value.trim());

  $('grade').innerHTML = estado.produtos
    .filter((p) => {
      const bateCat = catAtual === 'Todos' || (catAtual === 'Baixo Giro' ? (p.dias || 0) > DIAS_BAIXO_GIRO : p.cat === catAtual);
      return bateCat && semAcento(`${p.sku} ${p.nome} ${p.end}`).includes(termo);
    })
    .map((p) => {
      const sem = p.end === 'SEM_ENDERECO';
      const parado = (p.dias || 0) > DIAS_BAIXO_GIRO;
      return `<article class="card" data-sku="${p.sku}">
        <div class="topo"><span>${p.sku}</span><span>Unidade: ${p.un}</span></div>
        <h3>${p.nome}</h3>
        <div class="end ${sem ? 'sem' : ''}">${sem ? 'SEM ENDEREÇO FÍSICO' : `${ICONES.pin} ${p.end}`}</div>
        ${sem ? '<div class="alerta-erro">Produto sem endereço cadastrado — definir localização</div>' : ''}
        <div class="saldos">${UNIDADES.map((u) => `<div class="saldo"><small>${u}</small><b>${fmt(p.saldo[u])}</b></div>`).join('')}</div>
        ${parado ? `<div class="selo">Baixo Giro (${p.dias} dias sem saída) — Avaliar liquidação ou remanejamento</div>` : ''}
        ${ehEnc() ? `
          <button class="btn sec btn-end">${sem ? 'Atribuir endereço' : 'Alterar endereço'}</button>
          <div class="endform oculto">
            <input value="${sem ? '' : p.end}" placeholder="GALPAO-C-RUA-02-PAL-03">
            <button class="btn btn-salvar-end">Salvar</button>
          </div>` : ''}
      </article>`;
    }).join('') || '<p class="sub">Nenhum produto encontrado.</p>';
}

$('grade').onclick = (e) => {
  const card = e.target.closest('.card');
  if (!card || !ehEnc()) return;

  if (e.target.closest('.btn-end')) card.querySelector('.endform').classList.toggle('oculto');
  if (e.target.closest('.btn-salvar-end')) {
    const novo = card.querySelector('.endform input').value.trim().toUpperCase();
    const p = produtoDe(card.dataset.sku);
    if (!REGEX_ENDERECO.test(novo)) return toast('Formato inválido. Use GALPAO-C-RUA-02-PAL-03', 'erro');

    const antes = p.end;
    p.end = novo;
    registrarLog('Endereco Fisico Definido', p.sku, '', `${antes} -> ${novo}`);
    toast('Endereço salvo: ' + novo);
    renderConsulta();
  }
};

// --- MOVIMENTAÇÃO ---
function prepararMovimento() {
  const u = usuario();
  $('mResp').value = u.nome;
  $('mCod').value = u.codigo;
  $('mTipo').innerHTML = permissao().tipos.map((t) => `<option value="${t}">${TIPOS[t]}</option>`).join('');
  $('mUnidade').innerHTML = opcoes(UNIDADES);
  $('mUnidade').value = u.unidade;
  $('mSku').innerHTML = '<option value="">Selecione o SKU</option>' +
    estado.produtos.map((p) => `<option value="${p.sku}">${p.sku} - ${p.nome}</option>`).join('');
  $('mQtd').value = '';
  ajustarForm();
  renderTransf();
}

function ajustarForm() {
  const t = $('mTipo').value;
  $('boxDestino').classList.toggle('oculto', t !== 'transferencia');
  $('lblUn').firstChild.textContent = ({
    entrada: 'Unidade de entrada ',
    saida: 'Unidade de saída ',
    quebra: 'Unidade da quebra ',
    transferencia: 'Unidade de origem '
  }[t] || 'Unidade ');
  $('mDestino').innerHTML = opcoes(UNIDADES.filter((x) => x !== $('mUnidade').value));
  mostrarSaldo();
}

function mostrarSaldo() {
  const p = produtoDe($('mSku').value);
  $('mInfo').textContent = p ? `Saldo atual em ${$('mUnidade').value}: ${fmt(p.saldo[$('mUnidade').value])} ${p.un}` : '';
}

$('mTipo').onchange = ajustarForm;
$('mUnidade').onchange = ajustarForm;
$('mSku').onchange = mostrarSaldo;

$('formMov').onsubmit = (e) => {
  e.preventDefault();
  const u = usuario();
  const tipo = $('mTipo').value;
  const un = $('mUnidade').value;
  const dest = $('mDestino').value;
  const p = produtoDe($('mSku').value);
  const qtd = Number($('mQtd').value);

  if (!u || !permissao().tipos.includes(tipo)) return toast('Ação não permitida para o seu cargo', 'erro');
  if (!p) return toast('Selecione o SKU', 'erro');
  if (!un) return toast('Selecione a unidade', 'erro');
  if (!Number.isInteger(qtd) || qtd <= 0) return toast('Informe uma quantidade inteira maior que zero', 'erro');
  if (tipo === 'transferencia' && un === dest) return toast('Origem e destino devem ser diferentes', 'erro');
  if (tipo !== 'entrada' && p.saldo[un] < qtd) return toast(`Saldo insuficiente em ${un}: ${fmt(p.saldo[un])}`, 'erro');

  p.saldo[un] += tipo === 'entrada' ? qtd : -qtd;
  if (tipo === 'saida') p.dias = 0;

  let detalhe = un;
  if (tipo === 'transferencia') {
    estado.transferencias.push({
      id: 'TRF-' + String(estado.transferencias.length + 1).padStart(4, '0'),
      sku: p.sku, qtd, origem: un, destino: dest,
      status: 'Pendente de Recebimento',
      solicitante: { codigo: u.codigo, nome: u.nome },
      dh: new Date().toISOString(), recebidoPor: ''
    });
    detalhe = `${un} -> ${dest} (Pendente de Recebimento)`;
  }

  registrarLog(TIPOS[tipo], p.sku, qtd, detalhe);
  toast(tipo === 'transferencia' ? 'Transferência registrada: pendente de recebimento' : `${TIPOS[tipo]} registrada`);
  $('mQtd').value = '';
  mostrarSaldo();
  renderTransf();
};

const podeReceber = (t) => {
  const u = usuario();
  return t.status === 'Pendente de Recebimento' && u.codigo !== t.solicitante.codigo &&
    (u.cargo === 'Encarregado' || (u.cargo === 'Estoquista' && u.unidade === t.destino));
};

function renderTransf() {
  $('listaTransf').innerHTML = estado.transferencias.slice().reverse().map((t) => `
    <div class="transf">
      <div>
        <b>${t.id} - ${t.sku}</b> (${fmt(t.qtd)} un.)<br>
        <small>${t.origem} -> ${t.destino} • enviado por ${esc(t.solicitante.nome)} (${t.solicitante.codigo}) em ${dataHora(t.dh)}</small>
      </div>
      <div class="acao">
        <span class="status ${t.status === 'Concluido' ? 'ok' : ''}">${t.status}</span>
        ${podeReceber(t)
          ? `<button class="btn btn-rec" data-id="${t.id}">Confirmar recebimento</button>`
          : t.status !== 'Concluido'
            ? `<small>Aguarda ${t.destino}</small>`
            : `<small>Recebido por ${esc(t.recebidoPor)}</small>`}
      </div>
    </div>`
  ).join('') || '<p class="sub">Nenhuma transferência registrada.</p>';
}

$('listaTransf').onclick = (e) => {
  const b = e.target.closest('.btn-rec');
  if (!b) return;
  const t = estado.transferencias.find((x) => x.id === b.dataset.id);
  if (!t || !podeReceber(t)) return toast('Você não pode confirmar este recebimento', 'erro');

  produtoDe(t.sku).saldo[t.destino] += t.qtd;
  t.status = 'Concluido';
  t.recebidoPor = `${usuario().nome} (${usuario().codigo})`;
  registrarLog('Recebimento de Transferencia', t.sku, t.qtd, `${t.id} - ${t.origem} -> ${t.destino}`);
  toast('Recebimento confirmado em ' + t.destino);
  renderTransf();
};

// --- INVENTÁRIO FÍSICO ---
$('invUnidade').innerHTML = opcoes(UNIDADES);
$('invUnidade').onchange = renderInventario;

function renderInventario() {
  const un = $('invUnidade').value;
  $('listaInv').innerHTML = estado.produtos.map((p) => {
    const c = estado.contagens[`${p.sku}|${un}`] || {};
    const ok = c.status === 'Conferido' || c.status === 'Ajustado';
    return `<div class="linha" data-sku="${p.sku}">
      <div class="info"><b>${p.nome}</b><small>${p.sku} - ${p.un}</small></div>
      <div class="campo"><small>Saldo sistema</small><b>${fmt(p.saldo[un])}</b></div>
      <div class="campo"><small>Contagem física</small><input type="number" min="0" inputmode="numeric" class="fis" value="${c.fisico ?? ''}"></div>
      <div class="campo"><small>Divergência</small><b class="difv"></b></div>
      <div class="campo mot"><small>Justificativa</small>
        <select class="motsel">
          <option value="">Selecione</option>
          ${JUSTIFICATIVAS.map((m) => `<option ${c.just === m ? 'selected' : ''}>${m}</option>`).join('')}
        </select>
      </div>
      <div class="acao">
        <button class="btn btn-reg">Registrar</button>
        ${ehEnc() && c.status === 'Pendente de Aprovacao' ? '<button class="btn sec btn-apr">Aprovar ajuste</button>' : ''}
        <span class="status ${ok ? 'ok' : ''} ${c.status ? '' : 'oculto'}">${c.status || ''}</span>
      </div>
    </div>`;
  }).join('');

  document.querySelectorAll('.linha').forEach(pintarLinha);
  atualizarStatusInv();
}

function pintarLinha(l) {
  const un = $('invUnidade').value;
  const p = produtoDe(l.dataset.sku);
  const v = l.querySelector('.fis').value;
  const d = l.querySelector('.difv');

  l.classList.remove('ok', 'bad');
  l.querySelector('.mot').classList.add('off');
  if (v === '') { d.textContent = '-'; return; }

  const dif = Number(v) - p.saldo[un];
  d.textContent = dif === 0 ? 'OK' : `${dif > 0 ? '+' : '-'}${fmt(Math.abs(dif))}`;
  l.classList.add(dif === 0 ? 'ok' : 'bad');
  if (dif !== 0) l.querySelector('.mot').classList.remove('off');
}

function atualizarStatusInv() {
  const un = $('invUnidade').value;
  const cs = Object.entries(estado.contagens).filter(([k]) => k.endsWith(`|${un}`)).map(([, c]) => c);
  const div = cs.filter((c) => c.sistema !== c.fisico).length;
  $('kConf').textContent = cs.length;
  $('kDiv').textContent = div;
}

$('listaInv').oninput = (e) => {
  if (e.target.classList.contains('fis')) pintarLinha(e.target.closest('.linha'));
};

$('listaInv').onclick = (e) => {
  const l = e.target.closest('.linha');
  if (!l) return;
  const un = $('invUnidade').value;
  const p = produtoDe(l.dataset.sku);
  const chave = `${p.sku}|${un}`;

  if (e.target.closest('.btn-reg')) {
    const v = l.querySelector('.fis').value;
    const just = l.querySelector('.motsel').value;
    if (v === '' || Number(v) < 0) return toast('Informe a contagem física', 'erro');

    const dif = Number(v) - p.saldo[un];
    if (dif !== 0 && !just) return toast('Justificativa obrigatória para divergência', 'erro');

    estado.contagens[chave] = {
      sistema: p.saldo[un],
      fisico: Number(v),
      just: dif ? just : '',
      status: dif ? 'Pendente de Aprovacao' : 'Conferido',
      por: usuario().codigo
    };
    registrarLog('Contagem de Inventario', p.sku, Number(v), `${un} - sistema ${p.saldo[un]} - divergencia ${dif}${dif ? ' - ' + just : ''}`);
    toast(dif ? 'Divergência registrada: aguarda aprovação do Encarregado' : 'Contagem conferida');
    renderInventario();
  }

  if (e.target.closest('.btn-apr')) {
    const c = estado.contagens[chave];
    if (!ehEnc() || c?.status !== 'Pendente de Aprovacao') return toast('Ação não permitida', 'erro');

    p.saldo[un] = c.fisico;
    c.status = 'Ajustado';
    registrarLog('Ajuste de Inventario Aprovado', p.sku, c.fisico - c.sistema, `${un} - ${c.sistema} -> ${c.fisico} - ${c.just}`);
    toast('Ajuste aprovado e saldo atualizado');
    renderInventario();
  }
};

// --- CONFERÊNCIA DE ESTOQUE DA MATRIZ ---
let confVisualizandoId = null;

function calcularResumoMatriz(mapaFisico) {
  let conferidos = 0, semDiv = 0, comDiv = 0, faltantes = 0, excedentes = 0;

  estado.produtos.forEach((p) => {
    const val = mapaFisico[p.sku];
    if (val === undefined || val === null || val === '') return;

    conferidos++;
    const sis = Number(p.saldo.Matriz);
    const fis = Number(val);
    const dif = fis - sis;

    if (dif === 0) {
      semDiv++;
    } else {
      comDiv++;
      if (dif < 0) faltantes += Math.abs(dif);
      else excedentes += dif;
    }
  });

  return {
    conferidos,
    pendentes: estado.produtos.length - conferidos,
    semDiv,
    comDiv,
    faltantes,
    excedentes
  };
}

function atualizarPainelMatriz(mapaFisico) {
  const r = calcularResumoMatriz(mapaFisico);
  $('cmConf').textContent = r.conferidos;
  $('cmPend').textContent = r.pendentes;
  $('cmOk').textContent = r.semDiv;
  $('cmDiv').textContent = r.comDiv;
  $('cmFalt').textContent = fmt(r.faltantes);
  $('cmExc').textContent = fmt(r.excedentes);
}

function renderConferenciaMatriz() {
  const historicoItem = confVisualizandoId
    ? estado.confMatrizHistorico.find((h) => h.id === confVisualizandoId)
    : null;

  const somenteLeitura = !!historicoItem;
  const mapaFisico = somenteLeitura ? historicoItem.valores : estado.confMatrizRascunho;

  $('btnConfRascunho').classList.toggle('oculto', somenteLeitura);
  $('btnConfFinalizar').textContent = somenteLeitura ? 'Voltar para Conferência Atual' : 'Finalizar Conferência';

  const termo = semAcento($('cmBusca').value.trim());
  const filtro = $('cmFiltro').value;

  const linhas = estado.produtos
    .filter((p) => semAcento(`${p.sku} ${p.nome}`).includes(termo))
    .map((p) => {
      const sis = somenteLeitura && historicoItem.saldosSistema?.[p.sku] !== undefined
        ? Number(historicoItem.saldosSistema[p.sku])
        : Number(p.saldo.Matriz);

      const raw = mapaFisico[p.sku];
      const temValor = raw !== undefined && raw !== null && raw !== '';
      const fis = temValor ? Number(raw) : null;
      const dif = temValor ? fis - sis : null;

      let status = 'pendente';
      let rotulo = 'Pendente';
      if (temValor) {
        if (dif === 0) { status = 'ok'; rotulo = 'Correto'; }
        else if (dif < 0) { status = 'faltante'; rotulo = 'Faltante'; }
        else { status = 'excedente'; rotulo = 'Excedente'; }
      }

      return { p, sis, raw: temValor ? fis : '', dif, status, rotulo };
    })
    .filter((item) => {
      if (filtro === 'todos') return true;
      if (filtro === 'pendentes') return item.status === 'pendente';
      return item.status === filtro;
    });

  $('cmCorpo').innerHTML = linhas.map(({ p, sis, raw, dif, status, rotulo }) => {
    const difTexto = dif === null ? '-' : (dif > 0 ? `+${fmt(dif)}` : fmt(dif));
    return `<tr class="conf-${status}" data-sku="${p.sku}">
      <td><b>${p.sku}</b></td>
      <td>${esc(p.nome)}</td>
      <td>${p.un}</td>
      <td><b>${fmt(sis)}</b></td>
      <td>
        <input type="number" min="0" step="1" inputmode="numeric"
          class="input-fisico" value="${raw}" ${somenteLeitura ? 'disabled' : ''}
          placeholder="Qtd.">
      </td>
      <td><b>${difTexto}</b></td>
      <td><span class="badge-conf ${status}">${rotulo}</span></td>
    </tr>`;
  }).join('') || '<tr><td colspan="7" class="sub">Nenhum produto encontrado para o filtro selecionado.</td></tr>';

  atualizarPainelMatriz(mapaFisico);
  renderHistoricoMatriz();
}

function renderHistoricoMatriz() {
  $('cmHistCorpo').innerHTML = estado.confMatrizHistorico.slice().reverse().map((h) => `
    <tr>
      <td><b>${h.id}</b></td>
      <td>${dataHora(h.dh)}</td>
      <td>${esc(h.responsavel.nome)} (${h.responsavel.codigo})</td>
      <td>${h.resumo.conferidos}/${h.totalProdutos}</td>
      <td>${h.resumo.semDiv}</td>
      <td>${h.resumo.comDiv}</td>
      <td>-${fmt(h.resumo.faltantes)} / +${fmt(h.resumo.excedentes)}</td>
      <td>
        <button class="btn sec btn-ver-conf" data-id="${h.id}">
          ${confVisualizandoId === h.id ? 'Visualizando' : 'Abrir'}
        </button>
      </td>
    </tr>`
  ).join('') || '<tr><td colspan="8" class="sub">Nenhuma conferência finalizada ainda.</td></tr>';
}

$('cmCorpo').oninput = (e) => {
  if (!e.target.classList.contains('input-fisico') || confVisualizandoId) return;
  const tr = e.target.closest('tr');
  const sku = tr.dataset.sku;
  const val = e.target.value;

  if (val === '' || Number(val) < 0) {
    delete estado.confMatrizRascunho[sku];
  } else {
    estado.confMatrizRascunho[sku] = Math.floor(Number(val));
  }

  const p = produtoDe(sku);
  const sis = Number(p.saldo.Matriz);
  const temValor = estado.confMatrizRascunho[sku] !== undefined;
  const dif = temValor ? estado.confMatrizRascunho[sku] - sis : null;

  tr.className = !temValor ? 'conf-pendente' : dif === 0 ? 'conf-ok' : dif < 0 ? 'conf-faltante' : 'conf-excedente';
  tr.children[5].innerHTML = `<b>${dif === null ? '-' : (dif > 0 ? `+${fmt(dif)}` : fmt(dif))}</b>`;

  const badge = tr.querySelector('.badge-conf');
  badge.className = `badge-conf ${!temValor ? 'pendente' : dif === 0 ? 'ok' : dif < 0 ? 'faltante' : 'excedente'}`;
  badge.textContent = !temValor ? 'Pendente' : dif === 0 ? 'Correto' : dif < 0 ? 'Faltante' : 'Excedente';

  atualizarPainelMatriz(estado.confMatrizRascunho);
};

$('cmBusca').oninput = renderConferenciaMatriz;
$('cmFiltro').onchange = renderConferenciaMatriz;

$('btnConfRascunho').onclick = () => {
  if (confVisualizandoId) return;
  salvar();
  toast('Progresso da conferência salvo. Você pode continuar depois.');
};

$('btnConfFinalizar').onclick = () => {
  if (confVisualizandoId) {
    confVisualizandoId = null;
    renderConferenciaMatriz();
    return;
  }

  const resumo = calcularResumoMatriz(estado.confMatrizRascunho);
  if (resumo.conferidos === 0) {
    return toast('Preencha a contagem física de pelo menos um produto antes de finalizar.', 'erro');
  }

  const u = usuario();
  const saldosSistema = {};
  estado.produtos.forEach((p) => { saldosSistema[p.sku] = Number(p.saldo.Matriz); });

  const registro = {
    id: 'CNF-' + String(estado.confMatrizHistorico.length + 1).padStart(4, '0'),
    dh: new Date().toISOString(),
    responsavel: { codigo: u.codigo, nome: u.nome, cargo: u.cargo },
    totalProdutos: estado.produtos.length,
    resumo,
    saldosSistema,
    valores: copia(estado.confMatrizRascunho)
  };

  estado.confMatrizHistorico.push(registro);
  estado.confMatrizRascunho = {};
  registrarLog(
    'Conferência Matriz Finalizada',
    '',
    resumo.conferidos,
    `${registro.id} - Conferidos: ${resumo.conferidos}, Divergências: ${resumo.comDiv}`
  );
  salvar();
  toast(`Conferência ${registro.id} salva no histórico. Estoque oficial preservado.`);
  renderConferenciaMatriz();
};

$('cmHistCorpo').onclick = (e) => {
  const b = e.target.closest('.btn-ver-conf');
  if (!b) return;
  confVisualizandoId = b.dataset.id;
  renderConferenciaMatriz();
  window.scrollTo(0, 0);
};

$('btnConfCSV').onclick = () => {
  const hist = confVisualizandoId ? estado.confMatrizHistorico.find((h) => h.id === confVisualizandoId) : null;
  const mapa = hist ? hist.valores : estado.confMatrizRascunho;

  const cab = ['SKU', 'Produto', 'Unidade', 'Estoque_Sistema_Matriz', 'Estoque_Fisico', 'Diferenca', 'Situacao'];
  const linhas = estado.produtos.map((p) => {
    const sis = hist?.saldosSistema?.[p.sku] ?? Number(p.saldo.Matriz);
    const fis = mapa[p.sku] ?? '';
    const dif = fis === '' ? '' : Number(fis) - sis;
    const sit = fis === '' ? 'Pendente' : dif === 0 ? 'Sem Divergencia' : dif < 0 ? 'Faltante' : 'Excedente';
    return [p.sku, p.nome, p.un, sis, fis, dif, sit];
  });

  const csv = [cab, ...linhas].map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `conferencia_matriz_${hist ? hist.id : new Date().toISOString().slice(0, 10)}.csv`
  });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  registrarLog('Exportação CSV Conferência Matriz', '', '', hist ? hist.id : 'Conferência em andamento');
  toast('Relatório CSV (Excel) exportado.');
};

$('btnConfPDF').onclick = () => {
  window.print();
};

// --- AUDITORIA & EXPORTAÇÃO POWER BI ---
function renderAuditoria() {
  if (!ehEnc()) return;
  $('audCorpo').innerHTML = estado.log.slice().reverse().map((l) => `
    <tr>
      <td>${l.id}</td><td>${dataHora(l.dh)}</td><td>${l.codigo}</td>
      <td>${esc(l.nome)}</td><td>${l.cargo}</td><td>${l.acao}</td>
      <td>${l.sku}</td><td>${l.qtd === '' ? '' : fmt(l.qtd)}</td><td>${esc(l.detalhe)}</td>
    </tr>`
  ).join('');
}

$('btnCSV').onclick = () => {
  if (!ehEnc()) return toast('Ação não permitida', 'erro');
  const cab = ['ID_Operacao', 'Data_Hora', 'Codigo_Usuario', 'Nome', 'Cargo', 'Acao', 'SKU', 'Quantidade', 'Detalhe'];
  const linhas = estado.log.map((l) => [l.id, dataHora(l.dh), l.codigo, l.nome, l.cargo, l.acao, l.sku, l.qtd, l.detalhe]);
  const csv = [cab, ...linhas].map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(';')).join('\r\n');

  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `log_auditoria_${new Date().toISOString().slice(0, 10)}.csv`
  });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  registrarLog('Exportacao CSV do Log');
  toast('Arquivo CSV gerado para Power BI / Excel');
};

// --- GESTÃO DE EQUIPE ---
$('uCargo').innerHTML = opcoes(Object.keys(PREFIXO));
$('uUnidade').innerHTML = opcoes(UNIDADES);

const encAtivos = () => estado.usuarios.filter((u) => u.cargo === 'Encarregado' && u.ativo !== false);
const ultimoEnc = (u) => u.cargo === 'Encarregado' && u.ativo !== false && encAtivos().length <= 1;
let excluirPendente = '';

function renderUsuarios() {
  if (!ehEnc()) return;
  const eu = usuario().codigo;

  $('usrCorpo').innerHTML = estado.usuarios.map((u) => {
    const ativo = u.ativo !== false;
    const voce = u.codigo === eu;
    const bloq = voce ? 'disabled' : '';

    return `<tr data-cod="${u.codigo}">
      <td><b>${u.codigo}</b></td>
      <td>${esc(u.nome)}${voce ? ' <small>(você)</small>' : ''}</td>
      <td>${u.cargo}</td>
      <td>${u.unidade}</td>
      <td><span class="status ${ativo ? 'ok' : ''}">${ativo ? 'Ativo' : 'Desativado'}</span></td>
      <td><div class="acao">
        <select class="eq-cargo" ${bloq}>${Object.keys(PREFIXO).map((c) => `<option ${c === u.cargo ? 'selected' : ''}>${c}</option>`).join('')}</select>
        <button class="btn sec eq-cargo-ok" ${bloq}>Salvar cargo</button>
        <input class="eq-senha" type="password" placeholder="Nova senha" autocomplete="new-password">
        <button class="btn sec eq-senha-ok">Resetar senha</button>
        <button class="btn sec eq-tog" ${bloq}>${ativo ? 'Desativar' : 'Ativar'}</button>
        <button class="btn perigo eq-del" ${bloq}>${excluirPendente === u.codigo ? 'Confirmar exclusão?' : 'Excluir'}</button>
      </div></td>
    </tr>`;
  }).join('');
}

$('usrCorpo').onclick = (e) => {
  const tr = e.target.closest('tr');
  const b = e.target.closest('button');
  if (!tr || !b) return;
  if (!ehEnc()) return toast('Somente o Encarregado gerencia a equipe', 'erro');

  const u = estado.usuarios.find((x) => x.codigo === tr.dataset.cod);
  if (!u) return;

  const voce = u.codigo === usuario().codigo;
  const ident = `${u.codigo} - ${u.nome}`;

  if (b.classList.contains('eq-cargo-ok')) {
    const novo = tr.querySelector('.eq-cargo').value;
    if (voce) return toast('Você não pode alterar o próprio cargo', 'erro');
    if (novo === u.cargo) return toast('Esse já é o cargo atual');
    if (ultimoEnc(u)) return toast('Bloqueado: é o último Encarregado ativo', 'erro');
    registrarLog('Cargo Alterado', '', '', `${ident}: ${u.cargo} -> ${novo}`);
    u.cargo = novo;
    toast('Cargo atualizado');
  } else if (b.classList.contains('eq-senha-ok')) {
    const nova = tr.querySelector('.eq-senha').value;
    if (nova.length < 3) return toast('Informe a nova senha (mínimo 3 caracteres)', 'erro');
    u.senha = nova;
    registrarLog('Senha Resetada', '', '', ident);
    toast('Senha redefinida');
  } else if (b.classList.contains('eq-tog')) {
    const ativo = u.ativo !== false;
    if (voce) return toast('Você não pode desativar o próprio usuário', 'erro');
    if (ativo && ultimoEnc(u)) return toast('Bloqueado: é o último Encarregado ativo', 'erro');
    registrarLog(ativo ? 'Colaborador Desativado' : 'Colaborador Ativado', '', '', ident);
    u.ativo = !ativo;
    toast(ativo ? 'Acesso desativado agora' : 'Acesso reativado');
  } else if (b.classList.contains('eq-del')) {
    if (voce) return toast('Você não pode excluir o próprio usuário', 'erro');
    if (ultimoEnc(u)) return toast('Bloqueado: é o último Encarregado ativo', 'erro');
    if (excluirPendente !== u.codigo) {
      excluirPendente = u.codigo;
      renderUsuarios();
      setTimeout(() => {
        if (excluirPendente === u.codigo) {
          excluirPendente = '';
          if (usuario() && abaAtual === 'usuarios') renderUsuarios();
        }
      }, 4000);
      return;
    }
    registrarLog('Colaborador Excluido', '', '', ident);
    estado.usuarios = estado.usuarios.filter((x) => x.codigo !== u.codigo);
    excluirPendente = '';
    toast('Colaborador excluído');
  }

  salvar();
  renderUsuarios();
};

$('formUsr').onsubmit = (e) => {
  e.preventDefault();
  if (!ehEnc()) return toast('Somente o Encarregado cadastra colaboradores', 'erro');

  const nome = $('uNome').value.trim();
  const senha = $('uSenha').value;
  const cargo = $('uCargo').value;
  if (nome.length < 3 || senha.length < 3) return toast('Informe nome e senha (mínimo 3 caracteres)', 'erro');

  let codigo;
  do {
    codigo = `${PREFIXO[cargo]}-${100 + Math.floor(Math.random() * 900)}`;
  } while (estado.usuarios.some((x) => x.codigo === codigo));

  estado.usuarios.push({ codigo, senha, nome, cargo, unidade: $('uUnidade').value, ativo: true });
  registrarLog('Colaborador Cadastrado', '', '', `${codigo} - ${nome} - ${cargo}`);
  toast('Código Único gerado: ' + codigo);
  $('formUsr').reset();
  renderUsuarios();
};

let resetPendente = false;
$('btnReset').onclick = () => {
  if (!ehEnc()) return;
  if (!resetPendente) {
    resetPendente = true;
    toast('Clique de novo para confirmar o reset', 'erro');
    setTimeout(() => (resetPendente = false), 4000);
    return;
  }
  estado = novoEstado(estado);
  resetPendente = false;
  registrarLog('Reset de Dados de Demonstracao');
  toast('Produtos e saldos padrão restaurados');
  showAba('usuarios');
};

window.onstorage = (e) => {
  if (e.key !== CHAVE) return;
  estado = carregar();
  if (codigoSessao && !usuario()) {
    setSessao(null);
    mostrarApp();
    toast('Sessão encerrada: acesso removido', 'erro');
  }
};

// --- ANIMAÇÃO DE DIGITAÇÃO DA MARCA ---
(function iniciarDigitacao() {
  const frases = ['CERÂMICA PRO', 'SERRA AZUL'];
  let idxFrase = 0;
  let idxLetra = 0;
  let apagando = false;

  function animar() {
    const elLogin = $('textoDigitado');
    const elHome = $('textoDigitadoHome');
    const atual = frases[idxFrase];

    if (!apagando) {
      idxLetra++;
      const trecho = atual.slice(0, idxLetra);
      if (elLogin) elLogin.textContent = trecho;
      if (elHome) elHome.textContent = trecho;

      if (idxLetra === atual.length) {
        apagando = true;
        return setTimeout(animar, 2200);
      }
      return setTimeout(animar, 110);
    } else {
      idxLetra--;
      const trecho = atual.slice(0, idxLetra);
      if (elLogin) elLogin.textContent = trecho;
      if (elHome) elHome.textContent = trecho;

      if (idxLetra === 0) {
        apagando = false;
        idxFrase = (idxFrase + 1) % frases.length;
        return setTimeout(animar, 400);
      }
      return setTimeout(animar, 60);
    }
  }

  animar();
})();

mostrarApp();
