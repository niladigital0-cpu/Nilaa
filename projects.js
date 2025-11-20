
(function () {

    async function loadProjects() {
        const grid = document.getElementById('projectsGrid');
        try {
            const res = await fetch('projects.json', { cache: 'no-cache' });
            if (!res.ok) throw new Error('No se pudo cargar projects.json');
            const projects = await res.json();
            renderProjects(projects);
        } catch (err) {
            console.error('No se pudo cargar projects.json:', err);
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

    
    let activeProjectId = null;

    function createCard(p) {
        const card = document.createElement('button');
        card.className = 'project-card';
        card.type = 'button';
        card.setAttribute('data-project-id', p.id);
        card.setAttribute('aria-labelledby', p.id + '-title');

        // Contenedor imagenes
        const imgContainer = document.createElement('div');
        imgContainer.className = 'project-media-container';

        // Vista inicial
        const img1 = document.createElement('img');
        img1.className = 'project-media imagen-1';
        img1.id = `img1-${p.id}`; // Añadimos ID para fácil referencia
        img1.src = p.thumbnail || '';
        img1.alt = p.title + ' — miniatura';

        // IMAGEN 2
        const img2 = document.createElement('img');
        img2.className = 'project-media imagen-2';
        img2.id = `img2-${p.id}`; 
        img2.src = p.fullImage || p.thumbnail || '';
        img2.alt = p.title + ' — abierta';
        img2.style.display = 'none';

        imgContainer.appendChild(img1);
        imgContainer.appendChild(img2);

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

        card.appendChild(imgContainer);
        card.appendChild(content);

        // open modal on click
        card.addEventListener('click', () => {
            img1.style.display = 'none';
            img2.style.display = 'block';
            cta.textContent = 'Ver Modal';
            openModal(p);
        });

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

        // Establecer el ID del proyecto activo antes de abrir modal
        activeProjectId = p.id;
        
        // El modal prioriza p.fullImage
        modal.img.src = p.fullImage || p.thumbnail || ''; 
        
        modal.img.alt = p.title || '';
        modal.title.textContent = p.title || '';
        modal.desc.textContent = p.description || '';
        modal.openLink.href = p.url || '#';
        modal.el.setAttribute('aria-hidden', 'false');
        modal.el.style.display = 'flex';
        modal.closeBtn.focus();
    }

    function closeModal() {
        if (!modal.el) return;
        modal.el.setAttribute('aria-hidden', 'true');
        modal.el.style.display = 'none';

        //regresar la tarjeta al estado inicial
        if (activeProjectId) {
            const card = document.querySelector(`[data-project-id="${activeProjectId}"]`);
            if (card) {
                // Selecciona la imagen 1 y 2 por sus IDs
                const img1 = card.querySelector(`#img1-${activeProjectId}`);
                const img2 = card.querySelector(`#img2-${activeProjectId}`);
                const cta = card.querySelector('.project-cta');

                if (img1 && img2) {
                    img1.style.display = 'block';
                    img2.style.display = 'none';
                    if (cta) cta.textContent = 'Abrir';
                }
            }
        }
        // Limpiar el ID activo
        activeProjectId = null;
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