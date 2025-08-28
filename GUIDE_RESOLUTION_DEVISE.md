# 🔧 Guide de Résolution : Problème de Devise

## **🎯 Problème identifié :**

L'erreur `406 (Not Acceptable)` et `Table market_settings n'existe pas` indique que la table `market_settings` est manquante dans votre base de données Supabase.

## **🚀 Solution Rapide :**

### **Option 1 : Interface Supabase (Recommandée)**

1. **Allez dans votre dashboard Supabase**
2. **Cliquez sur "SQL Editor"**
3. **Copiez et collez le contenu de `create_market_settings_table.sql`**
4. **Cliquez sur "Run"**

### **Option 2 : Supabase CLI**

```bash
# Exécutez le script PowerShell
powershell -ExecutionPolicy Bypass -File fix-market-settings-table.ps1
```

### **Option 3 : Migration manuelle**

```bash
# Appliquer la migration
supabase db push
```

## **✅ Vérification :**

Après avoir créé la table, vérifiez que :

1. **La table existe** dans Supabase Dashboard → Table Editor
2. **Les données sont insérées** (une ligne par boutique)
3. **Les politiques RLS sont actives**

## **🧪 Test du système :**

1. **Rafraîchissez votre application**
2. **Allez dans Paramètres → Devise**
3. **Changez la devise** (XOF → EUR par exemple)
4. **Vérifiez que les prix se mettent à jour** dans :
   - Dashboard
   - Analyses
   - Formulaires de produits
   - Méthodes de livraison

## **🔍 Logs attendus après correction :**

```
✅ Table market_settings créée avec succès!
✅ Devise mise à jour: XOF → EUR
✅ Temps réel configuré pour la devise
✅ Tous les composants mis à jour
```

## **❌ Si le problème persiste :**

1. **Vérifiez les politiques RLS** dans Supabase
2. **Vérifiez la connexion** à Supabase
3. **Vérifiez les logs** de la console
4. **Contactez le support** avec les logs d'erreur

## **📋 Checklist de résolution :**

- [ ] Table `market_settings` créée
- [ ] Données insérées pour votre boutique
- [ ] Politiques RLS configurées
- [ ] Application rafraîchie
- [ ] Changement de devise testé
- [ ] Prix mis à jour dans toute l'application

---

**🎉 Une fois ces étapes terminées, le système de devise sera entièrement fonctionnel !**
