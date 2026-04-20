# Outils Interactifs — Code HTML/JS Gutenberg

Chaque outil est un bloc HTML Gutenberg (`<!-- wp:html -->`) auto-contenu. Vanilla JS, pas de dépendances externes. Montserrat est héritée du thème. Couleurs brand Eurofiscalis.

**Comment utiliser :** copier le bloc complet dans un bloc "HTML personnalisé" de Gutenberg à l'emplacement `[OUTIL-T{N}]` indiqué dans l'article.

**Personnalisation obligatoire :** remplacer `{Pays}` dans le `<h3>` du header de l'outil par le pays de l'article.

---

## OUTIL T4 — "Dois-je m'immatriculer à la TVA ?"

**Template :** Numéro de TVA (tous les pays)
**Position :** Après l'encart "L'essentiel en 1 minute" (haut de page)

```html
<!-- wp:html -->
<div id="eft4" style="font-family:inherit;max-width:640px;margin:32px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden">
  <div style="background:#2C5051;padding:22px 28px">
    <div style="color:#5ECD8C;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Outil interactif</div>
    <h3 style="color:#fff;margin:0;font-size:18px;font-weight:700;line-height:1.4">Dois-je m'immatriculer à la TVA en {Pays} ?</h3>
  </div>
  <div id="eft4-steps" style="padding:28px">
    <div id="eft4-s1">
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Votre entreprise est-elle établie dans l'Union Européenne ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft4go('s2ue')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">🇪🇺 Oui — établie dans l'UE</button>
        <button onclick="eft4res('hue')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">🌍 Non — établie hors UE</button>
      </div>
    </div>
    <div id="eft4-s2ue" style="display:none">
      <button onclick="eft4go('s1')" style="background:none;border:none;color:#868686;cursor:pointer;font-family:inherit;font-size:13px;padding:0;margin-bottom:16px">← Retour</button>
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Nature de vos opérations dans ce pays ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft4res('stock')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">📦 Stockage ou dépôt de marchandises</button>
        <button onclick="eft4go('s3b2c')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">🛒 Ventes de biens à des particuliers (B2C / e-commerce)</button>
        <button onclick="eft4res('b2b')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">🏢 Ventes de biens à des entreprises assujetties (B2B)</button>
        <button onclick="eft4res('svc')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">🔧 Prestations de services uniquement</button>
      </div>
    </div>
    <div id="eft4-s3b2c" style="display:none">
      <button onclick="eft4go('s2ue')" style="background:none;border:none;color:#868686;cursor:pointer;font-family:inherit;font-size:13px;padding:0;margin-bottom:16px">← Retour</button>
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Votre CA annuel de ventes à distance vers l'UE dépasse-t-il 10 000 € ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft4go('s4oss')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">✅ Oui, je dépasse 10 000 €/an</button>
        <button onclick="eft4res('seuil')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">❌ Non, je suis sous 10 000 €/an</button>
      </div>
    </div>
    <div id="eft4-s4oss" style="display:none">
      <button onclick="eft4go('s3b2c')" style="background:none;border:none;color:#868686;cursor:pointer;font-family:inherit;font-size:13px;padding:0;margin-bottom:16px">← Retour</button>
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Êtes-vous enregistré au régime OSS dans votre pays d'établissement ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft4res('oss')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">✅ Oui, je suis enregistré à l'OSS</button>
        <button onclick="eft4res('nooss')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">❌ Non, je ne suis pas à l'OSS</button>
      </div>
    </div>
  </div>
  <div id="eft4-r" style="display:none;padding:0 28px 28px">
    <div id="eft4-rc"></div>
    <button onclick="eft4reset()" style="margin-top:16px;background:none;border:2px solid #2C5051;border-radius:30px;padding:10px 20px;color:#2C5051;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer">↺ Recommencer</button>
  </div>
</div>
<script>
(function(){
  var R={
    hue:{c:'#e74c3c',i:'🔴',t:'Immatriculation TVA obligatoire + représentant fiscal',d:'En tant qu\'entreprise établie hors UE, vous devez vous immatriculer à la TVA dans ce pays et désigner un représentant fiscal agréé pour réaliser vos opérations taxables.'},
    stock:{c:'#e74c3c',i:'🔴',t:'Immatriculation TVA obligatoire',d:'Le stockage de marchandises dans un pays crée un point de livraison local et génère une obligation d\'immatriculation TVA. Vous devez vous enregistrer avant la première opération.'},
    b2b:{c:'#5ECD8C',i:'🟢',t:'Immatriculation non obligatoire (règle générale)',d:'Pour les livraisons intracommunautaires à un client assujetti, l\'autoliquidation s\'applique : vous facturez hors TVA et votre client déclare la TVA dans son pays. Aucune immatriculation locale requise.'},
    svc:{c:'#5ECD8C',i:'🟢',t:'Immatriculation généralement non obligatoire',d:'Pour les services B2B, la TVA est en principe due dans le pays du client qui l\'autoliquide. Attention aux exceptions (services liés à un immeuble, manifestations, etc.). Consultez un spécialiste pour les services B2C.'},
    seuil:{c:'#f39c12',i:'🟡',t:'Pas d\'obligation immédiate — à surveiller',d:'Sous le seuil OSS de 10 000 €/an (total UE), vous appliquez la TVA de votre pays. Dès que ce seuil est franchi, l\'obligation s\'applique rétroactivement. Anticipez avant de l\'atteindre.'},
    oss:{c:'#5ECD8C',i:'🟢',t:'Pas d\'immatriculation locale nécessaire',d:'Grâce au régime OSS, vous déclarez et payez la TVA de tous les pays UE via un guichet unique dans votre pays d\'établissement. Pas d\'immatriculation locale dans chaque pays.'},
    nooss:{c:'#e74c3c',i:'🔴',t:'Immatriculation TVA obligatoire',d:'Au-dessus du seuil OSS sans être enregistré au régime OSS, vous devez vous immatriculer à la TVA dans chaque pays UE où vous vendez. Enregistrez-vous à l\'OSS dans votre pays — c\'est la solution la plus simple.'}
  };
  function show(id){document.querySelectorAll('#eft4-steps > div').forEach(function(e){e.style.display='none'});var el=document.getElementById('eft4-'+id);if(el)el.style.display='block';}
  window.eft4go=function(s){show(s);document.getElementById('eft4-r').style.display='none';};
  window.eft4res=function(k){
    var r=R[k];if(!r)return;
    show('none');
    document.getElementById('eft4-rc').innerHTML='<div style="display:flex;align-items:flex-start;gap:14px;padding:20px;background:#f8f8f8;border-radius:12px;border-left:4px solid '+r.c+'"><div style="font-size:26px;flex-shrink:0">'+r.i+'</div><div><div style="font-weight:700;font-size:15px;color:'+r.c+';margin-bottom:8px">'+r.t+'</div><p style="color:#333;font-size:14px;line-height:1.6;margin:0">'+r.d+'</p></div></div>';
    document.getElementById('eft4-r').style.display='block';
  };
  window.eft4reset=function(){document.getElementById('eft4-r').style.display='none';show('s1');};
})();
</script>
<!-- /wp:html -->
```

