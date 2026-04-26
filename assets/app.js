const EMAIL_TO = 'belen.acpe@gmail.com';
const TEACHER_EMAIL = 'belen.acpe@gmail.com';
const TEACHER_PASSWORD = 'NeotechEdulab'; // Acceso local para abrir reporte/panel docente en sitio estático.

const quiz = [
  { proceso: 'Interfase', p: 'Interfase: ¿en qué fase se duplica el ADN?', a: ['G1', 'S', 'G2', 'Citocinesis'], c: 1, e: 'En fase S ocurre la síntesis o duplicación del ADN.' },
  { proceso: 'Interfase', p: '¿Cuál es la función principal de G1?', a: ['Separar cromátidas', 'Crecimiento y actividad celular', 'Formar gametos', 'Dividir citoplasma'], c: 1, e: 'G1 corresponde a crecimiento inicial y actividad metabólica.' },
  { proceso: 'Mitosis', p: '¿Qué ocurre en profase?', a: ['Cromosomas se condensan', 'Cromosomas se alinean', 'Citoplasma se divide', 'Se forman gametos'], c: 0, e: 'En profase los cromosomas se hacen visibles por condensación.' },
  { proceso: 'Mitosis', p: '¿Qué ocurre en metafase?', a: ['Se forma placa celular', 'Cromosomas al centro', 'Se duplica el ADN', 'Aparece surco de segmentación'], c: 1, e: 'En metafase los cromosomas se ordenan en la zona ecuatorial.' },
  { proceso: 'Mitosis', p: '¿Qué ocurre en anafase?', a: ['Separación de cromátidas hermanas', 'Duplicación de ADN', 'Crecimiento celular', 'Formación de gametos'], c: 0, e: 'En anafase las cromátidas hermanas migran hacia polos opuestos.' },
  { proceso: 'Mitosis', p: '¿Qué ocurre en telofase?', a: ['Se reorganizan núcleos nuevos', 'Empieza fase S', 'Se reduce número cromosómico', 'La célula entra a G0'], c: 0, e: 'En telofase se forman nuevamente envolturas nucleares.' },
  { proceso: 'Citocinesis', p: '¿Qué separa la citocinesis?', a: ['El ADN', 'El núcleo', 'El citoplasma', 'Los genes'], c: 2, e: 'La citocinesis divide el citoplasma y completa la formación de células hijas.' },
  { proceso: 'Citocinesis', p: 'En animales, la citocinesis se observa como:', a: ['Placa celular', 'Surco de segmentación', 'Sinapsis cromosómica', 'Crossing-over'], c: 1, e: 'En animales se forma un surco que estrangula la célula.' },
  { proceso: 'Meiosis', p: 'La meiosis se caracteriza porque:', a: ['Forma 2 células iguales', 'Forma 4 células haploides', 'Solo repara tejidos', 'No modifica cromosomas'], c: 1, e: 'La meiosis produce cuatro células haploides genéticamente distintas.' },
  { proceso: 'Meiosis', p: 'Diferencia central entre mitosis y meiosis:', a: ['Mitosis produce gametos; meiosis repara tejidos', 'Mitosis conserva cromosomas; meiosis los reduce', 'Ambas hacen siempre 4 células', 'Ninguna duplica ADN antes'], c: 1, e: 'Mitosis conserva el número cromosómico; meiosis lo reduce para formar gametos.' }
];

