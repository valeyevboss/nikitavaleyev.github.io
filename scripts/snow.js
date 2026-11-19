document.addEventListener('DOMContentLoaded', () => {
    // Если пользователь включил уменьшение анимаций в системе — снег не запускаем
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const layer = document.createElement('div');
    layer.className = 'snow-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    const isMobile = window.innerWidth <= 768;
    const flakeCount = isMobile ? 28 : 55;

    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('span');
        flake.className = 'snowflake';

        const size = randomBetween(3, isMobile ? 6.5 : 8.5);
        const startX = randomBetween(0, 100);
        const fallDuration = randomBetween(8, 18);
        const swayDuration = randomBetween(3, 6.5);
        const fallDelay = randomBetween(-18, 0); // Стартуют уже в разных точках экрана
        const swayDelay = randomBetween(-6, 0);
        const opacity = randomBetween(0.25, 0.85);
        const swayRange = randomBetween(8, 24);

        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.left = `${startX}%`;
        flake.style.opacity = opacity.toFixed(2);
        flake.style.setProperty('--sway', `${swayRange}px`);
        flake.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
        flake.style.animationDelay = `${fallDelay}s, ${swayDelay}s`;

        layer.appendChild(flake);
    }
});