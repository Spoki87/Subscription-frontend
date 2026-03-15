pipeline {
    agent any

    environment {
        IMAGE_NAME = 'subscription-front'
        CONTAINER_NAME = 'subscription-front'
        PORT = '8002'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${PORT}:80 \
                        ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "Deployed successfully on port ${PORT}"
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
