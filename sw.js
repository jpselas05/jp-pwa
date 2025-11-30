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
    const hash = payload.hash;

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            tag,
            data: payload, // Aqui vai o hash da transação
            icon: '/icons/vision_icon.png',
            badge: '/icons/vision_icon.png'
        })
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    const hash = event.notification.data?.hash;

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientes => {
            // Primeiro tenta focar em uma janela já aberta
            for (const c of clientes) {
                if (c.url.includes("jpselas05.github.io") || c.url.includes("localhost")) {
                    c.focus();
                    
                    // Envia mensagem para abrir o modal com o hash
                    if (hash) {
                        c.postMessage({
                            type: "OPEN_TRANSACTION_MODAL",
                            hash: hash
                        });
                    }
                    
                    return;
                }
            }
            
            // Se não encontrou janela aberta, abre uma nova com o hash na URL
            const urlToOpen = hash 
                ? `${self.registration.scope}?tx=${hash}`
                : self.registration.scope;
            
            return clients.openWindow(urlToOpen);
        })
    );
});