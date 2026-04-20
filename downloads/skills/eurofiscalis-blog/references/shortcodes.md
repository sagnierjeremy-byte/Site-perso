# Shortcodes Eurofiscalis — Référence Complète

**RÈGLE ABSOLUE** : Ne JAMAIS hardcoder un seuil Intrastat ou un taux de TVA dans un article. Utiliser systématiquement les shortcodes ci-dessous. Les valeurs sont mises à jour dynamiquement côté WordPress.

---

## 1. Shortcodes Intrastat

Format : `[intrastat_{CC}_{type}]` où CC = code pays ISO 2 lettres (minuscules)

| Type | Suffixe | Signification |
|------|---------|---------------|
| Import | `_imp` | Seuil à l'introduction |
| Export | `_exp` | Seuil à l'expédition |
| Deadline | `_dl` | Date limite de dépôt |

### Table complète — 27 pays

| Pays | CC | Introduction | Expédition | Date Limite |
|------|----|-------------|-----------|------------|
| Allemagne | de | `[intrastat_de_imp]` | `[intrastat_de_exp]` | `[intrastat_de_dl]` |
| Autriche | at | `[intrastat_at_imp]` | `[intrastat_at_exp]` | `[intrastat_at_dl]` |
| Belgique | be | `[intrastat_be_imp]` | `[intrastat_be_exp]` | `[intrastat_be_dl]` |
| Bulgarie | bg | `[intrastat_bg_imp]` | `[intrastat_bg_exp]` | `[intrastat_bg_dl]` |
| Chypre | cy | `[intrastat_cy_imp]` | `[intrastat_cy_exp]` | `[intrastat_cy_dl]` |
| Croatie | hr | `[intrastat_hr_imp]` | `[intrastat_hr_exp]` | `[intrastat_hr_dl]` |
| Danemark | dk | `[intrastat_dk_imp]` | `[intrastat_dk_exp]` | `[intrastat_dk_dl]` |
| Espagne | es | `[intrastat_es_imp]` | `[intrastat_es_exp]` | `[intrastat_es_dl]` |
| Estonie | ee | `[intrastat_ee_imp]` | `[intrastat_ee_exp]` | `[intrastat_ee_dl]` |
| Finlande | fi | `[intrastat_fi_imp]` | `[intrastat_fi_exp]` | `[intrastat_fi_dl]` |
| France | fr | `[intrastat_fr_imp]` | `[intrastat_fr_exp]` | `[intrastat_fr_dl]` |
| Grèce | gr | `[intrastat_gr_imp]` | `[intrastat_gr_exp]` | `[intrastat_gr_dl]` |
| Hongrie | hu | `[intrastat_hu_imp]` | `[intrastat_hu_exp]` | `[intrastat_hu_dl]` |
| Irlande du Nord | uk | `[intrastat_uk_imp]` | `[intrastat_uk_exp]` | `[intrastat_uk_dl]` |
| Italie | it | `[intrastat_it_imp]` | `[intrastat_it_exp]` | `[intrastat_it_dl]` |
| Lettonie | lv | `[intrastat_lv_imp]` | `[intrastat_lv_exp]` | `[intrastat_lv_dl]` |
| Lituanie | lt | `[intrastat_lt_imp]` | `[intrastat_lt_exp]` | `[intrastat_lt_dl]` |
| Luxembourg | lu | `[intrastat_lu_imp]` | `[intrastat_lu_exp]` | `[intrastat_lu_dl]` |
| Malte | mt | `[intrastat_mt_imp]` | `[intrastat_mt_exp]` | `[intrastat_mt_dl]` |
| Pays-Bas | nl | `[intrastat_nl_imp]` | `[intrastat_nl_exp]` | `[intrastat_nl_dl]` |
| Pologne | pl | `[intrastat_pl_imp]` | `[intrastat_pl_exp]` | `[intrastat_pl_dl]` |
| Portugal | pt | `[intrastat_pt_imp]` | `[intrastat_pt_exp]` | `[intrastat_pt_dl]` |
| Rép. tchèque | cz | `[intrastat_cz_imp]` | `[intrastat_cz_exp]` | `[intrastat_cz_dl]` |
| Roumanie | ro | `[intrastat_ro_imp]` | `[intrastat_ro_exp]` | `[intrastat_ro_dl]` |
| Slovaquie | sk | `[intrastat_sk_imp]` | `[intrastat_sk_exp]` | `[intrastat_sk_dl]` |
| Slovénie | si | `[intrastat_si_imp]` | `[intrastat_si_exp]` | `[intrastat_si_dl]` |
| Suède | se | `[intrastat_se_imp]` | `[intrastat_se_exp]` | `[intrastat_se_dl]` |

---

## 2. Shortcodes Taux de TVA

