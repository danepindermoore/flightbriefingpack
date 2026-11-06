(function(){
  "use strict";
  const ACCESS_KEY="fbpAdminAccess";
  if(sessionStorage.getItem(ACCESS_KEY)==="granted") return;
  document.documentElement.classList.add("fbp-access-locked");
  const style=document.createElement("style");
  style.textContent=`html.fbp-access-locked body>*:not(#fbp-access-gate){visibility:hidden!important}#fbp-access-gate{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;background:linear-gradient(145deg,#071b3d,#102f50);color:#f5f7fa;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;visibility:visible}#fbp-access-gate *{box-sizing:border-box}#fbp-access-gate .access-card{width:min(100%,460px);padding:28px;border:1px solid #ffffff35;border-radius:22px;background:#ffffff12;box-shadow:0 24px 70px #0005;backdrop-filter:blur(12px)}#fbp-access-gate h1{margin:0 0 12px;font-size:clamp(1.5rem,5vw,2rem);line-height:1.15}#fbp-access-gate p{margin:0 0 18px;color:#d0deea}#fbp-access-gate label{display:block;margin-bottom:7px;font-size:.9rem;font-weight:700}#fbp-access-gate input{width:100%;min-height:48px;padding:10px 13px;border:1px solid #ffffff45;border-radius:11px;background:#071b3d99;color:#fff;font:inherit}#fbp-access-gate input:focus{outline:3px solid #75b8df}#fbp-access-gate .access-actions{display:flex;gap:10px;margin-top:14px}#fbp-access-gate button,#fbp-access-gate a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:9px 16px;border:1px solid #ffffff45;border-radius:11px;background:#ffffff15;color:#fff;font:inherit;font-weight:750;text-decoration:none;cursor:pointer}#fbp-access-gate button{background:#2e5c99;border-color:#75b8df}#fbp-access-gate .access-error{min-height:1.5em;margin:10px 0 0;color:#ffc6cb;font-size:.9rem}`;
  document.head.appendChild(style);
  document.addEventListener("DOMContentLoaded",function(){
    const gate=document.createElement("div");gate.id="fbp-access-gate";
    gate.innerHTML='<section class="access-card" role="dialog" aria-modal="true" aria-labelledby="fbp-access-title"><h1 id="fbp-access-title">Admin Access</h1><p>These pages are reserved for use by Admin only. If you wish to request access, please use the feedback button on this page.</p><form><label for="fbp-access-password">Password</label><input id="fbp-access-password" type="password" autocomplete="current-password" required><div class="access-actions"><button type="submit">Continue</button><a id="fbp-access-feedback">Request Access</a></div><p class="access-error" aria-live="polite"></p></form></section>';
    document.body.appendChild(gate);
    const page=decodeURIComponent(location.pathname.split("/").filter(Boolean).pop()||"Flight Briefing Pack");
    gate.querySelector("#fbp-access-feedback").href="mailto:u155573@ba.com?subject="+encodeURIComponent("Request access to "+page);
    const input=gate.querySelector("#fbp-access-password");input.focus();
    gate.querySelector("form").addEventListener("submit",function(event){event.preventDefault();if(input.value==="admin"){sessionStorage.setItem(ACCESS_KEY,"granted");location.reload();return}gate.querySelector(".access-error").textContent="Password not recognised.";input.select()});
  });
})();