// sw.js — versão 100% compatível com iOS Safari (PWA)

self.addEventListener("push", event => {
    if (!event.data) return;

    const data = event.data.json();
    console.log("📥 Push recebido:", data);

    // O backend envia: { notification: { title, body, tag, data } }
    const n = data.notification || data;

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

    // Monta URL com filtro (query param)
    let destino = "/";
    if (tipo === "entrada") destino = "/?filter=entrada";
    if (tipo === "saida") destino = "/?filter=saida";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientes => {
            // Se já tem uma janela aberta, foca nela
            for (const c of clientes) {
                if (c.url.includes("jpselas05.github.io") || c.url.includes("localhost")) {
                    c.focus();
                    c.postMessage({ action: 'filter', tipo }); // Envia mensagem para filtrar
                    return;
                }
            }
            // Se não tem janela aberta, abre uma nova
            clients.openWindow(destino);
        })
    );
});