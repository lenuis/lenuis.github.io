/* Cubimi 1.0 (229) Commercial Launch Config
 * Fill in your live URLs below when Mac App Store / Paddle goes live.
 * No HTML rebuild required — edit this single file and deploy website/dist/.
 */
window.CUBIMI_LAUNCH = {
  version: "1.0",
  build: "229",
  // Keep false during initial Mac App Store review; flip to true after approval to enable Direct/Paddle sales.
  showDirectCard: false,
  // 1) Paste your live Mac App Store URL once Apple approves build 229:
  //    e.g. "https://apps.apple.com/app/cubimi/idXXXXXXXXXX"
  appStoreUrl: "",
  // 2) Paste your Paddle or Lemon Squeezy checkout URL for Direct License ($14.99 launch / $19.99 regular):
  //    e.g. "https://buy.paddle.com/checkout/..." or "https://ideapark.lemonsqueezy.com/buy/..."
  directCheckoutUrl: "",
  // 3) Paste your notarized .dmg direct download URL (Cloudflare R2 / GitHub Releases):
  //    e.g. "https://downloads.cubimi.app/Cubimi-1.0-229-macOS.dmg"
  directDownloadUrl: "",
  supportEmail: "ideaparklenuis@gmail.com"
};

(() => {
  "use strict";
  const cfg = window.CUBIMI_LAUNCH || {};

  const copy = {
    zh: {
      kicker: "买断制，无订阅套路",
      heading: "一次购买，永久拥有。",
      sub: "支持 Mac App Store 与官网直售两种渠道。Apple Silicon / macOS 14+ 原生运行，20 种语言随系统切换。",
      masBadge: "推荐 · 苹果官方托管",
      masTitle: "Mac App Store 版",
      masPrice: "¥68",
      masOrig: "原价 ¥98 · 首发早鸟价",
      masDesc: "Apple 官方安全沙盒分发，支持家人共享与多台本人 Mac 自动同步更新。",
      masPoints: [
        "一次买断，终身使用 1.x 全部更新",
        "Apple 官方支付与自动更新，最省心",
        "20 种界面语言 + 本地文件零上传"
      ],
      masBtnLive: "前往 Mac App Store 购买 ↗",
      masBtnSoon: "Mac App Store 审核发布中 · 预约通知",
      dirBadge: "支持 14 天免费试用",
      dirTitle: "官网直售版（独立授权）",
      dirPrice: "$14.99",
      dirOrig: "原价 $19.99 · Paddle / 信用卡 / PayPal",
      dirDesc: "先下载 14 天全功能免费试用，满意后再用授权码永久激活（最多 3 台个人 Mac）。",
      dirPoints: [
        "14 天无限制免费试用，零风险体验",
        "支持 Visa / Mastercard / Apple Pay / PayPal",
        "支持自定义本地 AI 模型与完整工作流"
      ],
      dirBtnBuy: "购买永久授权 ($14.99) ↗",
      dirBtnTry: "下载 14 天免费试用版 (.dmg)",
      dirBtnSoon: "预约官网直售首发通知"
    },
    en: {
      kicker: "One-time purchase, zero subscription",
      heading: "Pay once. Own it forever.",
      sub: "Available via Mac App Store or Direct Website License. Native on Apple Silicon / macOS 14+ in 20 languages.",
      masBadge: "Recommended · Official Store",
      masTitle: "Mac App Store",
      masPrice: "$14.99",
      masOrig: "Launch price (Regular $19.99)",
      masDesc: "Sandboxed Apple distribution with Family Sharing and automatic updates across all your Macs.",
      masPoints: [
        "One-time purchase — all 1.x updates included",
        "Instant Apple checkout & automatic updates",
        "20 interface languages, 100% local-first privacy"
      ],
      masBtnLive: "Buy on Mac App Store ↗",
      masBtnSoon: "In App Store Review · Notify Me",
      dirBadge: "14-Day Free Trial",
      dirTitle: "Direct License",
      dirPrice: "$14.99",
      dirOrig: "Launch price (Regular $19.99) · Paddle",
      dirDesc: "Try Cubimi free for 14 days with zero card required. Unlock forever with a license key (up to 3 Macs).",
      dirPoints: [
        "Full-featured 14-day free trial before paying",
        "Visa / Mastercard / Apple Pay / PayPal",
        "Offline-capable license key + local AI models"
      ],
      dirBtnBuy: "Buy Lifetime License ($14.99) ↗",
      dirBtnTry: "Download 14-Day Free Trial (.dmg)",
      dirBtnSoon: "Notify Me on Direct Launch"
    }
  };

  function isChinese() {
    return (document.documentElement.lang || "").toLowerCase().startsWith("zh");
  }

  function mailtoNotify(channel) {
    const subject = encodeURIComponent(`Cubimi 1.0 Launch Notify (${channel})`);
    const body = encodeURIComponent("Hi ideapark, please notify me as soon as Cubimi 1.0 is live!");
    return `mailto:${cfg.supportEmail || "ideaparklenuis@gmail.com"}?subject=${subject}&body=${body}`;
  }

  function renderPricingSection() {
    const host = document.getElementById("pricing");
    if (!host) return;
    const t = isChinese() ? copy.zh : copy.en;
    const masUrl = (cfg.appStoreUrl || "").trim();
    const dirUrl = (cfg.directCheckoutUrl || "").trim();
    const dmgUrl = (cfg.directDownloadUrl || "").trim();

    const masHref = masUrl || mailtoNotify("Mac App Store");
    const masTarget = masUrl ? ' target="_blank" rel="noopener noreferrer"' : "";
    const masLabel = masUrl ? t.masBtnLive : t.masBtnSoon;

    const dirHref = dirUrl || mailtoNotify("Direct License");
    const dirTarget = dirUrl ? ' target="_blank" rel="noopener noreferrer"' : "";
    const dirLabel = dirUrl ? t.dirBtnBuy : t.dirBtnSoon;

    const tryHtml = dmgUrl
      ? `<a class="button button-secondary" href="${dmgUrl}">${t.dirBtnTry}</a>`
      : "";

    const directCardHtml = cfg.showDirectCard ? `
          <article class="pricing-card">
            <span class="pricing-badge">${t.dirBadge}</span>
            <h3>${t.dirTitle}</h3>
            <div class="pricing-amount"><strong>${t.dirPrice}</strong><span>${t.dirOrig}</span></div>
            <p class="pricing-desc">${t.dirDesc}</p>
            <ul class="pricing-points">${t.dirPoints.map((x) => `<li>${x}</li>`).join("")}</ul>
            <div class="pricing-actions">
              <a class="button button-primary" href="${dirHref}"${dirTarget}>${dirLabel}</a>
              ${tryHtml}
            </div>
          </article>` : "";

    host.innerHTML = `
      <div class="shell">
        <div class="section-head">
          <div><p class="kicker">${t.kicker}</p><h2>${t.heading}</h2></div>
          <p>${t.sub}</p>
        </div>
        <div class="pricing-grid" style="${cfg.showDirectCard ? "" : "grid-template-columns:minmax(0,560px)"}">
          <article class="pricing-card featured">
            <span class="pricing-badge">${t.masBadge}</span>
            <h3>${t.masTitle}</h3>
            <div class="pricing-amount"><strong>${t.masPrice}</strong><span>${t.masOrig}</span></div>
            <p class="pricing-desc">${t.masDesc}</p>
            <ul class="pricing-points">${t.masPoints.map((x) => `<li>${x}</li>`).join("")}</ul>
            <div class="pricing-actions">
              <a class="button button-primary" href="${masHref}"${masTarget}>${masLabel}</a>
            </div>
          </article>${directCardHtml}
        </div>
      </div>
    `;

    document.querySelectorAll("[data-cubimi-primary-cta]").forEach((btn) => {
      if (masUrl) {
        btn.setAttribute("href", masUrl);
        btn.setAttribute("target", "_blank");
        btn.setAttribute("rel", "noopener noreferrer");
      } else {
        btn.setAttribute("href", "#pricing");
        btn.removeAttribute("target");
      }
      btn.removeAttribute("aria-disabled");
      btn.removeAttribute("tabindex");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderPricingSection();
    const observer = new MutationObserver(renderPricingSection);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  });
})();
