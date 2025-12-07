export async function onRequest({ request }) {
  const url = new URL(request.url);
  const country = request.headers.get("cf-ipcountry") || "XX";
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  const isGoogle = /googlebot|mediapartners|adsbot|google-inspectiontool|storebot|googleweblight/i.test(ua);

  // ███ BURAYA SADECE KENDİ DOMAINLERİNİ YAZ ███
  const eski = "betcio-resmigir.pages.dev";     // ← senin pages.dev
  const yeni = "betcio-resmigir.pagesdev.us";           // ← custom domain (BTK’sız)
  // █████████████████████████████████████████

  const host = url.hostname;

  // 1) Google botu → hiçbir şeye dokunma, her şey eski gibi kalsın
  if (isGoogle) return fetch(request);

  // 2) Türkiye’den pages.dev’e gelenler → 301 ile custom domain’e at
  if (country === "TR" && host === eski) {
    return Response.redirect(`https://${yeni}${url.pathname}${url.search}`, 301);
  }

  // 3) Custom domain’deyiz → Türkiye ise tr.html, Google/yabancı ise index2.html
  if (host === yeni) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const hedef = country === "TR" ? "/tr.html" : "/index2.html";
      return Response.redirect(url.origin + hedef, 302);
    }
  }

  // Diğer her şey normal devam etsin
  return fetch(request);
}