---

## OUTIL T6 — "Quelle procédure pour récupérer ma TVA ?"

**Template :** Remboursement TVA (tous les pays)
**Position :** Après l'encart "L'essentiel en 1 minute" (haut de page)

```html
<!-- wp:html -->
<div id="eft6" style="font-family:inherit;max-width:640px;margin:32px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden">
  <div style="background:#2C5051;padding:22px 28px">
    <div style="color:#5ECD8C;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Outil interactif</div>
    <h3 style="color:#fff;margin:0;font-size:18px;font-weight:700;line-height:1.4">Quelle procédure pour récupérer la TVA en {Pays} ?</h3>
  </div>
  <div id="eft6-steps" style="padding:28px">
    <div id="eft6-s1">
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Votre entreprise est-elle établie dans l'Union Européenne ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft6go('s2ue')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">🇪🇺 Oui — établie dans l'UE</button>
        <button onclick="eft6go('s2hue')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">🌍 Non — établie hors UE</button>
      </div>
    </div>
    <div id="eft6-s2ue" style="display:none">
      <button onclick="eft6go('s1')" style="background:none;border:none;color:#868686;cursor:pointer;font-family:inherit;font-size:13px;padding:0;margin-bottom:16px">← Retour</button>
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Êtes-vous déjà immatriculé à la TVA dans ce pays ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft6res('immat')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">✅ Oui, j'ai un numéro de TVA dans ce pays</button>
        <button onclick="eft6res('8e')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">❌ Non, je n'ai pas de numéro de TVA dans ce pays</button>
      </div>
    </div>
    <div id="eft6-s2hue" style="display:none">
      <button onclick="eft6go('s1')" style="background:none;border:none;color:#868686;cursor:pointer;font-family:inherit;font-size:13px;padding:0;margin-bottom:16px">← Retour</button>
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Le pays où vous êtes établi a-t-il un accord de réciprocité TVA avec l'UE ?</p>
      <p style="color:#868686;font-size:13px;margin:0 0 16px">Pays avec accord : États-Unis, Canada, Suisse, Norvège, Islande, Japon, Australie (liste non exhaustive — vérifier selon le pays UE cible).</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft6res('13e')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">✅ Oui, accord de réciprocité existant</button>
        <button onclick="eft6res('immat_obl')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">❌ Non ou incertain</button>
      </div>
    </div>
  </div>
  <div id="eft6-r" style="display:none;padding:0 28px 28px">
    <div id="eft6-rc"></div>
    <button onclick="eft6reset()" style="margin-top:16px;background:none;border:2px solid #2C5051;border-radius:30px;padding:10px 20px;color:#2C5051;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer">↺ Recommencer</button>
  </div>
</div>
<script>
(function(){
  var R={
    immat:{c:'#5ECD8C',i:'🟢',t:'Remboursement via votre déclaration de TVA',d:'Vous êtes immatriculé : la TVA payée sur vos achats locaux est déduite directement dans votre déclaration de TVA. Si votre crédit de TVA est positif, vous faites une demande de remboursement classique auprès de l\'administration fiscale.'},
    '8e':{c:'#5ECD8C',i:'🟢',t:'8ème directive — procédure de remboursement EU',d:'En tant qu\'entreprise UE sans immatriculation locale, vous pouvez demander le remboursement de la TVA via le portail électronique de votre pays (ex : impots.gouv.fr pour la France). Délai : 4 à 8 mois. Aucun représentant fiscal requis.'},
    '13e':{c:'#f39c12',i:'🟡',t:'13ème directive — procédure avec représentant fiscal',d:'En tant qu\'entreprise hors UE dans un pays avec accord de réciprocité, vous pouvez demander le remboursement via la 13ème directive. La procédure est papier, plus longue (6 à 12 mois), et nécessite souvent un représentant fiscal dans le pays.'},
    immat_obl:{c:'#e74c3c',i:'🔴',t:'Immatriculation TVA obligatoire',d:'Sans accord de réciprocité, votre seule option pour récupérer la TVA est de vous immatriculer à la TVA dans le pays et de déposer des déclarations régulières. Un représentant fiscal agréé est indispensable pour les entreprises hors UE.'}
  };
  function show(id){document.querySelectorAll('#eft6-steps > div').forEach(function(e){e.style.display='none'});var el=document.getElementById('eft6-'+id);if(el)el.style.display='block';}
  window.eft6go=function(s){show(s);document.getElementById('eft6-r').style.display='none';};
  window.eft6res=function(k){
    var r=R[k];if(!r)return;
    show('none');
    document.getElementById('eft6-rc').innerHTML='<div style="display:flex;align-items:flex-start;gap:14px;padding:20px;background:#f8f8f8;border-radius:12px;border-left:4px solid '+r.c+'"><div style="font-size:26px;flex-shrink:0">'+r.i+'</div><div><div style="font-weight:700;font-size:15px;color:'+r.c+';margin-bottom:8px">'+r.t+'</div><p style="color:#333;font-size:14px;line-height:1.6;margin:0">'+r.d+'</p></div></div>';
    document.getElementById('eft6-r').style.display='block';
  };
  window.eft6reset=function(){document.getElementById('eft6-r').style.display='none';show('s1');};
})();
</script>
<!-- /wp:html -->
```

