# Quick Start - API REST# Guide de démarrage rapide# Quick Start Guide



## 🚀 Démarrage en 30 secondes



```bash## 1. Installation (30 secondes)Guide de démarrage rapide pour le projet DVD Shop Calculator.

# 1. Installer les dépendances

npm install



# 2. Lancer l'API REST```bash## ⚡ Installation rapide (3 commandes)

npm run dev:api

```npm install



✅ L'API est accessible sur **http://localhost:5000**npm run build```bash



## 📚 Documentation```# 1. Installer les dépendances



Ouvrez votre navigateur et accédez à :npm install



**http://localhost:5000/api/docs**## 2. Test rapide



Vous aurez accès à :# 2. Compiler le projet

- 📖 Documentation interactive Swagger UI

- 🧪 Test des endpoints directement depuis le navigateur```bashnpm run build

- 📋 Schémas de requête/réponse

- 💡 Exemples de code# Tester un exemple



## 🎯 Premier testnode dist/index.js examples/example1.txt# 3. Tester avec un exemple



### Via Swagger UI (recommandé)# Output: 36 ✅node dist/index.js examples/example1.txt



1. Ouvrir http://localhost:5000/api/docs# Output: 36

2. Cliquer sur `POST /api/calculate`

3. Cliquer sur "Try it out"# Ou avec pipe```

4. Utiliser l'exemple par défaut ou modifier :

   ```jsonecho -e "Back to the Future 1\nBack to the Future 2\nBack to the Future 3" | node dist/index.js

   {

     "movies": [# Output: 36 ✅## 🧪 Validation complète du projet

       "Back to the Future",

       "Back to the Future II"```

     ]

   }Un script automatique vérifie tous les tests et exemples :

   ```

5. Cliquer sur "Execute"## 3. Validation complète



### Via curl```bash



```bash```bash./validate.sh

curl -X POST http://localhost:5000/api/calculate \

  -H "Content-Type: application/json" \./validate.sh```

  -d '{

    "movies": [```

      "Back to the Future",

      "Back to the Future II"Ce script exécute :

    ]

  }'**Résultat attendu** :- ✅ Tous les tests unitaires (34 tests)

```

```- ✅ La compilation TypeScript

**Réponse attendue :**

```json✓ Unit tests passed (34/34)- ✅ Les 5 exemples du cahier des charges

{

  "total": 27,✓ Build successful- ✅ Le test avec pipe

  "subtotal": 30,

  "discount": 3,✓ Example 1: 36 ✅

  "discountPercentage": 10,

  "itemCount": 2,✓ Example 2: 27 ✅  ## 📝 Tester rapidement les exemples

  "uniqueEpisodes": 2,

  "movies": [✓ Example 3: 15 ✅

    {

      "title": "Back to the Future",✓ Example 4: 48 ✅### Tous les exemples en une commande

      "type": "BTTF",

      "basePrice": 15,✓ Example 5: 56 ✅

      "episodeNumber": 1

    },✓ Pipe input: 27 ✅```bash

    {

      "title": "Back to the Future II",for i in 1 2 3 4 5; do 

      "type": "BTTF",

      "basePrice": 15,All validations passed successfully! ✨  echo "Example $i: $(node dist/index.js examples/example$i.txt)"

      "episodeNumber": 2

    }```done

  ]

}```

```

## 4. Commandes essentielles

## ⚙️ Configuration

Résultats attendus :

### Port par défaut : 5000

```bash```

Pour changer le port :

npm test              # Tests (34 tests)Example 1: 36

```bash

# Option 1 : Variable d'environnementnpm run test:coverage # Avec couvertureExample 2: 27

PORT=8080 npm run dev:api

node dist/index.js <file>  # Utiliser le programmeExample 3: 15

# Option 2 : Fichier .env

echo "PORT=8080" > .env```Example 4: 48

npm run dev:api

```Example 5: 56



### Autres endpoints## 5. Format d'entrée```



- **Health check** : http://localhost:5000/health

- **Spec OpenAPI** : http://localhost:5000/api/docs/json

Créer un fichier texte avec un film par ligne :### Exemple individuel

## 📖 Documentation complète



- [API.md](./API.md) - Documentation détaillée de l'API

- [CONFIGURATION.md](./CONFIGURATION.md) - Guide de configuration``````bash

- [README.md](./README.md) - Documentation principale

Back to the Future 1# Exemple 1 : 3 volets différents → 36€

## 🧪 Tests

Back to the Future 2node dist/index.js examples/example1.txt

```bash

# Tous les tests (76 tests)Back to the Future 3

npm test

```# Exemple 5 : Mix BTTF + autre film → 56€

# Tests API uniquement

npm test src/apinode dist/index.js examples/example5.txt



# Avec couverturePuis :```

npm run test:coverage

``````bash



## 🐳 Dockernode dist/index.js mon-panier.txt## 🔧 Commandes de développement



