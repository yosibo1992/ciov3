export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const country = request.headers.get("cf-ipcountry") || "XX";
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
  const isGooglebot = /googlebot|mediapartners|adsbot|google-inspectiontool|storebot-google|googleweblight/i.test(userAgent);

  // ███████ SADECE BURALARI DEĞİŞTİR ███████
  const eskiDomain = "betcio-resmigir.pages.dev";   // ← senin pages.dev adresin
  const yeniDomain = "betcio-resmigir.pagesdev.us";         // ← custom domainin (www'suz yaz)
  // █████████████████████████████████████████

  const host = url.hostname;

  // Googlebot her şeyi olduğu gibi görsün (hiç dokunmayalım)
  if (isGooglebot) return context.next();

  // 1) pages.dev’e Türkiye’den gelenler → 301 ile yeni domain’e
  if (country === "TR" && host === eskiDomain) {
    return Response.redirect(`https://${yeniDomain}${url.pathname}${url.search}`, 301);
  }

  // 2) Yeni domaindeyiz (www olsun olmasın aynı şeyi yapsın)
  if (host === yeniDomain) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      if (country === "TR") {
        // Türkiye → tr.html göster
        return Response.redirect(`${url.origin}/tr.html`, 302);
      } else {
        // Google veya yabancı → index2.html göster (linkleri düzeltilmiş)
        return Response.redirect(`${url.origin}/index2.html`, 302);
      }
    }
  }

  // Diğer her şey normal devam etsin
  return context.next();
}
