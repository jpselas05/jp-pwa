// sw.js — versão 100% compatível com iOS Safari (PWA)

self.addEventListener("push", event => {
    if (!event.data) return;
    const data = event.data.json();
    const n = data.notification || data; // garante compatibilidade com o payload do backend

    // iOS ignora ícones, badge, image e actions → só usamos title, body, data e tag
    const title = n.title || "Notificação";
    const body = n.body || "";
    const tag = n.tag || "geral";
    const payload = n.data || {};

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            tag,
            data: payload
        })
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    const tipo = event.notification.data?.tipo;
    let destino = "/";

    if (tipo === "entrada") destino = "/historico?tipo=entrada";
    if (tipo === "saida") destino = "/historico?tipo=saida";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientes => {
            for (const c of clientes) {
                if (c.url.includes("jpselas05.github.io")) {
                    c.focus();
                    c.navigate(destino);
                    return;
                }
            }
            clients.openWindow(destino);
        })
    );
});