Format : `[rates_{CC}_{type}]` où CC = code pays ISO 2 lettres (minuscules)

| Type | Suffixe | Signification |
|------|---------|---------------|
| Standard | `_s` | Taux normal |
| Réduit 1 | `_r1` | Premier taux réduit |
| Réduit 2 | `_r2` | Deuxième taux réduit |
| Super-réduit | `_sr` | Taux super-réduit |

### Table complète — 31 pays

| Pays | CC | Normal | Réduit 1 | Réduit 2 | Super-réduit |
|------|----|--------|----------|----------|-------------|
| Allemagne | de | `[rates_de_s]` | `[rates_de_r1]` | — | — |
| Autriche | at | `[rates_at_s]` | `[rates_at_r1]` | `[rates_at_r2]` | — |
| Belgique | be | `[rates_be_s]` | `[rates_be_r1]` | `[rates_be_r2]` | — |
| Bulgarie | bg | `[rates_bg_s]` | `[rates_bg_r1]` | — | — |
| Chypre | cy | `[rates_cy_s]` | `[rates_cy_r1]` | `[rates_cy_r2]` | — |
| Croatie | hr | `[rates_hr_s]` | `[rates_hr_r1]` | `[rates_hr_r2]` | — |
| Danemark | dk | `[rates_dk_s]` | — | — | — |
| Espagne | es | `[rates_es_s]` | `[rates_es_r1]` | — | `[rates_es_sr]` |
| Estonie | ee | `[rates_ee_s]` | `[rates_ee_r1]` | — | — |
| Finlande | fi | `[rates_fi_s]` | `[rates_fi_r1]` | `[rates_fi_r2]` | — |
| France | fr | `[rates_fr_s]` | `[rates_fr_r1]` | `[rates_fr_r2]` | `[rates_fr_sr]` |
| Grèce | gr | `[rates_gr_s]` | `[rates_gr_r1]` | `[rates_gr_r2]` | — |
| Hongrie | hu | `[rates_hu_s]` | `[rates_hu_r1]` | `[rates_hu_r2]` | — |
| Irlande | ie | `[rates_ie_s]` | `[rates_ie_r1]` | `[rates_ie_r2]` | `[rates_ie_sr]` |
| Irlande du Nord | uk | `[rates_uk_s]` | `[rates_uk_r1]` | — | — |
| Italie | it | `[rates_it_s]` | `[rates_it_r1]` | `[rates_it_r2]` | `[rates_it_sr]` |
| Lettonie | lv | `[rates_lv_s]` | `[rates_lv_r1]` | `[rates_lv_r2]` | — |
| Lituanie | lt | `[rates_lt_s]` | `[rates_lt_r1]` | `[rates_lt_r2]` | — |
| Luxembourg | lu | `[rates_lu_s]` | `[rates_lu_r1]` | `[rates_lu_r2]` | `[rates_lu_sr]` |
| Malte | mt | `[rates_mt_s]` | `[rates_mt_r1]` | `[rates_mt_r2]` | — |
| Norvège | no | `[rates_no_s]` | `[rates_no_r1]` | `[rates_no_r2]` | — |
| Pays-Bas | nl | `[rates_nl_s]` | `[rates_nl_r1]` | — | — |
| Pologne | pl | `[rates_pl_s]` | `[rates_pl_r1]` | `[rates_pl_r2]` | — |
| Portugal | pt | `[rates_pt_s]` | `[rates_pt_r1]` | `[rates_pt_r2]` | — |
| Rép. tchèque | cz | `[rates_cz_s]` | `[rates_cz_r1]` | — | — |
| Roumanie | ro | `[rates_ro_s]` | `[rates_ro_r1]` | — | — |
| Royaume-Uni | uk | `[rates_uk_s]` | `[rates_uk_r1]` | — | — |
| Slovaquie | sk | `[rates_sk_s]` | `[rates_sk_r1]` | — | — |
| Slovénie | si | `[rates_si_s]` | `[rates_si_r1]` | `[rates_si_r2]` | — |
| Suède | se | `[rates_se_s]` | `[rates_se_r1]` | `[rates_se_r2]` | — |
| Suisse | ch | `[rates_ch_s]` | `[rates_ch_r1]` | `[rates_ch_r2]` | — |

### Notes importantes

- Le tiret `—` signifie que ce taux n'existe pas pour ce pays
- Le Danemark n'a qu'un taux normal (pas de taux réduits)
- La France, l'Irlande, l'Italie et le Luxembourg ont les 4 niveaux
- Ne JAMAIS écrire un pourcentage en dur : toujours utiliser le shortcode
- Dans le texte, écrire : "Le taux normal de TVA en Italie est de `[rates_it_s]`"
- Dans les tableaux comparatifs, utiliser le shortcode dans chaque cellule
