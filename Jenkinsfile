pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    durabilityHint('PERFORMANCE_OPTIMIZED')
    skipDefaultCheckout(true)
  }

  environment {
    DOCKER_HOST = 'tcp://host.docker.internal:2375'
    IMAGE_TAG   = 'ymk/ui:latest'
    AMPLITUDE_API_KEY = credentials('amplitude-api-key')
  }

  stages {
    stage('checkout') {
      steps {
        checkout scm
      }
    }

    stage('build ui image') {
      steps {
        sh '''
          set -e
          docker -H "$DOCKER_HOST" build --no-cache \
            -t "$IMAGE_TAG" \
            --build-arg VITE_AMPLITUDE_API_KEY="${AMPLITUDE_API_KEY}" \
            .
          docker -H "$DOCKER_HOST" image inspect "$IMAGE_TAG" --format "ui image={{.Id}} created={{.Created}}"
        '''
      }
    }

    stage('deploy ui') {
      steps {
        sh '''
          set -e
          docker compose -f /workspace/ymk/docker-compose.yml up -d --force-recreate ui
        '''
      }
    }
  }

  post {
    success { echo 'UI deploy successful!' }
    failure { echo 'UI deploy failed!' }
  }
}
