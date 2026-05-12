// Meta Pixel + banner cookies cohérent avec la politique de confidentialité
// jerwis.fr · pixel "C'est la bonne" (2078593352880934)
//
// Comportement :
//  - 1re visite : banner cookies en bas. Tant qu'aucun choix → pixel désactivé.
//  - "Accepter" → localStorage("jerwis-consent")="accepted" + init fbq + PageView
//  - "Refuser"  → localStorage("jerwis-consent")="declined", aucun pixel n'est chargé
//  - Visite suivante avec accepted → init direct, pas de banner
//
// Pour révoquer le consentement plus tard : localStorage.removeItem("jerwis-consent"), reload.
//
// Tracking enrichi disponible via window.jerwisTrack(eventName, params, options).
// Ex sur la page merci : jerwisTrack("Purchase", {value:39, currency:"EUR", content_ids:["genpics-source-code"], content_type:"product"}, {eventID: stripeSessionId});

(function () {
  "use strict";
  var PIXEL_ID = "2078593352880934";
  var CONSENT_KEY = "jerwis-consent";

  function loadPixel() {
    if (window.fbq) return;
    // Snippet officiel Meta, modernisé sans eval ni doc.write
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  // Helper exposé pour tracker d'autres events (Purchase, ViewContent, Lead, etc.)
  window.jerwisTrack = function (eventName, params, options) {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return;
    if (!window.fbq) loadPixel();
    if (window.fbq) window.fbq("track", eventName, params || {}, options || {});
  };

  function injectBanner() {
    if (document.getElementById("jerwis-cookie-banner")) return;
    var css = ""
      + "#jerwis-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;background:#0A0A0A;color:#FBF7F0;border-radius:10px;padding:18px 22px;box-shadow:0 12px 40px rgba(0,0,0,.25);font-family:'Archivo',system-ui,sans-serif;font-size:14px;line-height:1.5;z-index:99999;display:flex;flex-direction:column;gap:12px}"
      + "#jerwis-cookie-banner p{margin:0;color:rgba(255,255,255,.85)}"
      + "#jerwis-cookie-banner a{color:#EF426F;text-decoration:underline;text-underline-offset:3px}"
      + "#jerwis-cookie-banner .actions{display:flex;gap:8px;flex-wrap:wrap}"
      + "#jerwis-cookie-banner button{flex:1;min-width:120px;font-family:inherit;font-size:13px;font-weight:700;padding:10px 16px;border-radius:6px;border:0;cursor:pointer;transition:background .15s}"
      + "#jerwis-cookie-banner button.accept{background:#EF426F;color:#fff}"
      + "#jerwis-cookie-banner button.accept:hover{background:#00B2A9}"
      + "#jerwis-cookie-banner button.decline{background:rgba(255,255,255,.1);color:#FBF7F0}"
      + "#jerwis-cookie-banner button.decline:hover{background:rgba(255,255,255,.18)}"
      + "@media (max-width:480px){#jerwis-cookie-banner{left:8px;right:8px;bottom:8px;padding:14px 16px}}";

    var style = document.createElement("style");
    style.id = "jerwis-cookie-banner-style";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    var el = document.createElement("div");
    el.id = "jerwis-cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Préférences cookies");
    el.innerHTML =
      '<p><strong>Cookies marketing</strong> · jerwis.fr utilise un pixel Meta pour mesurer l\'efficacité des pubs Facebook/Instagram. Tu peux refuser — ça ne change rien à ton expérience. <a href="/politique-confidentialite.html#cookies-traceurs">Détails</a>.</p>' +
      '<div class="actions">' +
      '<button class="decline" type="button">Refuser</button>' +
      '<button class="accept" type="button">Accepter</button>' +
      "</div>";
    document.body.appendChild(el);

    el.querySelector(".accept").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "accepted");
      el.remove();
      style.remove();
      loadPixel();
    });
    el.querySelector(".decline").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "declined");
      el.remove();
      style.remove();
    });
  }

  function init() {
    var consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      loadPixel();
    } else if (consent === null) {
      injectBanner();
    }
    // "declined" → rien faire
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