let state = { name: '', course: '2° Medio', group: '', email: '', score: 0, graded: false, report: null, teacherAuthenticated: sessionStorage.getItem('cc_teacher_auth') === 'true' };
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function escapeHtml(v) {
  return String(v ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

function teacherLockHtml() {
  return `
    🔒 Reporte pedagógico protegido. El resultado se envía automáticamente al correo de la profesora, pero el reporte detallado solo se muestra cuando Belén inicia sesión.
    <div class="teacher-login-inline">
      <input id="teacherEmailInline" type="email" placeholder="Correo docente">
      <input id="teacherPassInline" type="password" placeholder="Contraseña docente">
      <button class="btn soft" id="teacherLoginInline" type="button">Abrir reporte docente</button>
    </div>`;
}

function isTeacherAuthenticated() {
  return state.teacherAuthenticated || sessionStorage.getItem('cc_teacher_auth') === 'true';
}

function attachInlineLogin() {
  const btn = $('#teacherLoginInline');
  if (!btn) return;
  btn.onclick = () => attemptTeacherLogin('#teacherEmailInline', '#teacherPassInline');
}

function attemptTeacherLogin(emailSelector, passSelector) {
  const email = ($(emailSelector)?.value || '').trim().toLowerCase();
  const pass = ($(passSelector)?.value || '').trim();
  if (email === TEACHER_EMAIL && pass === TEACHER_PASSWORD) {
    state.teacherAuthenticated = true;
    sessionStorage.setItem('cc_teacher_auth', 'true');
    setTeacherUi();
    if (state.report) renderReport(state.report);
    alert('Acceso docente habilitado.');
    return true;
  }
  alert('Correo o contraseña docente incorrectos.');
  return false;
}

function teacherLogout() {
  state.teacherAuthenticated = false;
  sessionStorage.removeItem('cc_teacher_auth');
  setTeacherUi();
  if (state.report) renderReport(state.report);
}

function setTeacherUi() {
  const auth = isTeacherAuthenticated();
  const panel = $('#panel');
  const gate = $('#teacherGate');
  const content = $('#teacherContent');
  const logout = $('#teacherLogout');
  if (panel) panel.classList.toggle('teacher-locked', !auth);
  if (gate) gate.style.display = auth ? 'none' : 'block';
  if (content) content.style.display = auth ? 'block' : 'none';
  if (logout) logout.style.display = auth ? 'inline-flex' : 'none';
  const exportBtn = $('#exportCsv');
  const clearBtn = $('#clearData');
  if (exportBtn) exportBtn.disabled = !auth;
  if (clearBtn) clearBtn.disabled = !auth;
  attachInlineLogin();
}

function renderQuiz() {
  $('#quizForm').innerHTML = quiz.map((q, i) => `
    <div class='question' data-proceso='${q.proceso}'>
      <span class='pill'>${q.proceso}</span>
      <h3>${i + 1}. ${q.p}</h3>
      ${q.a.map((x, j) => `<label><input type='radio' name='q${i}' value='${j}'> ${x}</label>`).join('')}
      <div class='feedback' id='fb${i}'></div>
    </div>`).join('');
}

function loadStudent() {
  const s = JSON.parse(localStorage.getItem('cc_student') || 'null');
  if (s) {
    state = { ...state, ...s };
    $('#studentName').value = s.name || '';
    $('#studentCourse').value = s.course || '2° Medio';
    $('#studentGroup').value = s.group || '';
    $('#studentEmail').value = s.email || '';
    $('#currentStudent').textContent = `Estudiante actual: ${s.name} · ${s.course} · ${s.email || 'sin correo'} · ${s.group || 'sin grupo'}`;
  }
}

function processStats() {
  const stats = {};
  quiz.forEach(q => stats[q.proceso] = stats[q.proceso] || { ok: 0, total: 0 });
  quiz.forEach((q, i) => {
    const v = $(`input[name=q${i}]:checked`);
    stats[q.proceso].total++;
    if (v && Number(v.value) === q.c) stats[q.proceso].ok++;
  });
  return stats;
}

function buildReport(score) {
  const porcentaje = Math.round(score / quiz.length * 100);
  const stats = processStats();
  const detalles = Object.entries(stats).map(([proceso, d]) => ({
    proceso,
    ok: d.ok,
    total: d.total,
    pct: Math.round((d.ok / d.total) * 100)
  }));
  const weak = [...detalles].sort((a, b) => a.pct - b.pct)[0];
  const strong = [...detalles].sort((a, b) => b.pct - a.pct)[0];
  const logro = porcentaje >= 90 ? '🏆 Experto/a en ciclo celular' : porcentaje >= 70 ? '🥇 Buen dominio' : porcentaje >= 50 ? '📘 En desarrollo' : '🔁 Requiere refuerzo guiado';
  const recomendacion = weak.pct < 60
    ? `Reforzar ${weak.proceso}: volver a revisar explicación, infografía y responder preguntas de práctica.`
    : 'Mantener práctica con comparación entre mitosis y meiosis para consolidar aprendizajes.';
  return { porcentaje, detalles, weak, strong, logro, recomendacion };
}

function renderReport(report) {
  const box = $('#reportBox');
  if (!box) return;
  if (!isTeacherAuthenticated()) {
    box.classList.add('locked');
    box.innerHTML = teacherLockHtml();
    attachInlineLogin();
    return;
  }
  box.classList.remove('locked');
  box.innerHTML = `
    <h3>📊 Reporte pedagógico automático</h3>
    <p><b>Logro:</b> ${report.logro}</p>
    <p><b>Fortaleza:</b> ${report.strong.proceso} (${report.strong.ok}/${report.strong.total}).</p>
    <p><b>Proceso a reforzar:</b> ${report.weak.proceso} (${report.weak.ok}/${report.weak.total}).</p>
    <p><b>Sugerencia docente:</b> ${report.recomendacion}</p>
    <div class='bars'>${report.detalles.map(d => `<div><span>${d.proceso}</span><progress value='${d.pct}' max='100'></progress><b>${d.pct}%</b></div>`).join('')}</div>`;
}

function grade() {
  let score = 0;
  quiz.forEach((q, i) => {
    const v = $(`input[name=q${i}]:checked`);
    const fb = $(`#fb${i}`);
    if (v && Number(v.value) === q.c) {
      score++;
      fb.textContent = '✅ ' + q.e;
      fb.className = 'feedback ok';
    } else {
      fb.textContent = '❌ Revisa: ' + q.e;
      fb.className = 'feedback bad';
    }
  });
  state.score = score;
  state.graded = true;
  state.report = buildReport(score);
  $('#scoreBox').textContent = `Puntaje: ${score}/${quiz.length} (${state.report.porcentaje}%)`;
  renderReport(state.report);
  return score;
}

function records() { return JSON.parse(localStorage.getItem('cc_records') || '[]'); }
function setRecords(r) { localStorage.setItem('cc_records', JSON.stringify(r)); refreshPanel(); }

async function sendEmail(record) {
  const formData = new FormData();
  formData.append('nombre_estudiante', record.nombre);
  formData.append('curso', record.curso);
  formData.append('correo_institucional', record.email);
  formData.append('grupo', record.grupo);
  formData.append('puntaje', `${record.puntaje}/${quiz.length}`);
  formData.append('porcentaje', record.porcentaje + '%');
  formData.append('logro', record.logro);
  formData.append('fortaleza', record.fortaleza);
  formData.append('proceso_a_reforzar', record.refuerzo);
  formData.append('recomendacion_docente', record.recomendacion);
  formData.append('detalle_por_proceso', record.detalleProcesos);
  formData.append('ticket_diferencia_mitosis_meiosis', record.ticket);
  formData.append('ticket_proceso_dificil', record.dificultad);
  formData.append('ticket_pregunta_pendiente', record.pregunta);
  formData.append('seguridad_estudiante', record.seguridad);
  formData.append('fecha', record.fecha);
  formData.append('_subject', `Resultados Ciclo Celular - ${record.nombre} - ${record.curso}`);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');
  // No se agrega CC/BCC ni reply-to al alumno: el envío es solo al correo docente.
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL_TO}`, { method: 'POST', headers: { 'Accept': 'application/json' }, body: formData });
    return res.ok ? 'enviado al profesor' : 'pendiente/confirmación';
  } catch (e) {
    return 'error de conexión';
  }
}

async function saveAndSend() {
  if (!state.name) { alert('Primero registra el nombre del estudiante.'); return; }
  if (!state.email || !state.email.includes('@')) { alert('Ingresa un correo institucional válido.'); return; }
  if (!state.graded) grade();
  const ticket = $('#ticketText').value.trim();
  const dificultad = $('#ticketDificultad').value.trim();
  const pregunta = $('#ticketPregunta').value.trim();
  if (ticket.length < 20) { alert('Completa la primera pregunta del ticket con al menos 20 caracteres.'); return; }
  if (dificultad.length < 10) { alert('Completa la pregunta sobre el proceso más difícil.'); return; }
  const r = state.report || buildReport(state.score);
  const record = {
    fecha: new Date().toLocaleString('es-CL'),
    nombre: state.name,
    curso: state.course,
    email: state.email,
    grupo: state.group,
    puntaje: state.score,
    porcentaje: r.porcentaje,
    ticket,
    dificultad,
    pregunta,
    seguridad: $('#confidence').value,
    logro: r.logro,
    fortaleza: `${r.strong.proceso} (${r.strong.ok}/${r.strong.total})`,
    refuerzo: `${r.weak.proceso} (${r.weak.ok}/${r.weak.total})`,
    recomendacion: r.recomendacion,
    detalleProcesos: r.detalles.map(d => `${d.proceso}: ${d.ok}/${d.total} (${d.pct}%)`).join(' | '),
    correo: 'enviando...'
  };
  const list = records();
  list.push(record);
  setRecords(list);
  $('#saveBtn').textContent = 'Enviando al profesor...';
  const status = await sendEmail(record);
  record.correo = status;
  setRecords(list);
  $('#saveBtn').textContent = 'Guardar y enviar correo';
  alert('Resultado guardado. Estado del correo: ' + status + '. El envío está configurado solo para el correo de la profesora.');
}

function refreshPanel() {
  const r = records();
  $('#statCount').textContent = r.length;
  $('#statAvg').textContent = r.length ? Math.round(r.reduce((a, b) => a + b.porcentaje, 0) / r.length) + '%' : '0%';
  $('#statBest').textContent = r.length ? Math.max(...r.map(x => x.puntaje)) + '/' + quiz.length : '0/' + quiz.length;
  if ($('#statWeak')) {
    const freq = {};
    r.forEach(x => { const key = (x.refuerzo || '').split(' ')[0] || '—'; freq[key] = (freq[key] || 0) + 1; });
    $('#statWeak').textContent = r.length ? Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0] : '—';
  }
  $('#resultsBody').innerHTML = r.length ? r.map(x => `
    <tr><td>${escapeHtml(x.fecha)}</td><td>${escapeHtml(x.nombre)}</td><td>${escapeHtml(x.curso)}</td><td>${escapeHtml(x.email || '')}</td><td>${escapeHtml(x.grupo || '')}</td><td>${x.puntaje}/${quiz.length}</td><td>${x.porcentaje}%</td><td>${escapeHtml(x.logro || '')}</td><td>${escapeHtml(x.refuerzo || '')}</td><td>${escapeHtml(x.correo)}</td></tr>`).join('') : `<tr><td colspan='10'>Sin registros todavía.</td></tr>`;
}

function exportCsv() {
  if (!isTeacherAuthenticated()) { alert('Solo la profesora puede exportar CSV. Ingresa con el correo docente y contraseña.'); return; }
  const r = records();
  const rows = [['fecha', 'nombre', 'curso', 'correo_institucional', 'grupo', 'puntaje', 'porcentaje', 'logro', 'fortaleza', 'refuerzo', 'recomendacion', 'detalle_procesos', 'ticket', 'dificultad', 'pregunta', 'seguridad', 'correo'], ...r.map(x => [x.fecha, x.nombre, x.curso, x.email, x.grupo, x.puntaje, x.porcentaje, x.logro, x.fortaleza, x.refuerzo, x.recomendacion, x.detalleProcesos, x.ticket, x.dificultad, x.pregunta, x.seguridad, x.correo])];
  const csv = rows.map(row => row.map(v => '"' + String(v ?? '').replaceAll('"', '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'resultados_ciclo_celular_profesor.csv';
  a.click();
}

function speak(txt) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'es-CL'; speechSynthesis.speak(u); }

document.addEventListener('DOMContentLoaded', () => {
  renderQuiz(); loadStudent(); refreshPanel(); setTeacherUi(); attachInlineLogin();
  const panelLogin = $('#teacherLoginPanel');
  if (panelLogin) panelLogin.onclick = () => attemptTeacherLogin('#teacherEmailPanel', '#teacherPassPanel');
  const logoutBtn = $('#teacherLogout');
  if (logoutBtn) logoutBtn.onclick = teacherLogout;
  $('#studentForm').addEventListener('submit', e => {
    e.preventDefault();
    state.name = $('#studentName').value.trim();
    state.course = $('#studentCourse').value.trim();
    state.group = $('#studentGroup').value.trim();
    state.email = $('#studentEmail').value.trim();
    localStorage.setItem('cc_student', JSON.stringify({ name: state.name, course: state.course, group: state.group, email: state.email }));
    $('#currentStudent').textContent = `Estudiante actual: ${state.name} · ${state.course} · ${state.email} · ${state.group || 'sin grupo'}`;
  });
  $('#gradeBtn').onclick = grade;
  $('#saveBtn').onclick = saveAndSend;
  $('#resetBtn').onclick = () => { document.getElementById('quizForm').reset(); $$('.feedback').forEach(f => f.textContent = ''); state.graded = false; state.score = 0; state.report = null; $('#scoreBox').textContent = 'Puntaje: 0/10'; $('#reportBox').classList.add('locked'); $('#reportBox').innerHTML = teacherLockHtml(); attachInlineLogin(); };
  $('#exportCsv').onclick = exportCsv;
  $('#clearData').onclick = () => { if (!isTeacherAuthenticated()) { alert('Solo la profesora puede borrar datos.'); return; } if (confirm('¿Borrar todos los resultados locales?')) setRecords([]); };
  $('#themeBtn').onclick = () => document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  $('#fontPlus').onclick = () => document.documentElement.style.setProperty('--fs', '18px');
  $('#fontMinus').onclick = () => document.documentElement.style.setProperty('--fs', '15px');
  $('#contrastBtn').onclick = () => document.body.classList.toggle('high-contrast');
  $('#speakBtn').onclick = () => speak(document.getSelection().toString() || 'Clase interactiva sobre ciclo celular, mitosis, citocinesis y meiosis.');
  $('#readPage').onclick = () => speak('Del ADN a dos células hijas. En esta clase aprenderás interfase, mitosis, citocinesis y meiosis con actividades interactivas.');
  $('#pulseBtn').onclick = () => $('#cellStage').classList.toggle('active');
  $$('.timeline button').forEach(b => b.onclick = () => $('#phaseOutput').textContent = b.dataset.phase);
});
