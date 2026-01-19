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
          echo "[preflight] DOCKER_HOST=$DOCKER_HOST"

          docker -H "$DOCKER_HOST" version
          docker -H "$DOCKER_HOST" compose version

          COMPOSE_FILE=/workspace/ymk/docker-compose.yml
          echo "[preflight] COMPOSE_FILE=$COMPOSE_FILE"

          test -f "$COMPOSE_FILE"
          docker -H "$DOCKER_HOST" compose -f "$COMPOSE_FILE" config >/dev/null

          # persist for later stages
          printf "COMPOSE_FILE=%s\n" "$COMPOSE_FILE" > .compose_root.env

          echo "[preflight] OK"
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
          set -eu
          . ./.compose_root.env
          echo "[deploy] COMPOSE_FILE=$COMPOSE_FILE"

          # hard remove old service container (no interactive prompts ever)
          docker -H "$DOCKER_HOST" compose -p ymk -f "$COMPOSE_FILE" rm -sf ui || true

          # recreate only ui with latest image
          docker -H "$DOCKER_HOST" compose -p ymk -f "$COMPOSE_FILE" up -d --no-deps --force-recreate ui

          docker -H "$DOCKER_HOST" compose -p ymk -f "$COMPOSE_FILE" ps
        '''
      }
    }
  }

  post {
    success { echo 'UI deploy successful!' }
    failure { echo 'UI deploy failed!' }
    always {
      sh '''
        set +e
        echo "[post] docker ps (top 30)"
        docker -H "$DOCKER_HOST" ps -a > /tmp/ps.txt || true
        head -n 30 /tmp/ps.txt || true
      '''
    }
  }
}
