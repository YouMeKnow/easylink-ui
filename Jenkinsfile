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

    stage('preflight') {
      steps {
        sh '''
          set -eu
          echo "[preflight] whoami: $(whoami)"
          echo "[preflight] pwd: $PWD"
          echo "[preflight] DOCKER_HOST=${DOCKER_HOST:-<unset>}"

          echo "[preflight] docker version"
          docker -H "$DOCKER_HOST" version

          echo "[preflight] compose availability"
          (docker compose version || true)
          (docker-compose --version || true)

          echo "[preflight] /workspace/ymk listing"
          ls -la /workspace || true
          ls -la /workspace/ymk || true
          ls -la /workspace/ymk/docker-compose.yml || true
        '''
      }
    }

    stage('build ui image') {
      steps {
        sh '''
          set -eu
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
          if docker compose version >/dev/null 2>&1; then
            DC="docker compose"
          elif command -v docker-compose >/dev/null 2>&1; then
            DC="docker-compose"
          else
            echo "[error] docker compose not available in this agent"
            exit 1
          fi

          DOCKER_HOST="$DOCKER_HOST" $DC -f /workspace/ymk/docker-compose.yml up -d --force-recreate ui
        '''
      }
    }
  }

  post {
    success {
      echo 'UI deploy successful!'
    }
    failure {
      echo 'UI deploy failed!'
    }
  }
}
