export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const country = request.headers.get('cf-ipcountry') || 'XX';

  // DEĞİŞTİR BURAYI
  const eskiDomain = "betcio-resmigir.pages.dev";        // ← pages.dev
  const yeniDomain = "betcio-resmigir.pagesdev.us";      // ← custom domain
  // BİTİŞ

  const host = url.hostname;

  // Sadece ana sayfa için çalışsın
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  // Googlebot kontrolü (düzeltilen yer burası)
  const isGoogle = /googlebot|mediapartners|adsbot|google-inspectiontool|storebot|googleweblight|googleother/i.test(userAgent);
  if (isGoogle) {
    if (host === yeniDomain || host === 'www.' + yeniDomain) {
      return Response.redirect(`${url.origin}/index2.html`, 302); // Google yeni domain → index2.html
    }
    return context.next(); // Google pages.dev → index.html (sıralama korur)
  }

  // Türkiye → pages.dev’den yeni domain’e 301
  if (country === 'TR' && host === eskiDomain) {
    return Response.redirect(`https://${yeniDomain}${url.pathname}${url.search}`, 301);
  }

  // Yeni domain’de Türkiye → tr.html, diğerleri → index2.html
  if (host === yeniDomain || host === 'www.' + yeniDomain) {
    if (country === 'TR') {
      return Response.redirect(`${url.origin}/tr.html`, 302);
    } else {
      return Response.redirect(`${url.origin}/index2.html`, 302);
    }
  }

  return context.next();
}
