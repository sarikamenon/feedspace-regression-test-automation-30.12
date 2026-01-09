module.exports = {
  default: {
    // paths: ['features/**/*.feature'], // Commented out to allow CLI args to dictate scope
    require: ['step-definitions/**/*.js', 'support/**/*.js'],
    format: ['progress-bar', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
  },
};
