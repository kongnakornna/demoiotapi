pipeline {
    agent any
    
    environment {
        // Docker Configuration
        DOCKER_IMAGE = "icmonapi"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_LATEST = "latest"
        REGISTRY = "kongnakornna"
        
        // Application Configuration
        APP_NAME = "icmonapi"
        APP_PORT = "3003"
        CONTAINER_NAME = "backendcmon"
        
        // Deployment Configuration
        DEPLOY_ENV = "${env.BRANCH_NAME == 'main' ? 'production' : 'development'}"
        // FIXED: แก้ชื่อไฟล์ให้ตรงกับที่แนบมา
        COMPOSE_FILE_DEV = "docker-compose-development.yml"
        COMPOSE_FILE_PROD = "docker-compose-production.yml"
        
        // Git Configuration
        GIT_REPO = "https://github.com/kongnakornna/icmonapi.git"
        GIT_BRANCH = "main"
        
        // Paths
        BACKUP_DIR = "postgres-backup"
        LOG_DIR = "logs"
        
        // Notification
        SLACK_CHANNEL = "#deployments"
        EMAIL_RECIPIENTS = "kongnakornna@gmail.com"
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }
    
    parameters {
        choice(
            name: 'DEPLOYMENT_TYPE',
            choices: ['development', 'staging', 'production'],
            description: 'Select deployment environment'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        )
        booleanParam(
            name: 'FORCE_DEPLOY',
            defaultValue: false,
            description: 'Force deployment even if tests fail'
        )
        booleanParam(
            name: 'CLEANUP_IMAGES',
            defaultValue: true,
            description: 'Cleanup old Docker images after deployment'
        )
    }
    
    stages {
        stage('Initialize') {
            steps {
                script {
                    echo """
                    ==========================================
                    Starting Pipeline for ${APP_NAME}
                    ==========================================
                    Build Number: ${env.BUILD_NUMBER}
                    Branch: ${env.BRANCH_NAME}
                    Deployment: ${params.DEPLOYMENT_TYPE}
                    Jenkins User: ${env.BUILD_USER ?: 'System'}
                    ==========================================
                    """
                    cleanWs()
                }
            }
        }
        
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out code from ${GIT_REPO}"
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${GIT_BRANCH}"]],
                        userRemoteConfigs: [[url: GIT_REPO]],
                        extensions: [
                            [$class: 'CleanCheckout'],
                            [$class: 'CloneOption', depth: 1, noTags: false, shallow: true]
                        ]
                    ])
                    
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    env.GIT_AUTHOR = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                }
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    echo "Setting up environment for ${params.DEPLOYMENT_TYPE}"
                    sh """
                        mkdir -p data logs ${BACKUP_DIR} init-scripts nginx/conf.d nginx/ssl
                        
                        if [ -f .env.${params.DEPLOYMENT_TYPE} ]; then
                            cp .env.${params.DEPLOYMENT_TYPE} .env
                            echo "Using .env.${params.DEPLOYMENT_TYPE}"
                        elif [ -f file.env.production ] && [ "${params.DEPLOYMENT_TYPE}" = "production" ]; then
                            cp file.env.production .env
                            echo "Using file.env.production"
                        elif [ -f file.env.development ] && [ "${params.DEPLOYMENT_TYPE}" = "development" ]; then
                            cp file.env.development .env
                            echo "Using file.env.development"
                        else
                            echo "Warning: No specific environment file found, looking for generic .env"
                        fi
                        
                        chmod -R 755 data logs ${BACKUP_DIR}
                    """
                }
            }
        }
        
        stage('Dependency Check') {
            steps {
                script {
                    sh """
                        if [ ! -f package.json ]; then
                            echo "Error: package.json not found"
                            exit 1
                        fi
                    """
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                    // FIXED: ใช้ไฟล์ Compose ที่ถูกต้องตาม Environment
                    def composeFile = (params.DEPLOYMENT_TYPE == 'production') ? env.COMPOSE_FILE_PROD : env.COMPOSE_FILE_DEV
                    
                    sh """
                        export BUILD_TARGET=\$( [ "${params.DEPLOYMENT_TYPE}" = "production" ] && echo "production" || echo "development" )
                        
                        docker-compose -f ${composeFile} build
                        
                        docker tag ${DOCKER_IMAGE}-${params.DEPLOYMENT_TYPE}:latest ${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG} || echo "Tagging failed, checking image name..."
                    """
                }
            }
        }
        
        // ... (Skipping Test/Scan stages for brevity, logic remains same) ...

        stage('Deploy') {
            steps {
                script {
                    echo "Deploying application to ${params.DEPLOYMENT_TYPE}"
                    
                    if (params.DEPLOYMENT_TYPE == 'production') {
                        sh """
                            echo "Starting production deployment..."
                            
                            # Stop existing container gracefully
                            if docker ps -a | grep -q ${CONTAINER_NAME}; then
                                docker stop ${CONTAINER_NAME} || true
                                docker rm ${CONTAINER_NAME} || true
                            fi
                            
                            # FIXED: ใช้ไฟล์ production โดยตรง ไม่ต้องซ้อน -f หลายไฟล์ถ้าไฟล์นั้นสมบูรณ์แล้ว
                            docker-compose -f ${COMPOSE_FILE_PROD} up -d --remove-orphans
                            
                            echo "Production deployment initiated"
                        """
                    } else {
                        sh """
                            echo "Starting ${params.DEPLOYMENT_TYPE} deployment..."
                            docker-compose -f ${COMPOSE_FILE_DEV} down || true
                            docker-compose -f ${COMPOSE_FILE_DEV} up -d
                        """
                    }
                    
                    // Wait for application
                    sh """
                        echo "Waiting for application to be ready..."
                        sleep 10
                        # Add health check logic here
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                cleanWs()
            }
        }
    }
}
