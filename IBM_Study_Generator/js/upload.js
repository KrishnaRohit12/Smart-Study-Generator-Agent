// ============================================================
//  Smart Study Generator — Upload Notes
//  File: js/upload.js
// ============================================================

'use strict';

/* ─── State ─────────────────────────────────────────────── */
const state = {
  files: [],          // { id, file, status, progress }
  nextId: 1,
};

/* ─── DOM refs ──────────────────────────────────────────── */
const dropZone      = document.getElementById('dropZone');
const fileInput     = document.getElementById('fileInput');
const fileList      = document.getElementById('fileList');
const fileCount     = document.getElementById('fileCount');
const queueEmpty    = document.getElementById('queueEmpty');
const queueActions  = document.getElementById('queueActions');
const processBtn    = document.getElementById('processBtn');
const clearAllBtn   = document.getElementById('clearAllBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill  = document.getElementById('progressFill');
const progressPct   = document.getElementById('progressPct');
const progressLabel = document.getElementById('progressLabel');
const uploadToast   = document.getElementById('uploadToast');
const toastText     = document.getElementById('toastText');
const toastIcon     = document.getElementById('toastIcon');

/* ─── Accepted types ────────────────────────────────────── */
const ACCEPTED = {
  'application/pdf':                               'pdf',
  'application/msword':                            'docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain':                                    'txt',
  'image/jpeg':                                    'img',
  'image/png':                                     'img',
  'image/webp':                                    'img',
};
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

/* ─── Drag & Drop ───────────────────────────────────────── */
['dragenter', 'dragover'].forEach(evt =>
  dropZone.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dropZone.classList.add('drag-over');
  })
);
['dragleave', 'dragend', 'drop'].forEach(evt =>
  dropZone.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dropZone.classList.remove('drag-over');
  })
);
dropZone.addEventListener('drop', e => {
  const files = Array.from(e.dataTransfer?.files || []);
  handleFiles(files);
});

/* Also accept click on the zone itself (not just the label) */
dropZone.addEventListener('click', e => {
  if (e.target.closest('label') || e.target === fileInput) return;
  fileInput.click();
});

/* ─── File input change ─────────────────────────────────── */
fileInput.addEventListener('change', () => {
  handleFiles(Array.from(fileInput.files));
  fileInput.value = ''; // reset so same file can be re-added
});

/* ─── Handle files ──────────────────────────────────────── */
function handleFiles(files) {
  if (!files.length) return;

  let added = 0;
  const errors = [];

  files.forEach(file => {
    const type = ACCEPTED[file.type];
    if (!type) {
      errors.push(`"${file.name}" — unsupported type`);
      return;
    }
    if (file.size > MAX_BYTES) {
      errors.push(`"${file.name}" — exceeds 20 MB limit`);
      return;
    }
    // Deduplicate by name+size
    const exists = state.files.some(f => f.file.name === file.name && f.file.size === file.size);
    if (exists) {
      errors.push(`"${file.name}" — already added`);
      return;
    }

    state.files.push({ id: state.nextId++, file, type, status: 'ready', progress: 0 });
    added++;
  });

  if (errors.length) showToast('error', '⚠ ' + errors[0]);
  if (added)         renderFileList();
  if (added > 1 && errors.length === 0) showToast('success', `✓ ${added} files added`);
  else if (added === 1 && errors.length === 0) showToast('success', `✓ "${files[0]?.name}" added`);
}

/* ─── Render file list ──────────────────────────────────── */
function renderFileList() {
  const count = state.files.length;

  // Toggle empty state
  queueEmpty.hidden  = count > 0;
  queueActions.hidden = count === 0;
  processBtn.disabled = count === 0;
  fileCount.textContent = `${count} file${count !== 1 ? 's' : ''}`;

  // Build list
  fileList.innerHTML = '';
  state.files.forEach(item => {
    const li = document.createElement('li');
    li.className = 'upload-file-item';
    li.dataset.id = item.id;

    li.innerHTML = `
      <div class="file-item__icon file-item__icon--${item.type}">${iconLabel(item.type)}</div>
      <div class="file-item__info">
        <span class="file-item__name" title="${escHtml(item.file.name)}">${escHtml(item.file.name)}</span>
        <span class="file-item__meta">${formatBytes(item.file.size)}</span>
      </div>
      <span class="file-item__status file-item__status--${item.status}">${statusLabel(item.status)}</span>
      <button class="file-item__remove" data-id="${item.id}" aria-label="Remove ${escHtml(item.file.name)}" title="Remove">
        &times;
      </button>
    `;
    fileList.appendChild(li);
  });

  // Remove button handlers
  fileList.querySelectorAll('.file-item__remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      removeFile(Number(btn.dataset.id));
    });
  });
}

/* ─── Remove file ───────────────────────────────────────── */
function removeFile(id) {
  state.files = state.files.filter(f => f.id !== id);
  renderFileList();
  if (!state.files.length) showToast('info', 'ℹ All files removed');
}

/* ─── Clear all ─────────────────────────────────────────── */
clearAllBtn?.addEventListener('click', () => {
  state.files = [];
  renderFileList();
  showToast('info', 'ℹ File list cleared');
});

/* ─── Process button (simulated AI processing) ──────────── */
processBtn?.addEventListener('click', () => {
  if (!state.files.length) return;

  processBtn.disabled  = true;
  clearAllBtn.disabled = true;
  uploadProgress.hidden = false;

  let current = 0;
  const total  = state.files.length;

  processNext();

  function processNext() {
    if (current >= total) {
      // All done
      progressFill.style.width = '100%';
      progressPct.textContent  = '100%';
      progressLabel.textContent = 'Processing complete!';
      showToast('success', `✓ ${total} file${total>1?'s':''} processed by IBM Granite AI`);
      processBtn.disabled  = false;
      clearAllBtn.disabled = false;

      // Update statuses
      state.files.forEach(f => f.status = 'ready');
      renderFileList();

      setTimeout(() => { uploadProgress.hidden = true; }, 3000);

      // Redirect suggestion
      setTimeout(() => showToast('info', 'ℹ Files ready — head to AI Chat to start studying!'), 3500);
      return;
    }

    const item = state.files[current];
    const pct  = Math.round(((current) / total) * 100);
    progressFill.style.width = pct + '%';
    progressPct.textContent  = pct + '%';
    progressLabel.textContent = `Processing "${item.file.name}"…`;

    // Simulate async processing (1–2 s per file)
    const delay = 900 + Math.random() * 800;
    setTimeout(() => {
      item.status = 'ready';
      current++;
      processNext();
    }, delay);
  }
});

/* ─── Toast notification ────────────────────────────────── */
let toastTimer;
function showToast(type, message) {
  clearTimeout(toastTimer);
  uploadToast.className = `upload-toast upload-toast--${type}`;
  toastText.textContent = message;
  uploadToast.hidden    = false;
  toastTimer = setTimeout(() => {
    uploadToast.style.opacity = '0';
    setTimeout(() => { uploadToast.hidden = true; uploadToast.style.opacity = ''; }, 300);
  }, 4500);
}

/* ─── Helpers ───────────────────────────────────────────── */
function iconLabel(type) {
  return { pdf: 'PDF', docx: 'DOC', txt: 'TXT', img: 'IMG' }[type] || 'FILE';
}
function statusLabel(status) {
  return { ready: 'Ready', uploading: 'Uploading…', error: 'Error' }[status] || status;
}
function formatBytes(bytes) {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ─── Initial render ────────────────────────────────────── */
renderFileList();

/* ─── Scroll reveal (re-run for this page) ──────────────── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();
