node {
    def nodeHome = tool name: 'node-8.5.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    def HTTP_PROXY=http://bas-proxy-03.akka.eu:9090
    def HTTPS_PROXY=https://bas-proxy-03.akka.eu:9090
    env.PATH = "${nodeHome}/bin:${env.PATH}:$HTTP_PROXY:$HTTPS_PROXY"

    stage('check tools') {
        sh "node -v"
        sh "npm -v"
        sh "npm config set proxy http://bas-proxy-03.akka.eu:9090"
        sh "npm config set https-proxy http://bas-proxy-03.akka.eu:9090"
    }

    #stage('checkout') {
    #    checkout scm
    #}
    stage('checkout') {
        checkout([
          $class: 'GitSCM', branches: [[name: '*/master']],
          userRemoteConfigs: [[url: 'ssh://git@gitlab.akka.eu:22522/stif-reflex/migration-frontend.git',credentialsId:'jean-philippe.janece']]
        ])
    }
    
    stage('npm install') {
        sh "cd frontend_proto; npm install --silent"
    }

    stage('unit tests') {
        sh "unset HTTP_PROXY; unset HTTPS_PROXY; cd frontend_proto; rm ./test-output/tests-results.xml; ng test --progress=false"
    }

    #stage('protractor tests') {
    #    sh "cd frontend_proto; npm run e2e"
    #}

    #stage('deploying') {
    #    sh '''
    #    # exit 1 on errors
    #    set -e

        # deal with remote
    #    echo "Checking if remote exists..."
    #    if ! git ls-remote heroku; then
    #      echo "Adding heroku remote..."
    #      git remote add heroku https://git.heroku.com/evening-meadow-46789.git
    #    fi

        # push only origin/master to heroku/master - will do nothing if
        # master doesn't change.
        #echo "Updating heroku master branch..."
        #git push heroku origin/master:master
        #'''
    #}
}