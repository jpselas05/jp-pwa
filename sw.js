// Evento disparado quando o push chega
self.addEventListener("push", (event) => {
    if (!event.data) return;

    const data = event.data.json();
    console.log("📬 Notificação recebida:", data);

    // Monta as opções da notificação
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        image: data.image || undefined, // imagem grande (opcional)
        data: data.data || {},
        vibrate: [100, 50, 100],
        // Ações (botões abaixo da notificação)
        actions: [
            { action: "abrir", title: "Abrir", icon: data.icon },
            { action: "fechar", title: "Fechar" }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Evento disparado ao clicar na notificação
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "fechar") return;

    // Abre o link enviado no payload (ou o index.html se não tiver)
    const destino = event.notification.data.url || "index.html";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // Se já houver uma aba aberta do app, foca nela
            for (const client of clientList) {
                if (client.url.includes(destino) && "focus" in client) {
                    return client.focus();
                }
            }
            // Senão, abre uma nova aba
            if (clients.openWindow) {
                return clients.openWindow(destino);
            }
        })
    );
});
