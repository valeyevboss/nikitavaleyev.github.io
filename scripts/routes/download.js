document.addEventListener('DOMContentLoaded', () => {
    const linksById = {
        // —качивание
        'download-army': 'https://github.com/valeyevboss/pixel-army-helper/releases/download/v1.0.0/Pixel.Army.Helper.v1.0.0.rar',
        'download-fisher': 'https://github.com/valeyevboss/pixel-fisher-helper/releases/download/v1.0.0/Pixel.Fisher.Helper.v1.0.0.rar',
        'download-members': 'https://github.com/valeyevboss/pixel-members-helper/releases/download/v1.0.0/Pixel.Members.Helper.v1.0.0.rar',
        'download-xyz': 'https://github.com/valeyevboss/pixel-xyz-helper/releases/download/v1.0.0/Pixel.XYZ.Helper.v1.0.0.rar',
        'download-screen': 'https://github.com/valeyevboss/pixel-screen-helper/releases/download/v1.0.0/Pixel.Screen.Helper.v1.0.0.rar',
        'download-taxi': 'https://github.com/valeyevboss/pixel-taxi-helper/releases/download/v1.0.0/Pixel.Taxi.Helper.v1.0.0.rar',

        // ќбзор
        'info-army': 'https://github.com/valeyevboss/pixel-army-helper',
        'info-fisher': 'https://github.com/valeyevboss/pixel-fisher-helper',
        'info-members': 'https://github.com/valeyevboss/pixel-members-helper',
        'info-xyz': 'https://github.com/valeyevboss/pixel-xyz-helper',
        'info-screen': 'https://github.com/valeyevboss/pixel-screen-helper',
        'info-taxi': 'https://github.com/valeyevboss/pixel-taxi-helper',
    };

    Object.entries(linksById).forEach(([id, url]) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.setAttribute('href', url);

        // ≈сли это внешн€€ ссылка Ч открываем в новой вкладке
        if (url.startsWith('http')) {
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
        }
    });
});