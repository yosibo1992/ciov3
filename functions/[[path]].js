export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const country = request.headers.get('cf-ipcountry') || 'XX';

  // DEĞİŞTİR BURAYI
  const eskiDomain = "betcio-resmigir.pages.dev";   // ← senin pages.dev adresin
  const yeniDomain = "betcio-resmigir.pagesdev.us";         // ← custom domainin
  // BİTİŞ

  const host = url.hostname;

  // Sadece ana sayfa ve index.html için çalışsın (senin istediğin gibi)
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  // Googlebot kontrolü
  const isGooglebot = /googlebot|mediapartners-google|adsbot-google|google-inspectiontool|googleweblight/i.test(userAgent);
  if (isGooglebot) {
    return context.next(); // index.html dönsün (SEO için)
  }

  // pages.dev'e Türkiye’den gelenleri custom domain'e 301 at
  if (country === 'TR' && host === eskiDomain) {
    const redirectUrl = `https://${yeniDomain}${url.pathname}${url.search}`;
    return Response.redirect(redirectUrl, 301);
  }

  if (host === yeniDomain || host === 'www.' + yeniDomain) {
      if (country === 'TR') {
        return Response.redirect(`${url.origin}/tr.html`, 302);
      } else {
        return Response.redirect(`${url.origin}/index2.html`, 302);
      }
    }

  // Diğer herkes → normal index.html
  return context.next();
}
