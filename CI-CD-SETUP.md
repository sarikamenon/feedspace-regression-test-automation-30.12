# CI/CD Integration Guide for Playwright BDD Cucumber Tests

This guide explains how to set up Continuous Integration and Continuous Deployment (CI/CD) for your Playwright BDD Cucumber test automation project.

## 📋 Table of Contents

- [Overview](#overview)
- [GitHub Actions Setup](#github-actions-setup)
- [GitLab CI Setup](#gitlab-ci-setup)
- [Jenkins Setup](#jenkins-setup)
- [Azure DevOps Setup](#azure-devops-setup)
- [Environment Variables](#environment-variables)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

Your project includes pre-configured CI/CD files for multiple platforms:

- **GitHub Actions**: `.github/workflows/playwright-tests.yml`
- **GitLab CI**: `.gitlab-ci.yml`
- **Jenkins**: `Jenkinsfile`
- **Scheduled Tests**: `.github/workflows/scheduled-tests.yml`

---

## GitHub Actions Setup

### Quick Start

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Automatic Execution**:
   - Tests run automatically on every push to `main`, `master`, or `develop` branches
   - Tests run on every pull request
   - You can also trigger manually from the "Actions" tab

3. **View Results**:
   - Go to your repository on GitHub
   - Click the "Actions" tab
   - Select a workflow run to see results
   - Download test reports from "Artifacts" section

### Features

✅ Runs on every push and pull request  
✅ Generates HTML and JSON reports  
✅ Stores test artifacts for 30 days  
✅ Supports parallel test execution  
✅ Manual trigger option  
✅ Scheduled nightly runs (optional)

### Parallel Execution

To run tests in parallel, edit `.github/workflows/playwright-tests.yml`:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3]  # Run 3 parallel jobs
```

---

## GitLab CI Setup

### Quick Start

1. **Push your code to GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD setup"
   git remote add origin https://gitlab.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Automatic Execution**:
   - Pipeline runs automatically on every push
   - View results in "CI/CD" → "Pipelines"

3. **View Results**:
   - Go to "CI/CD" → "Pipelines"
   - Click on a pipeline to see job details
   - Download artifacts from the job page

### Features

✅ Docker-based execution  
✅ Caching for faster builds  
✅ Artifact storage for 1 month  
✅ Parallel execution support  
✅ Automatic browser installation

---

## Jenkins Setup

### Prerequisites

- Jenkins server with Docker support
- Docker Pipeline plugin installed
- HTML Publisher plugin installed

### Quick Start

1. **Create a new Pipeline job**:
   - Go to Jenkins dashboard
   - Click "New Item"
   - Enter a name and select "Pipeline"
   - Click "OK"

2. **Configure the Pipeline**:
   - Scroll to "Pipeline" section
   - Select "Pipeline script from SCM"
   - Choose your SCM (Git)
   - Enter your repository URL
   - Set "Script Path" to `Jenkinsfile`
   - Save

3. **Run the Pipeline**:
   - Click "Build Now"
   - View results in the build console output
   - Access HTML report from "Cucumber Test Report" link

### Features

✅ Docker-based execution  
✅ HTML report publishing  
✅ Artifact archiving  
✅ Screenshot capture  
✅ Build status tracking

---

## Azure DevOps Setup

Create `azure-pipelines.yml` in your project root:

```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm ci
  displayName: 'Install dependencies'

- script: |
    npx playwright install --with-deps chromium
  displayName: 'Install Playwright browsers'

- script: |
    npm test
  displayName: 'Run Cucumber tests'
  continueOnError: true

- script: |
    npm run test:report
  displayName: 'Generate HTML report'
  condition: always()

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'report.json'
  condition: always()

- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: 'cucumber-report.html'
    artifactName: 'test-reports'
  condition: always()
```

---

## Environment Variables

### Setting Up Secrets

Different platforms handle secrets differently:

#### GitHub Actions

1. Go to repository "Settings" → "Secrets and variables" → "Actions"
2. Click "New repository secret"
3. Add your secrets (e.g., TEST_EMAIL, etc.)

Access in workflow:
```yaml
env:

```

#### GitLab CI

1. Go to "Settings" → "CI/CD" → "Variables"
2. Click "Add variable"
3. Add your secrets

Access in `.gitlab-ci.yml`:
```yaml
variables:

```

#### Jenkins

1. Go to "Manage Jenkins" → "Credentials"
2. Add credentials
3. Reference in Jenkinsfile:

```groovy
environment {

}
```

### Common Environment Variables

```bash
# Email for testing
TEST_EMAIL=sarika.tier4@gmail.com

# Base URL for application
BASE_URL=https://app.feedspace.io

# Timeout settings
DEFAULT_TIMEOUT=30000

# Browser settings
HEADLESS=true
```

---

## Best Practices

### 1. **Use Caching**

Speed up builds by caching dependencies:

**GitHub Actions**:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

**GitLab CI**:
```yaml
cache:
  paths:
    - .npm/
    - node_modules/
```

### 2. **Fail Fast Strategy**

Configure whether to stop all jobs when one fails:

```yaml
strategy:
  fail-fast: false  # Continue other jobs even if one fails
```

### 3. **Artifact Retention**

Set appropriate retention periods:

```yaml
retention-days: 30  # Keep artifacts for 30 days
```

### 4. **Parallel Execution**

Split tests across multiple runners for faster execution:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]  # 4 parallel jobs
```

### 5. **Conditional Execution**

Run certain steps only on specific conditions:

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: npm run deploy:staging
```

### 6. **Notifications**

Set up notifications for test failures:

**Slack Integration** (GitHub Actions):
```yaml
- name: Slack Notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Troubleshooting

### Common Issues

#### 1. **Browser Installation Fails**

**Solution**: Ensure you're using the correct Playwright image or installing dependencies:

```bash
npx playwright install --with-deps chromium
```

#### 2. **Tests Timeout**

**Solution**: Increase timeout in workflow:

```yaml
jobs:
  test:
    timeout-minutes: 60  # Increase from default 30
```

#### 3. **Artifacts Not Uploading**

**Solution**: Check paths and ensure files exist:

```yaml
- uses: actions/upload-artifact@v4
  with:
    path: |
      cucumber-report.html
      report.json
    if-no-files-found: warn  # or 'ignore'
```

#### 4. **Permission Denied Errors**

**Solution**: For Docker-based CI, ensure correct user permissions:

```yaml
args: '-u root:root'
```

#### 5. **npm ci Fails**

**Solution**: Ensure `package-lock.json` is committed:

```bash
git add package-lock.json
git commit -m "Add package-lock.json"
```

---

## Advanced Configuration

### Running Specific Features

Modify test command to run specific features:

```yaml
- name: Run specific feature
  run: npx cucumber-js features/import.feature
```

### Browser Selection

Run tests on multiple browsers:

```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
steps:
  - run: npx playwright install --with-deps ${{ matrix.browser }}
```

### Test Reporting

Integrate with test reporting services:

**Allure Reports**:
```bash
npm install --save-dev allure-commandline
npx allure generate allure-results --clean -o allure-report
```

**Cucumber HTML Reporter**:
```bash
npm install --save-dev cucumber-html-reporter
```

---

## Next Steps

1. ✅ Choose your CI/CD platform
2. ✅ Push code to your repository
3. ✅ Configure environment variables/secrets
4. ✅ Verify first pipeline run
5. ✅ Set up notifications (optional)
6. ✅ Configure scheduled runs (optional)

---

## Support

For issues or questions:
- Check the [Playwright Documentation](https://playwright.dev/docs/ci)
- Review [Cucumber.js CI Guide](https://github.com/cucumber/cucumber-js/blob/main/docs/ci.md)
- Platform-specific CI/CD documentation

---

**Happy Testing! 🚀**
