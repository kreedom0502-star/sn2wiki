(async () => {
  const basePath = document.body?.dataset.base || ".";

  function normalizePath() {
    let path = window.location.pathname.replace(/^\//, "");
    if (!path || path.endsWith("/")) path += "index.html";
    return decodeURIComponent(path);
  }

  function absoluteUrl(siteUrl, path) {
    return `${siteUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  function upsertMeta(selector, attributes) {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  }

  function upsertLink(rel, href) {
    let element = document.head.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement("link");
      element.setAttribute("rel", rel);
      document.head.appendChild(element);
    }
    element.setAttribute("href", href);
  }

  function injectJsonLd(id, data) {
    let element = document.head.querySelector(`#${id}`);
    if (!element) {
      element = document.createElement("script");
      element.type = "application/ld+json";
      element.id = id;
      document.head.appendChild(element);
    }
    element.textContent = JSON.stringify(data);
  }

  function breadcrumbJsonLd(siteUrl, page, pagePath) {
    const breadcrumbs = page.breadcrumbs || [];
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((name, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": name,
        "item": index === breadcrumbs.length - 1 ? absoluteUrl(siteUrl, pagePath) : absoluteUrl(siteUrl, "index.html")
      }))
    };
  }

  function pageJsonLd(site, page, pagePath) {
    const canonicalUrl = absoluteUrl(site.siteUrl, pagePath);
    const common = {
      "@context": "https://schema.org",
      "@type": page.type || "WebPage",
      "name": page.title,
      "description": page.description,
      "url": canonicalUrl,
      "inLanguage": "zh-CN",
      "isPartOf": {
        "@type": "WebSite",
        "name": site.siteName,
        "url": absoluteUrl(site.siteUrl, "index.html")
      }
    };

    if (page.type === "Article") {
      common.headline = page.title;
      common.dateModified = "2026-05-23";
      common.author = {
        "@type": "Organization",
        "name": site.siteName
      };
    }

    return common;
  }

  try {
    const response = await fetch(`${basePath}/assets/data/seo.json`, { cache: "no-store" });
    if (!response.ok) return;
    const site = await response.json();
    const pagePath = normalizePath();
    const page = site.pages[pagePath] || site.pages[pagePath.replace(/^.*?(guides\/)/, "$1")] || site.pages["index.html"];
    if (!page || !site.siteUrl) return;

    const canonicalUrl = absoluteUrl(site.siteUrl, pagePath);
    const imageUrl = absoluteUrl(site.siteUrl, site.defaultImage || "/assets/img/map-preview.svg");

    upsertLink("canonical", canonicalUrl);
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: site.siteName });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: site.defaultLocale || "zh_CN" });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: page.type === "Article" ? "article" : "website" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: page.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: page.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: page.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: page.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });

    injectJsonLd("seo-page-jsonld", pageJsonLd(site, page, pagePath));
    injectJsonLd("seo-breadcrumb-jsonld", breadcrumbJsonLd(site.siteUrl, page, pagePath));
  } catch (error) {
    // SEO metadata should never break page rendering.
  }
})();