```bash```

# Build

docker build -t dvd-calculator-api .```bash



# Run## Troubleshooting# Lancer les tests

docker run -p 5000:5000 dvd-calculator-api

```npm test



Accès : http://localhost:5000/api/docs**Erreur "Cannot find module"** :



## 💡 Exemples d'utilisation```bash# Tests en mode watch (re-exécution automatique)



### Calcul simple (2 BTTF)npm run buildnpm run test:watch

```bash

curl -X POST http://localhost:5000/api/calculate \```

  -H "Content-Type: application/json" \

  -d '{"movies": ["Back to the Future", "Back to the Future II"]}'# Rapport de couverture

# Résultat: 27€ (30€ - 10%)

```**Erreur "Permission denied"** :npm run test:coverage



### Calcul avec 3 volets (20% de réduction)```bash

```bash

curl -X POST http://localhost:5000/api/calculate \chmod +x validate.sh# Compiler TypeScript

  -H "Content-Type: application/json" \

  -d '{"movies": ["Back to the Future", "Back to the Future II", "Back to the Future III"]}'```npm run build

# Résultat: 36€ (45€ - 20%)

```



### Calcul mixte (BTTF + autres)**Tests échouent** :# Mode développement (sans compilation)

```bash

curl -X POST http://localhost:5000/api/calculate \```bashnpm run dev < examples/example1.txt

  -H "Content-Type: application/json" \

  -d '{"movies": ["Back to the Future", "Back to the Future II", "Star Wars"]}'rm -rf node_modules package-lock.json```

# Résultat: 47€ (27€ BTTF avec 10% + 20€ Star Wars)

```npm install



## 🆘 Problèmes courantsnpm test## 💡 Utilisation



### Port déjà utilisé```



```bash### Mode 1 : Fichier

# Trouver le processus

lsof -i :5000---



# Utiliser un autre port```bash

PORT=5001 npm run dev:api

```C'est tout ! Le projet est prêt à l'emploi.node dist/index.js votre-fichier.txt



### Module non trouvé```



```bash### Mode 2 : Pipe

# Réinstaller les dépendances

rm -rf node_modules package-lock.json```bash

npm installcat examples/example1.txt | node dist/index.js

```

# ou

### Tests échouentecho -e "Back to the Future 1\nBack to the Future 2" | node dist/index.js

```

```bash

# Reconstruire### Mode 3 : Interactif

npm run build

npm test```bash

```node dist/index.js

# Tapez les titres ligne par ligne

## 📞 Support# Appuyez sur Ctrl+D pour terminer

```

Repository : https://github.com/Dramanable/dvd-test

## 📂 Structure du projet

```
ekinox/
├── src/
│   ├── domain/           # Logique métier (entités uniquement)
│   ├── application/      # Use cases + Orchestration
│   ├── infrastructure/   # Parsing, I/O
│   └── index.ts          # CLI principal
│
├── examples/             # Exemples du cahier des charges
├── dist/                 # Fichiers compilés
│
├── README.md            # Documentation complète
├── ARCHITECTURE.md      # Architecture détaillée
├── EXAMPLES.md          # Guide des exemples
├── QUICKSTART.md        # Ce fichier
└── validate.sh          # Script de validation
```

## 🎯 Vérifier que tout fonctionne

### Option 1 : Script automatique (recommandé)

```bash
./validate.sh
```

### Option 2 : Manuellement

```bash
# 1. Tests unitaires
npm test

# 2. Compilation
npm run build

# 3. Test d'un exemple
node dist/index.js examples/example1.txt
```

## ❓ Problèmes courants

### "command not found: node"

Installez Node.js >= 18.x depuis [nodejs.org](https://nodejs.org)

### "Cannot find module"

Réinstallez les dépendances :
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Permission denied: ./validate.sh"

Rendez le script exécutable :
```bash
chmod +x validate.sh
```

### Les tests échouent

Vérifiez la version de Node.js :
```bash
node --version  # Devrait être >= 18.x
```

## 📚 Pour aller plus loin

- **Documentation complète** : Voir [README.md](README.md)
- **Architecture détaillée** : Voir [ARCHITECTURE.md](ARCHITECTURE.md)
- **Plus d'exemples** : Voir [EXAMPLES.md](EXAMPLES.md)

## ✅ Checklist de validation

Avant de présenter le projet, vérifiez :

- [ ] `npm install` fonctionne sans erreur
- [ ] `npm test` affiche "34 passed"
- [ ] `npm run build` compile sans erreur
- [ ] `./validate.sh` affiche "All validations passed"
- [ ] Les 5 exemples retournent les bonnes valeurs (36, 27, 15, 48, 56)

## 🚀 C'est tout !

Le projet est prêt à être utilisé et démontré. Pour plus de détails sur l'architecture, les patterns utilisés et les décisions techniques, consultez les autres fichiers de documentation.

**Bon test !** 🎉
