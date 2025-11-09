self.addEventListener("push", (event) => {
    if (!event.data) return;
    const data = event.data.json();

    // Define ícone local conforme tipo
    let icon = "icons/vision_icon.jpg"; // padrão
    if (data.title?.includes("entrada") || data.body?.includes("entrada")) {
        icon = "icons/entrada_icon.png";
    } else if (data.title?.includes("saída") || data.body?.includes("saída") || data.title?.includes("saida")) {
        icon = "icons/saida_icon.png";
    }

    const options = {
        body: data.body,
        icon: icon,
        badge: icon,
        image: data.image || undefined,
        data: data.data || {},
        vibrate: [120, 60, 120],
        actions: [
            { action: "abrir", title: "Abrir", icon },
            { action: "fechar", title: "Fechar" }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    if (event.action === "fechar") return;

    const destino = event.notification.data.url || "index.html";
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(destino) && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(destino);
        })
    );
});
