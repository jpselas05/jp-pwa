self.addEventListener("push", (event) => {
    const data = event.data.json();
    console.log("📬 Notificação recebida:", data);

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "https://upload.wikimedia.org/wikipedia/commons/3/38/Emoji_u1f680.svg"
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("index.html"));
});
