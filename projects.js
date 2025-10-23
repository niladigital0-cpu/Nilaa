// Fetch projects.json and render project cards
(function () {
  // No embedded fallback: projects must be loaded from `projects.json` via fetch.

  async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    try {
      const res = await fetch('projects.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('No se pudo cargar projects.json');
      const projects = await res.json();
      renderProjects(projects);
    } catch (err) {
      console.error('No se pudo cargar projects.json:', err);
      // Inform the user visually that fetch failed and that a local server is required
      if (grid) {
        const note = document.createElement('div');
        note.style.color = '#f1d387';
        note.style.marginTop = '12px';
        note.style.fontWeight = '700';
        note.textContent = 'Error: no se pudo cargar projects.json. Asegúrate de servir el sitio con un servidor local (por ejemplo: python -m http.server 8000) para que fetch funcione correctamente.';
        grid.parentElement.appendChild(note);
      }
      return;
    }
  }

  function createCard(p) {
    // Use a button-like card that opens the modal
    const card = document.createElement('button');
    card.className = 'project-card';
    card.type = 'button';
    card.setAttribute('data-project-id', p.id);
    card.setAttribute('aria-labelledby', p.id + '-title');

    const img = document.createElement('img');
    img.className = 'project-media';
    img.src = p.thumbnail || '';
    img.alt = p.title + ' — miniatura';

    const content = document.createElement('div');
    content.className = 'project-content';

    const h3 = document.createElement('div');
    h3.className = 'project-title';
    h3.id = p.id + '-title';
    h3.textContent = p.title || 'Proyecto';

    const desc = document.createElement('div');
    desc.className = 'project-desc';
    desc.textContent = p.description || '';

    const cta = document.createElement('span');
    cta.className = 'project-cta';
    cta.textContent = 'Abrir';

    content.appendChild(h3);
    content.appendChild(desc);
    content.appendChild(cta);

    card.appendChild(img);
    card.appendChild(content);

    // open modal on click
    card.addEventListener('click', () => openModal(p));

    return card;
  }

  // Modal controls
  const modal = {
    el: null,
    img: null,
    title: null,
    desc: null,
    openLink: null,
    closeBtn: null,
    backdrop: null,
  };

  function ensureModal() {
    if (modal.el) return;
    modal.el = document.getElementById('projectModal');
    if (!modal.el) return;
    modal.img = modal.el.querySelector('.modal-media');
    modal.title = modal.el.querySelector('.modal-title');
    modal.desc = modal.el.querySelector('.modal-desc');
    modal.openLink = modal.el.querySelector('.modal-open');
    modal.closeBtn = modal.el.querySelector('.modal-close');
    modal.backdrop = modal.el.querySelector('[data-dismiss="modal"]');

    modal.closeBtn.addEventListener('click', closeModal);
    modal.backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  function openModal(p) {
    ensureModal();
    if (!modal.el) return;
    modal.img.src = p.thumbnail || '';
    modal.img.alt = p.title || '';
    modal.title.textContent = p.title || '';
    modal.desc.textContent = p.description || '';
    modal.openLink.href = p.url || '#';
    modal.el.setAttribute('aria-hidden', 'false');
    modal.el.style.display = 'flex';
    // set focus to close button for accessibility
    modal.closeBtn.focus();
  }

  function closeModal() {
    if (!modal.el) return;
    modal.el.setAttribute('aria-hidden', 'true');
    modal.el.style.display = 'none';
  }

  function renderProjects(list) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(project => {
      const node = createCard(project);
      grid.appendChild(node);
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', loadProjects);
})();