---

## OUTIL T3 — "Générateur de mentions obligatoires sur la facture"

**Template :** Facturer un client (tous les pays)
**Position :** Après l'encart "L'essentiel en 1 minute" (haut de page)

```html
<!-- wp:html -->
<div id="eft3" style="font-family:inherit;max-width:640px;margin:32px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden">
  <div style="background:#2C5051;padding:22px 28px">
    <div style="color:#5ECD8C;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Outil interactif</div>
    <h3 style="color:#fff;margin:0;font-size:18px;font-weight:700;line-height:1.4">Quelles mentions obligatoires sur votre facture en {Pays} ?</h3>
  </div>
  <div style="padding:28px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div>
        <label style="display:block;font-weight:600;font-size:13px;color:#333;margin-bottom:8px">Type de client</label>
        <select id="eft3-client" onchange="eft3gen()" style="width:100%;padding:10px 12px;border:2px solid #e8e8e8;border-radius:8px;font-family:inherit;font-size:14px;color:#333;background:#f8f8f8">
          <option value="">— Sélectionner —</option>
          <option value="b2b">Entreprise assujettie (B2B)</option>
          <option value="b2c">Particulier (B2C)</option>
        </select>
      </div>
      <div>
        <label style="display:block;font-weight:600;font-size:13px;color:#333;margin-bottom:8px">Type d'opération</label>
        <select id="eft3-type" onchange="eft3gen()" style="width:100%;padding:10px 12px;border:2px solid #e8e8e8;border-radius:8px;font-family:inherit;font-size:14px;color:#333;background:#f8f8f8">
          <option value="">— Sélectionner —</option>
          <option value="local">Vente locale dans le pays</option>
          <option value="intra">Livraison intracommunautaire</option>
          <option value="export">Exportation hors UE</option>
          <option value="ddp">Vente DDP (droits acquittés)</option>
          <option value="dap">Vente DAP (droits non acquittés)</option>
        </select>
      </div>
    </div>
    <div id="eft3-result" style="display:none">
      <div style="background:#f8f8f8;border-radius:12px;padding:20px;border-left:4px solid #5ECD8C">
        <div style="font-weight:700;font-size:14px;color:#2C5051;margin-bottom:14px">✅ Mentions obligatoires pour votre facture</div>
        <div id="eft3-list"></div>
      </div>
      <p style="color:#868686;font-size:12px;margin:12px 0 0;line-height:1.5">⚠️ Ces mentions sont les exigences de base. Des mentions spécifiques peuvent s'appliquer selon votre secteur d'activité. Consultez un spécialiste Eurofiscalis pour validation.</p>
    </div>
    <div id="eft3-empty" style="color:#868686;font-size:14px;text-align:center;padding:20px 0">Sélectionnez le type de client et d'opération pour générer vos mentions.</div>
  </div>
</div>
<script>
(function(){
  var BASE=['Numéro de facture (séquentiel et unique)','Date d\'émission de la facture','Identité et adresse complète du vendeur','Identité et adresse complète de l\'acheteur','Numéro de TVA du vendeur','Description précise des biens ou services','Quantités et prix unitaires HT','Montant total HT','Taux de TVA applicable','Montant de TVA','Montant total TTC'];
  var EXTRA={
    'b2b-local':['Numéro de TVA de l\'acheteur','Référence bon de commande (si applicable)'],
    'b2c-local':['Mention du taux de TVA applicable','Aucun numéro de TVA acheteur requis'],
    'b2b-intra':['Numéro de TVA intracommunautaire de l\'acheteur (obligatoire)','Mention d\'exonération : "Exonération TVA — Art. 138 Directive 2006/112/CE"','Preuve de transport intracommunautaire à conserver','Montant total HT (facture obligatoirement hors TVA)'],
    'b2c-intra':['TVA du pays de destination applicable (ou OSS)','Mention du régime OSS si applicable','Taux de TVA du pays de destination'],
    'b2b-export':['Mention d\'exonération : "Exportation — exonérée de TVA"','Numéro de déclaration en douane (DAE/EX)','Preuve d\'exportation à conserver 10 ans'],
    'b2c-export':['Même exonération que B2B pour les exports','Mention "Export hors UE — TVA non applicable"'],
    'b2b-ddp':['Numéro de TVA de l\'acheteur dans le pays de destination','TVA du pays de destination incluse (ou autoliquidation si B2B)','Mention incoterm : "DDP [lieu de livraison]"','Numéro d\'immatriculation TVA vendeur dans le pays'],
    'b2c-ddp':['Prix TTC incluant TVA du pays de destination','Mention incoterm : "DDP [lieu de livraison]"','Numéro d\'immatriculation TVA du vendeur dans le pays'],
    'b2b-dap':['Mention incoterm : "DAP [lieu de livraison]"','Prix HT — acheteur prend en charge dédouanement et TVA','Préciser que les droits de douane et TVA sont à la charge de l\'acheteur'],
    'b2c-dap':['Mention incoterm : "DAP [lieu de livraison]"','Avertir l\'acheteur des frais de dédouanement à sa charge','Risque élevé d\'abandon de colis — préférer le DDP pour le B2C']
  };
  window.eft3gen=function(){
    var c=document.getElementById('eft3-client').value;
    var t=document.getElementById('eft3-type').value;
    if(!c||!t){document.getElementById('eft3-result').style.display='none';document.getElementById('eft3-empty').style.display='block';return;}
    var extra=EXTRA[c+'-'+t]||[];
    var all=BASE.concat(extra);
    var html=all.map(function(m,i){
      var isExtra=i>=BASE.length;
      return '<div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;border-bottom:1px solid #eee"><div style="color:'+(isExtra?'#5ECD8C':'#2C5051')+';font-size:14px;flex-shrink:0;margin-top:1px">✓</div><span style="font-size:14px;color:#333;line-height:1.5">'+m+(isExtra?' <span style="background:#f0faf5;color:#2C5051;font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;margin-left:4px">Spécifique</span>':'')+'</span></div>';
    }).join('');
    document.getElementById('eft3-list').innerHTML=html;
    document.getElementById('eft3-result').style.display='block';
    document.getElementById('eft3-empty').style.display='none';
  };
})();
</script>
<!-- /wp:html -->
```

