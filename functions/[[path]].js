// functions/[[path]].js  ← aynı dosya
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const country = request.headers.get('cf-ipcountry') || 'XX';
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  const eski = "betcio-resmigir.pages.dev";
  const yeni = "betcio-resmigir.pagesdev.us";

  const host = url.hostname;

  // Sadece ana sayfa için çalışsın
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  // Googlebot → HİÇBİR ZAMAN 301 GÖRMESİN
  const isGoogle = /googlebot|mediapartners|adsbot|google-inspectiontool|storebot|googleweblight|googleother/i.test(ua);
  if (isGoogle) {
    return context.next(); // Google her zaman pages.dev’de index.html görsün
  }

  // Türkiye’den gelen → 301 ile yeni domaine
  if (country === 'TR' && host === eski) {
    return Response.redirect(`https://${yeni}${url.pathname}${url.search}`, 301);
  }

  // Yeni domain’de Türkiye → tr.html
  if (country === 'TR' && (host === yeni || host === 'www.' + yeni)) {
    return Response.redirect(`${url.origin}/tr.html`, 302);
  }

  // YENİ DOMAIN’DE GOOGLE DIŞINDAKİ HERKES → index.html görsün (yeni domain sıralamaya girmesin)
  return context.next();
}
