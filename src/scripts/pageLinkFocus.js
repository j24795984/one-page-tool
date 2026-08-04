/**
 * linkHighlight()
 * --------------------------------------------------------
 * 使用 URL API 判斷目前頁面，為符合的連結加上 active class。
 * @param {string | string[]} selectors
 */
function linkHighlight(selectors) {
  const currentUrl = new URL(window.location.href);

  const getSegments = (urlObj) =>
    urlObj.pathname.split('/').filter(s => s.length > 0 && s !== 'index.php');

  const currentSegments = getSegments(currentUrl);
  const currentHash = currentUrl.hash;

  const list = Array.isArray(selectors) ? selectors.join(',') : selectors;
  const links = document.querySelectorAll(list);

  const isPrefixOf = (a, b) => {
    if (a.length > b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  let baseLen = Infinity;
  links.forEach(a => {
    const rawHref = (a.getAttribute('href') || '').trim();
    if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) return;
    const linkUrl = new URL(a.href, window.location.origin);
    if (linkUrl.origin === currentUrl.origin) {
      const segs = getSegments(linkUrl);
      if (segs.length < baseLen) baseLen = segs.length;
    }
  });
  if (baseLen === Infinity) baseLen = 0;

  links.forEach((a) => {
    a.classList.remove('active');

    const rawHref = (a.getAttribute('href') || '').trim();
    if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) return;

    const linkUrl = new URL(a.href, window.location.origin);
    if (linkUrl.origin !== currentUrl.origin) return;

    const linkSegments = getSegments(linkUrl);
    const linkHash = linkUrl.hash;
    const hashOK = (!linkHash || linkHash === currentHash);
    const isHomeLink = linkSegments.length === baseLen;

    if (isHomeLink) {
      if (currentSegments.length === baseLen && hashOK) {
        a.classList.add('active');
      }
      return;
    }

    const newsIdx = linkSegments.indexOf('news');
    const isNewsEntryLink = (newsIdx !== -1 && linkSegments[newsIdx + 1] === 'category');
    const isInNewsSeries = (newsIdx !== -1 && currentSegments[newsIdx] === 'news');

    if (isNewsEntryLink && isInNewsSeries) {
      if (hashOK) a.classList.add('active');
      return;
    }

    if (isPrefixOf(linkSegments, currentSegments) && hashOK) {
      a.classList.add('active');
    }
  });
}

export { linkHighlight };
