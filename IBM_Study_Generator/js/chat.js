// ============================================================
//  Smart Study Generator — AI Chat
//  File: js/chat.js
// ============================================================

'use strict';

/* ─── DOM refs ──────────────────────────────────────────── */
const chatMessages  = document.getElementById('chatMessages');
const chatWelcome   = document.getElementById('chatWelcome');
const chatSuggestions = document.getElementById('chatSuggestions');
const chatInput     = document.getElementById('chatInput');
const chatSendBtn   = document.getElementById('chatSendBtn');
const newChatBtn    = document.getElementById('newChatBtn');
const clearChatBtn  = document.getElementById('clearChatBtn');
const exportChatBtn = document.getElementById('exportChatBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose  = document.getElementById('sidebarClose');
const chatSidebar   = document.getElementById('chatSidebar');
const recentChats   = document.getElementById('recentChats');
const charCount     = document.getElementById('charCount');

/* ─── State ─────────────────────────────────────────────── */
const state = {
  messages: [],      // { role: 'user'|'ai', text, time }
  isTyping: false,
};

/* ─── IBM Granite AI simulation responses ───────────────── */
const AI_RESPONSES = {
  summarise: `Here's a structured summary of your uploaded notes:

**Key Concepts:**
• **Supervised Learning** — Model trained on labelled data to predict outcomes. Common algorithms: Linear Regression, Decision Trees, SVM, Neural Networks.
• **Unsupervised Learning** — Finds hidden patterns in unlabelled data. Techniques: K-Means Clustering, PCA, Autoencoders.
• **Gradient Descent** — Iterative optimisation algorithm that minimises the loss function by updating weights in the direction of steepest descent.
• **Overfitting vs Underfitting** — Overfitting: model memorises training data. Underfitting: model is too simple to capture patterns.

**Important Formulae:**
• Loss (MSE): L = (1/n) Σ(yᵢ − ŷᵢ)²
• Gradient Update: θ = θ − α·∇L

*Grounded in: ML_Chapter5.pdf, DataStructures.docx*`,

  quiz: `Here are **5 quiz questions** generated from your study material:

**Q1.** What is the primary difference between supervised and unsupervised learning?
> A) Supervised uses labelled data; unsupervised does not ✓

**Q2.** Which optimisation algorithm is most commonly used to train neural networks?
> A) Gradient Descent ✓

**Q3.** What does overfitting indicate about a machine learning model?
> A) The model performs well on training data but poorly on new data ✓

**Q4.** In K-Means clustering, what does 'K' represent?
> A) The number of clusters ✓

**Q5.** What is the role of the learning rate (α) in gradient descent?
> A) It controls the size of the weight update at each step ✓

*Based on: ML_Chapter5.pdf*`,

  plan: `Here's a **personalised study plan** based on your uploaded material:

**Week 1 — Foundations**
• Day 1–2: Supervised Learning concepts + practice problems
• Day 3–4: Unsupervised Learning & Clustering
• Day 5: Review quiz (auto-generated) + flashcards

**Week 2 — Core Algorithms**
• Day 1–2: Neural Networks & Backpropagation
• Day 3: Optimisation — Gradient Descent variants
• Day 4–5: Model Evaluation & Cross-validation

**Week 3 — Applied Practice**
• Days 1–3: Past paper problems
• Days 4–5: Mock exam + AI-reviewed answers

*Estimated study time: 45–60 min/day*`,

  topics: `Based on your uploaded notes, here are the **most important topics** to focus on:

**High Priority (exam-likely):**
1. 🔴 Gradient Descent & Backpropagation
2. 🔴 Bias-Variance Tradeoff (Overfitting/Underfitting)
3. 🔴 Supervised vs Unsupervised classification

**Medium Priority:**
4. 🟡 Decision Trees & Random Forests
5. 🟡 K-Means Clustering algorithm
6. 🟡 Regularisation (L1 / L2)

**Review:**
7. 🟢 Basic probability & linear algebra
8. 🟢 Python syntax for ML libraries

*Tip: Spend 60% of revision time on High Priority topics.*`,

  explain: `Let me explain **Gradient Descent** in simple terms:

Imagine you're blindfolded on a hilly landscape and want to reach the lowest point (valley). You can't see where you are, but you can feel the slope under your feet.

At each step:
1. **Feel the slope** — calculate how steep it is (this is the gradient)
2. **Step downhill** — move a small amount in the downhill direction (the learning rate controls how big your step is)
3. **Repeat** until you reach the bottom (minimum loss)

**Why it matters for AI:**
• Neural networks use gradient descent to adjust their internal weights
• The "valley" = the point where prediction errors are minimised
• Too large a step: you might overshoot the valley
• Too small a step: it takes forever to get there

*This is the fundamental engine behind all deep learning.*`,

  flashcards: `Here are **6 flashcards** created from your notes:

---
**Card 1**
Q: What is supervised learning?
A: A type of ML where a model is trained on labelled input-output pairs to predict future outputs.

---
**Card 2**
Q: Define gradient descent
A: An iterative optimisation algorithm that minimises a loss function by updating model parameters in the direction of the negative gradient.

---
**Card 3**
Q: What is overfitting?
A: When a model learns the training data too well, including noise, resulting in poor generalisation to new data.

---
**Card 4**
Q: What does 'K' represent in K-Means clustering?
A: The number of cluster centroids (groups) the algorithm will create.

---
**Card 5**
Q: What is the learning rate (α)?
A: A hyperparameter that controls the step size during gradient descent weight updates.

---
**Card 6**
Q: Difference between L1 and L2 regularisation?
A: L1 (Lasso) adds absolute weight penalty — promotes sparsity. L2 (Ridge) adds squared weight penalty — shrinks all weights.`,

  default: `I've analysed your uploaded study material. Here's what I found relevant to your question:

Based on the content in your documents, the key concepts relate to the fundamental principles discussed in Chapter 5 of your ML notes. IBM Granite AI has indexed all uploaded files and can provide detailed explanations, quizzes, summaries, and study plans for any topic.

**Would you like me to:**
• 📄 Generate a full summary of this topic?
• 📝 Create a quiz to test your knowledge?
• 📅 Build a focused study plan?
• 💡 Explain any specific concept in detail?

Just ask and I'll tailor my response to your study material!`,
};

function getAIResponse(message) {
  const m = message.toLowerCase();
  if (m.includes('summar'))   return AI_RESPONSES.summarise;
  if (m.includes('quiz') || m.includes('question')) return AI_RESPONSES.quiz;
  if (m.includes('plan') || m.includes('schedule')) return AI_RESPONSES.plan;
  if (m.includes('topic') || m.includes('focus'))   return AI_RESPONSES.topics;
  if (m.includes('explain') || m.includes('simple') || m.includes('hardest')) return AI_RESPONSES.explain;
  if (m.includes('flashcard')) return AI_RESPONSES.flashcards;
  return AI_RESPONSES.default;
}

/* ─── Textarea auto-resize ──────────────────────────────── */
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';

  const len = chatInput.value.length;
  chatSendBtn.disabled  = len === 0;
  charCount.textContent = len > 0 ? `${len}/2000` : '';
});

