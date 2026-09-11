// Eenvoudige service worker voor Pokerklok.
// Cachet de pagina en icoontjes zodat de app ook zonder internetverbinding start.
 
const CACHE_NAME = "pokerklok-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-192-maskable.png",
  "./icon-512-maskable.png"
];
 
// Bij installatie: alle bestanden alvast in de cache zetten.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});
 
// Bij activatie: oude cache-versies opruimen (belangrijk bij toekomstige updates).
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});
 
// Bij elk verzoek: eerst uit de cache proberen, anders naar het netwerk.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          // Geen netwerk en niet in cache: val terug op de hoofdpagina.
          return caches.match("./index.html");
        })
      );
    })
  );
});
 
