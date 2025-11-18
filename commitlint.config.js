module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation seulement
        'style',    // Changements qui n'affectent pas le sens du code (formatage, etc.)
        'refactor', // Refactoring de code
        'perf',     // Amélioration des performances
        'test',     // Ajout ou modification de tests
        'build',    // Changements du système de build ou dépendances externes
        'ci',       // Changements des fichiers de configuration CI
        'chore',    // Autres changements qui ne modifient pas le code source ou les tests
        'revert',   // Revert d'un commit précédent
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