/* ─── Send on Enter (Shift+Enter = newline) ─────────────── */
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!chatSendBtn.disabled) sendMessage();
  }
});

chatSendBtn.addEventListener('click', sendMessage);

/* ─── Send message ──────────────────────────────────────── */
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || state.isTyping) return;

  // Hide welcome screen
  if (chatWelcome && !chatWelcome.hidden) {
    chatWelcome.style.opacity = '0';
    chatWelcome.style.transform = 'translateY(-10px)';
    chatWelcome.style.transition = 'opacity .3s ease, transform .3s ease';
    setTimeout(() => { chatWelcome.hidden = true; }, 300);
  }

  // User message
  appendMessage('user', text);
  state.messages.push({ role: 'user', text, time: now() });

  // Reset input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  chatSendBtn.disabled = true;
  charCount.textContent = '';

  // Show typing
  showTypingIndicator();

  // Simulate AI response (1.2–2.5 s)
  const delay = 1200 + Math.random() * 1300;
  setTimeout(() => {
    removeTypingIndicator();
    const response = getAIResponse(text);
    appendMessage('ai', response, ['ML_Chapter5.pdf', 'DataStructures.docx']);
    state.messages.push({ role: 'ai', text: response, time: now() });
  }, delay);
}

/* ─── Append message ────────────────────────────────────── */
function appendMessage(role, text, sources = []) {
  const wrap = document.createElement('div');
  wrap.className = `chat-msg chat-msg--${role}`;

  const avatar = role === 'user'
    ? `<div class="chat-msg__avatar" aria-hidden="true">U</div>`
    : `<div class="chat-msg__avatar" aria-hidden="true">&#129504;</div>`;

  const sourcesHtml = (role === 'ai' && sources.length)
    ? `<div class="chat-msg__sources" aria-label="Sources">
        ${sources.map(s => `<span class="source-chip">📎 ${s}</span>`).join('')}
       </div>`
    : '';

  const actionsHtml = role === 'ai'
    ? `<div class="chat-msg__actions" aria-label="Message actions">
        <button class="chat-msg__action" title="Copy" data-action="copy">📋</button>
        <button class="chat-msg__action" title="Thumbs up" data-action="like">👍</button>
        <button class="chat-msg__action" title="Thumbs down" data-action="dislike">👎</button>
       </div>`
    : '';

  wrap.innerHTML = `
    ${avatar}
    <div class="chat-msg__content">
      <div class="chat-msg__bubble">${formatMessage(text)}</div>
      ${sourcesHtml}
      ${actionsHtml}
      <span class="chat-msg__time">${now()}</span>
    </div>
  `;

  // Action button logic
  wrap.querySelectorAll('.chat-msg__action').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.action === 'copy') {
        navigator.clipboard?.writeText(text).then(() => { btn.textContent = '✓'; setTimeout(() => btn.textContent = '📋', 2000); });
      }
      if (btn.dataset.action === 'like')    btn.textContent = '✅';
      if (btn.dataset.action === 'dislike') btn.textContent = '❌';
    });
  });

  chatMessages.appendChild(wrap);
  scrollToBottom();
}