---

## OUTIL T1 — "Êtes-vous soumis à l'INTRASTAT ?"

**Template :** ESL / INTRASTAT (tous les pays UE)
**Position :** Après l'encart "L'essentiel en 1 minute" (haut de page)
**Note :** Pour les seuils, l'outil renvoie le lecteur à la table de l'article (shortcodes non interprétés dans un bloc HTML).

```html
<!-- wp:html -->
<div id="eft1" style="font-family:inherit;max-width:640px;margin:32px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden">
  <div style="background:#2C5051;padding:22px 28px">
    <div style="color:#5ECD8C;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Outil interactif</div>
    <h3 style="color:#fff;margin:0;font-size:18px;font-weight:700;line-height:1.4">Êtes-vous soumis à l'INTRASTAT en {Pays} ?</h3>
  </div>
  <div id="eft1-steps" style="padding:28px">
    <div id="eft1-s1">
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Réalisez-vous des échanges de marchandises avec d'autres pays de l'Union Européenne ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft1go('s2')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">✅ Oui — j'achète ou je vends des biens dans l'UE</button>
        <button onclick="eft1res('no')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">❌ Non — uniquement des services ou hors UE</button>
      </div>
    </div>
    <div id="eft1-s2" style="display:none">
      <button onclick="eft1go('s1')" style="background:none;border:none;color:#868686;cursor:pointer;font-family:inherit;font-size:13px;padding:0;margin-bottom:16px">← Retour</button>
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 8px">Vos flux annuels dépassent-ils le seuil INTRASTAT de ce pays ?</p>
      <p style="color:#868686;font-size:13px;margin:0 0 16px">📋 Consultez les seuils dans le tableau ci-dessus (introduction et expédition).</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft1go('s3')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">✅ Oui, je dépasse le seuil (introduction ou expédition)</button>
        <button onclick="eft1res('sous')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">❌ Non, je suis sous le seuil</button>
      </div>
    </div>
    <div id="eft1-s3" style="display:none">
      <button onclick="eft1go('s2')" style="background:none;border:none;color:#868686;cursor:pointer;font-family:inherit;font-size:13px;padding:0;margin-bottom:16px">← Retour</button>
      <p style="color:#333;font-weight:600;font-size:15px;margin:0 0 16px">Quel type de flux dépasse le seuil ?</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="eft1res('imp')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">📥 Introductions (achats depuis d'autres pays UE)</button>
        <button onclick="eft1res('exp')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">📤 Expéditions (ventes vers d'autres pays UE)</button>
        <button onclick="eft1res('both')" style="background:#f8f8f8;border:2px solid #e8e8e8;border-radius:10px;padding:14px 18px;text-align:left;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#333">📦 Les deux (introductions ET expéditions)</button>
      </div>
    </div>
  </div>
  <div id="eft1-r" style="display:none;padding:0 28px 28px">
    <div id="eft1-rc"></div>
    <button onclick="eft1reset()" style="margin-top:16px;background:none;border:2px solid #2C5051;border-radius:30px;padding:10px 20px;color:#2C5051;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer">↺ Recommencer</button>
  </div>
</div>
<script>
(function(){
  var R={
    no:{c:'#5ECD8C',i:'🟢',t:'Pas de déclaration INTRASTAT requise',d:'L\'INTRASTAT ne concerne que les échanges physiques de marchandises entre pays UE. Les prestations de services et les échanges hors UE ne sont pas concernés.'},
    sous:{c:'#f39c12',i:'🟡',t:'Pas d\'obligation pour le moment — à surveiller',d:'Sous le seuil INTRASTAT, vous n\'êtes pas obligé de déclarer. Attention : le seuil est évalué sur l\'année civile. Dès que vous le dépassez, l\'obligation s\'applique rétroactivement pour toute l\'année. Mettez en place un suivi mensuel.'},
    imp:{c:'#e74c3c',i:'🔴',t:'Déclaration INTRASTAT Introduction obligatoire',d:'Vous devez déposer une déclaration INTRASTAT Introduction mensuelle auprès de l\'administration douanière du pays. Reportez-vous à la section "Comment déposer" ci-dessous pour la procédure complète.'},
    exp:{c:'#e74c3c',i:'🔴',t:'Déclaration INTRASTAT Expédition obligatoire',d:'Vous devez déposer une déclaration INTRASTAT Expédition mensuelle auprès de l\'administration douanière du pays. Reportez-vous à la section "Comment déposer" ci-dessous pour la procédure complète.'},
    both:{c:'#e74c3c',i:'🔴',t:'Deux déclarations INTRASTAT obligatoires',d:'Vous êtes assujetti aux deux déclarations : INTRASTAT Introduction (flux entrants) et INTRASTAT Expédition (flux sortants). Ces deux déclarations sont mensuelles et indépendantes l\'une de l\'autre.'}
  };
  function show(id){document.querySelectorAll('#eft1-steps > div').forEach(function(e){e.style.display='none'});var el=document.getElementById('eft1-'+id);if(el)el.style.display='block';}
  window.eft1go=function(s){show(s);document.getElementById('eft1-r').style.display='none';};
  window.eft1res=function(k){
    var r=R[k];if(!r)return;
    show('none');
    document.getElementById('eft1-rc').innerHTML='<div style="display:flex;align-items:flex-start;gap:14px;padding:20px;background:#f8f8f8;border-radius:12px;border-left:4px solid '+r.c+'"><div style="font-size:26px;flex-shrink:0">'+r.i+'</div><div><div style="font-weight:700;font-size:15px;color:'+r.c+';margin-bottom:8px">'+r.t+'</div><p style="color:#333;font-size:14px;line-height:1.6;margin:0">'+r.d+'</p></div></div>';
    document.getElementById('eft1-r').style.display='block';
  };
  window.eft1reset=function(){document.getElementById('eft1-r').style.display='none';show('s1');};
})();
</script>
<!-- /wp:html -->
```

