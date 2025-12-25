pipeline {
    triggers {
        cron('H 9 * * *')
    }
    
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
            args '-u root:root'
        }
    }
    
    environment {
        HOME = "${WORKSPACE}"
        npm_config_cache = "${WORKSPACE}/.npm"
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh 'npm test'
                    } catch (Exception e) {
                        echo "Tests failed, but continuing to generate report"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Generate Report') {
            steps {
                sh 'npm run test:report'
            }
        }
    }
    
    post {
        always {
            // Archive test results
            archiveArtifacts artifacts: 'cucumber-report.html,report.json', allowEmptyArchive: true
            
            // Archive screenshots if they exist
            archiveArtifacts artifacts: 'screenshots/**/*', allowEmptyArchive: true
            
            // Publish HTML report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: '.',
                reportFiles: 'cucumber-report.html',
                reportName: 'Cucumber Test Report'
            ])
        }
        
        success {
            echo 'Pipeline succeeded!'
        }
        
        failure {
            echo 'Pipeline failed!'
        }
        
        unstable {
            echo 'Pipeline is unstable - some tests failed'
        }
    }
}
