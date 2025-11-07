// Recebe a mensagem "push" enviada pelo servidor Node
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Notificação", body: "Sem conteúdo" };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "icons/icon-192.png",   // coloca teus ícones
      badge: "icons/icon-192.png",
      data: data.data || {}
    })
  );
});

// (opcional) clique na notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = "/"; // para onde abrir teu app
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.includes(url)) return c.focus();
    return clients.openWindow(url);
  }));
});
