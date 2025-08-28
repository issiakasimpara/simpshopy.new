# 🔧 Guide de Configuration Google - SimpShopy

## 📋 **Codes à obtenir**

### **1. Google Analytics 4 (GA4)**
- **URL** : https://analytics.google.com/
- **Format** : `G-XXXXXXXXXX`
- **Exemple** : `G-ABC123DEF4`

### **2. Google Tag Manager (GTM)**
- **URL** : https://tagmanager.google.com/
- **Format** : `GTM-XXXXXXX`
- **Exemple** : `GTM-ABC1234`

### **3. Google Search Console**
- **URL** : https://search.google.com/search-console
- **Format** : Code de vérification (ex: `ABC123DEF456GHI789`)

## 🚀 **Étapes détaillées**

### **Étape 1 : Google Analytics 4**

1. **Créer un compte GA4**
   ```
   1. Aller sur https://analytics.google.com/
   2. Cliquer sur "Créer un compte"
   3. Nom du compte : "SimpShopy"
   4. Cliquer sur "Suivant"
   ```

2. **Créer une propriété**
   ```
   1. Nom de la propriété : "SimpShopy Website"
   2. URL du site : https://simpshopy.com
   3. Secteur d'activité : "E-commerce"
   4. Fuseau horaire : Votre fuseau
   5. Cliquer sur "Suivant"
   ```

3. **Configurer le flux de données**
   ```
   1. Plateforme : "Web"
   2. URL du site : https://simpshopy.com
   3. Nom du flux : "SimpShopy Main Website"
   4. Cliquer sur "Créer le flux"
   ```

4. **Récupérer l'ID GA4**
   ```
   1. Dans GA4, aller dans "Administration" (⚙️)
   2. Dans "Propriété", cliquer sur "Flux de données"
   3. Cliquer sur votre flux web
   4. Copier l'ID de mesure (G-XXXXXXXXXX)
   ```

### **Étape 2 : Google Tag Manager**

1. **Créer un compte GTM**
   ```
   1. Aller sur https://tagmanager.google.com/
   2. Cliquer sur "Créer un compte"
   3. Nom du compte : "SimpShopy"
   4. Cliquer sur "Suivant"
   ```

2. **Créer un conteneur**
   ```
   1. Nom : "SimpShopy Website"
   2. Plateforme : "Web"
   3. URL : https://simpshopy.com
   4. Cliquer sur "Créer"
   ```

3. **Récupérer l'ID GTM**
   ```
   1. L'ID GTM s'affiche directement : GTM-XXXXXXX
   2. Le copier pour l'utiliser plus tard
   ```

### **Étape 3 : Google Search Console**

1. **Ajouter une propriété**
   ```
   1. Aller sur https://search.google.com/search-console
   2. Cliquer sur "Ajouter une propriété"
   3. URL : https://simpshopy.com
   4. Cliquer sur "Continuer"
   ```

2. **Vérifier la propriété**
   ```
   1. Choisir "Balise HTML"
   2. Copier le code de vérification
   3. Exemple : <meta name="google-site-verification" content="ABC123DEF456GHI789" />
   4. Extraire : ABC123DEF456GHI789
   ```

## 🔧 **Configuration dans le code**

Une fois vos codes obtenus, remplacer dans `public/google-tags.html` :

```html
<!-- Remplacer GA_MEASUREMENT_ID par votre ID GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123DEF4');
</script>

<!-- Remplacer YOUR_VERIFICATION_CODE par votre code de vérification -->
<meta name="google-site-verification" content="ABC123DEF456GHI789" />

<!-- Remplacer GTM-XXXXXXX par votre ID GTM -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-ABC1234');</script>

<!-- Remplacer GTM-XXXXXXX par votre ID GTM -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-ABC1234"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

## 📊 **Vérification**

### **Google Analytics**
1. Aller sur https://analytics.google.com/
2. Vérifier que les données arrivent
3. Tester avec quelques visites sur votre site

### **Google Search Console**
1. Aller sur https://search.google.com/search-console
2. Vérifier que la propriété est validée
3. Soumettre le sitemap : https://simpshopy.com/sitemap.xml

### **Google Tag Manager**
1. Aller sur https://tagmanager.google.com/
2. Vérifier que le conteneur est actif
3. Tester les balises en mode aperçu

## 🎯 **Prochaines étapes**

1. **Configurer les objectifs GA4**
2. **Créer des audiences**
3. **Configurer les conversions**
4. **Surveiller les performances**

## 📞 **Support**

Si vous rencontrez des difficultés :
- Documentation GA4 : https://support.google.com/analytics
- Documentation GTM : https://support.google.com/tagmanager
- Documentation Search Console : https://support.google.com/webmasters
