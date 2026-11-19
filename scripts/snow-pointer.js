document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || document.getElementById('snow-pointer-canvas')) {
        return;
    }

    const config = {
        maxParticles: 420,
        moveSpawnChance: 0.55,
        moveMinCount: 1,
        moveMaxCount: 2,
        clickCount: 22,
        // Шанс, что при клике волна окажется большой (например, 0.25 = 25%)
        bigWaveChance: 0.25,
        bigWaveMultiplier: 2.3,
        bigWaveCount: 75,
        gravity: 0.045,
        drag: 0.982,
        fadeSpeed: 0.018,
        minSize: 1.8,
        maxSize: 5.2
    };

    const canvas = document.createElement('canvas');
    canvas.id = 'snow-pointer-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    Object.assign(canvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '95',
        pointerEvents: 'none'
    });

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const waves = [];
    let lastMoveTime = 0;

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function spawnParticle(x, y, vx, vy, size, alpha, decayScale = 1) {
        if (particles.length >= config.maxParticles) {
            particles.shift();
        }

        particles.push({
            x,
            y,
            vx,
            vy,
            size,
            alpha,
            decay: config.fadeSpeed * rand(0.75, 1.35) * decayScale
        });
    }

    function spawnWave(x, y, isBig) {
        waves.push({
            x,
            y,
            radius: 4,
            maxRadius: isBig ? 175 : 75,
            speed: isBig ? 8.2 : 4.2,
            lineWidth: isBig ? 2.6 : 1.5,
            alpha: isBig ? 0.8 : 0.45
        });
    }

    function spawnTrail(x, y) {
        const count = Math.floor(rand(config.moveMinCount, config.moveMaxCount + 1));
        for (let i = 0; i < count; i++) {
            const angle = rand(0, Math.PI * 2);
            const speed = rand(0.35, 1.45);
            spawnParticle(
                x + rand(-6, 6),
                y + rand(-6, 6),
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 0.2,
                rand(config.minSize, config.maxSize * 0.72),
                rand(0.45, 0.85)
            );
        }
    }

    function spawnBurst(x, y) {
        const isBig = Math.random() < config.bigWaveChance;
        const count = isBig ? config.bigWaveCount : config.clickCount;
        const power = isBig ? config.bigWaveMultiplier : 1;

        spawnWave(x, y, isBig);

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + rand(-0.25, 0.25);
            const speed = rand(1.6, 5.4) * power * rand(0.75, 1.25);
            spawnParticle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - rand(0.4, 1.4) * (isBig ? 1.5 : 1),
                rand(config.minSize + 0.5, config.maxSize) * (isBig ? 1.15 : 1),
                rand(0.65, 1),
                isBig ? 0.85 : 1
            );
        }
    }

    window.addEventListener(
        'pointermove',
        (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') {
                return;
            }
            const now = performance.now();
            if (now - lastMoveTime < 18) {
                return;
            }
            lastMoveTime = now;

            if (Math.random() <= config.moveSpawnChance) {
                spawnTrail(event.clientX, event.clientY);
            }
        },
        { passive: true }
    );

    window.addEventListener(
        'pointerdown',
        (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') {
                return;
            }
            spawnBurst(event.clientX, event.clientY);
        },
        { passive: true }
    );

    function updateAndDraw() {
        ctx.clearRect(0, 0, width, height);

        // Расширяющаяся волна при клике
        for (let i = waves.length - 1; i >= 0; i--) {
            const w = waves[i];
            w.radius += w.speed;
            w.speed *= 0.94;
            w.alpha -= 0.022;

            if (w.alpha <= 0 || w.radius >= w.maxRadius) {
                waves.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, w.alpha);
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
            ctx.lineWidth = w.lineWidth;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.vx *= config.drag;
            p.vy = p.vy * config.drag + config.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (
                p.alpha <= 0 ||
                p.x < -40 ||
                p.x > width + 40 ||
                p.y > height + 40
            ) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = '#f8fafc';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
        }

        requestAnimationFrame(updateAndDraw);
    }

    requestAnimationFrame(updateAndDraw);
});