---

## Template vierge pour nouveaux outils

Utiliser cette structure pour créer les outils des templates T2, T5, T7 :

```html
<!-- wp:html -->
<div id="eft{N}" style="font-family:inherit;max-width:640px;margin:32px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden">
  <div style="background:#2C5051;padding:22px 28px">
    <div style="color:#5ECD8C;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Outil interactif</div>
    <h3 style="color:#fff;margin:0;font-size:18px;font-weight:700;line-height:1.4">{Titre de l'outil} en {Pays}</h3>
  </div>
  <div id="eft{N}-steps" style="padding:28px">
    <div id="eft{N}-s1">
      <!-- Premier écran : question initiale -->
    </div>
    <!-- Étapes supplémentaires -->
  </div>
  <div id="eft{N}-r" style="display:none;padding:0 28px 28px">
    <div id="eft{N}-rc"></div>
    <button onclick="eft{N}reset()" style="margin-top:16px;background:none;border:2px solid #2C5051;border-radius:30px;padding:10px 20px;color:#2C5051;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer">↺ Recommencer</button>
  </div>
</div>
<script>
(function(){
  /* Résultats possibles */
  var R = {
    /* 'cle': {c:'couleur HEX', i:'emoji', t:'Titre résultat', d:'Description 2-3 phrases'} */
  };
  /* Navigation */
  function show(id){document.querySelectorAll('#eft{N}-steps > div').forEach(function(e){e.style.display='none'});var el=document.getElementById('eft{N}-'+id);if(el)el.style.display='block';}
  window.eft{N}go=function(s){show(s);document.getElementById('eft{N}-r').style.display='none';};
  window.eft{N}res=function(k){
    var r=R[k];if(!r)return;
    show('none');
    document.getElementById('eft{N}-rc').innerHTML='<div style="display:flex;align-items:flex-start;gap:14px;padding:20px;background:#f8f8f8;border-radius:12px;border-left:4px solid '+r.c+'"><div style="font-size:26px;flex-shrink:0">'+r.i+'</div><div><div style="font-weight:700;font-size:15px;color:'+r.c+';margin-bottom:8px">'+r.t+'</div><p style="color:#333;font-size:14px;line-height:1.6;margin:0">'+r.d+'</p></div></div>';
    document.getElementById('eft{N}-r').style.display='block';
  };
  window.eft{N}reset=function(){document.getElementById('eft{N}-r').style.display='none';show('s1');};
})();
</script>
<!-- /wp:html -->
```

## Couleurs de résultat

| Couleur | HEX | Usage |
|---------|-----|-------|
| Vert (OK, pas d'obligation) | `#5ECD8C` | Résultat positif / non obligatoire |
| Orange (surveiller) | `#f39c12` | Obligation conditionnelle, seuil proche |
| Rouge (obligation) | `#e74c3c` | Obligation claire, action requise |
