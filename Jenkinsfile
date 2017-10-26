node {
    def nodeHome = tool name: 'node-8.5.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"

    stage('check tools') {
        bash "node -v"
        bash "npm -v"
        bash "npm config set proxy http://bas-proxy-03.akka.eu:9090"
        bash "npm config set https-proxy http://bas-proxy-03.akka.eu:9090"
    }

    stage('checkout') {
        checkout([
          $class: 'GitSCM', branches: [[name: '*/master']],
          userRemoteConfigs: [[url: 'ssh://git@gitlab.akka.eu:22522/stif-reflex/migration-frontend.git',credentialsId:'jean-philippe.janece']]
        ])
    }
    
    stage('npm install') {
        bash "export HTTP_PROXY=http://bas-proxy-03.akka.eu:9090; export HTTPS_PROXY=https://bas-proxy-03.akka.eu:9090; cd frontend_proto; npm install --silent"
    }

    stage('unit tests') {
        bash "unset HTTP_PROXY; unset HTTPS_PROXY; cd frontend_proto; [[ -f ./test-output/tests-results.xml ]] && rm ./test-output/tests-results.xml; ng test --progress=false"
    }

}