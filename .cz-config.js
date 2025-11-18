module.exports = {
  types: [
    { value: 'feat', name: 'feat:     ✨ Nouvelle fonctionnalité' },
    { value: 'fix', name: 'fix:      🐛 Correction de bug' },
    { value: 'docs', name: 'docs:     📚 Documentation' },
    { value: 'style', name: 'style:    💎 Formatage, style' },
    { value: 'refactor', name: 'refactor: ♻️  Refactorisation' },
    { value: 'perf', name: 'perf:     ⚡️ Amélioration des performances' },
    { value: 'test', name: 'test:     🧪 Ajout/modification de tests' },
    { value: 'build', name: 'build:    📦 Build ou dépendances' },
    { value: 'ci', name: 'ci:       🎡 CI/CD' },
    { value: 'chore', name: 'chore:    🔧 Maintenance' },
    { value: 'revert', name: 'revert:   ⏪ Revert' },
  ],

  scopes: [
    { name: 'domain' },
    { name: 'application' },
    { name: 'infrastructure' },
    { name: 'cli' },
    { name: 'tests' },
    { name: 'docs' },
    { name: 'config' },
    { name: 'ci' },
    { name: 'docker' },
  ],

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'refactor', 'perf'],
  skipQuestions: [],

  messages: {
    type: "Sélectionnez le type de changement que vous soumettez:",
    scope: '\nIndiquez la PORTÉE de ce changement (optionnel):',
    customScope: 'Indiquez votre propre portée:',
    subject: 'Écrivez une description COURTE et IMPÉRATIVE du changement:\n',
    body: 'Fournissez une description PLUS DÉTAILLÉE du changement (optionnel). Utilisez "|" pour les sauts de ligne:\n',
    breaking: 'Listez les BREAKING CHANGES (optionnel):\n',
    footer: 'Listez les ISSUES FERMÉES par ce changement (optionnel). Ex: #31, #34:\n',
    confirmCommit: 'Êtes-vous sûr de vouloir procéder avec le commit ci-dessus?',
  },

  subjectLimit: 100,
  breaklineChar: '|',
  footerPrefix: 'CLOSES:',
  skipEmptyScopes: true,
};
