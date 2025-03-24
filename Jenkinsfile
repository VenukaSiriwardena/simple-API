pipeline {
    agent any 
    
    stages { 
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/VenukaSiriwardena/simple-API'
                }
            }
        }
        stage('Build Docker Image') {
            steps {  
                bat 'docker build -t venukasiriwardena/simple-api:%BUILD_NUMBER% .'
            }
        }
        stage('Login to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'api-key', variable: 'api-password')]) {
                    script {
                        bat "docker login -u venukasiriwardena -p %api-password%"
                    }
                }
            }
        }
        
        stage('Push Image') {
            steps {
                bat 'docker push venukasiriwardena/simple-api:%BUILD_NUMBER%'
            }
        }
    }
    post {
        always {
            bat 'docker logout'
        }
    }
}