/* ─── Format message text ───────────────────────────────── */
function formatMessage(text) {
  // Bold **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Bullet points
  text = text.replace(/^•\s+(.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  // Numbered list items
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Line breaks → paragraphs
  const parts = text.split(/\n{2,}/);
  return parts.map(p => p.trim()
    ? (p.startsWith('<ul>') || p.startsWith('<li>') ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`)
    : ''
  ).join('');
}

/* ─── Typing indicator ──────────────────────────────────── */
function showTypingIndicator() {
  state.isTyping = true;
  const el = document.createElement('div');
  el.className = 'typing-indicator';
  el.id = 'typingIndicator';
  el.innerHTML = `
    <div class="typing-indicator__avatar" aria-hidden="true">&#129504;</div>
    <div class="typing-indicator__bubble" aria-label="IBM Granite AI is typing">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  chatMessages.appendChild(el);
  scrollToBottom();
}
function removeTypingIndicator() {
  state.isTyping = false;
  document.getElementById('typingIndicator')?.remove();
}

/* ─── Suggestion chips ──────────────────────────────────── */
chatSuggestions?.querySelectorAll('.suggestion-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chatInput.value = chip.dataset.prompt;
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
    chatSendBtn.disabled = false;
    chatInput.focus();
    sendMessage();
  });
});

/* ─── New Chat ──────────────────────────────────────────── */
newChatBtn?.addEventListener('click', () => {
  if (state.messages.length && !confirm('Start a new chat? Current conversation will be lost.')) return;
  clearChat();
  // Add to recent list
  if (state.messages.length) addToRecentChats('New Chat');
});

/* ─── Clear Chat ────────────────────────────────────────── */
clearChatBtn?.addEventListener('click', () => {
  if (!state.messages.length) return;
  if (confirm('Clear this conversation?')) clearChat();
});

function clearChat() {
  state.messages = [];
  // Remove all message nodes (keep welcome)
  Array.from(chatMessages.children).forEach(el => {
    if (el.id !== 'chatWelcome') el.remove();
  });
  if (chatWelcome) {
    chatWelcome.hidden = false;
    chatWelcome.style.opacity = '1';
    chatWelcome.style.transform = '';
  }
}

/* ─── Export Chat ───────────────────────────────────────── */
exportChatBtn?.addEventListener('click', () => {
  if (!state.messages.length) return;
  const text = state.messages
    .map(m => `[${m.time}] ${m.role === 'user' ? 'You' : 'Granite AI'}:\n${m.text}`)
    .join('\n\n---\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `chat-export-${Date.now()}.txt`;
  a.click();
});

/* ─── Sidebar toggle ────────────────────────────────────── */
function openSidebar() {
  chatSidebar.classList.add('sidebar--open');
  backdrop.classList.add('visible');
}
function closeSidebar() {
  chatSidebar.classList.remove('sidebar--open');
  backdrop.classList.remove('visible');
}

// Create backdrop
const backdrop = document.createElement('div');
backdrop.className = 'sidebar-backdrop';
document.body.appendChild(backdrop);

sidebarToggle?.addEventListener('click', openSidebar);
sidebarClose?.addEventListener('click', closeSidebar);
backdrop.addEventListener('click', closeSidebar);

/* ─── Recent chat switching (UI only) ───────────────────── */
recentChats?.querySelectorAll('.sidebar-chat-item').forEach(item => {
  item.addEventListener('click', () => {
    recentChats.querySelectorAll('.sidebar-chat-item').forEach(i => i.classList.remove('sidebar-chat-item--active'));
    item.classList.add('sidebar-chat-item--active');
    // Close sidebar on mobile
    if (window.innerWidth < 900) closeSidebar();
  });
});

/* ─── Add to recent chats ───────────────────────────────── */
function addToRecentChats(name) {
  const li = document.createElement('li');
  li.className = 'sidebar-chat-item';
  li.innerHTML = `
    <span class="sidebar-chat-item__icon">&#128172;</span>
    <div class="sidebar-chat-item__body">
      <span class="sidebar-chat-item__name">${name}</span>
      <span class="sidebar-chat-item__time">Just now</span>
    </div>
  `;
  recentChats?.prepend(li);
}

/* ─── Helpers ───────────────────────────────────────────── */
function scrollToBottom() {
  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}
function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
