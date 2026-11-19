document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('logo-modal');
    const modalImg = document.getElementById('logo-modal-img');
    const modalCaption = document.getElementById('logo-modal-caption');
    const closeBtn = document.getElementById('logo-modal-close');
    const iconBoxes = document.querySelectorAll('.script-icon-box');

    if (!modal || !modalImg || !closeBtn) return;

    const openModal = (src, title) => {
        modalImg.src = src;
        modalImg.alt = title;
        if (modalCaption) modalCaption.textContent = title;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    // Открытие при клике на любую иконку скрипта
    iconBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            const img = box.querySelector('.script-logo');
            if (!img) return;
            openModal(img.src, img.alt || 'Логотип скрипта');
        });
    });

    // Закрытие по крестику
    closeBtn.addEventListener('click', closeModal);

    // Закрытие по клику на тёмный фон мимо окна
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});