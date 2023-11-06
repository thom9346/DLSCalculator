pipeline {
    agent any

    triggers {
        pollSCM("* * * * *")
    }
    stages {
        stage("Build") {
            steps {
                bat "docker-compose build"
            }
        }
        stage("Deliver") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    bat 'docker login -u %USERNAME% -p %PASSWORD%'
                    bat "docker-compose push"
                }
            }
        }
        stage("Deploy to Docker Swarm") {
            steps {
                bat "docker service update angular-app --image thohol02/calculator-angularapp:$BUILD_NUMBER || docker service create --name angular-service --replicas 1 --publish 4200:4200 thohol02/calculator-angularapp:$BUILD_NUMBER"
                bat "docker service update nginx-proxy --image thohol02/calculator-nginx:$BUILD_NUMBER || docker service create --name nginx-proxy --replicas 1 --publish 8081:8081 thohol02/calculator-nginx:$BUILD_NUMBER"
                bat "docker service update history-db --image mcr.microsoft.com/mssql/server:2019-latest || docker service create --name history-db --replicas 1 --publish 1433:1433 mcr.microsoft.com/mssql/server:2019-latest"
                bat "docker service update history-service --image thohol02/calculator-historyservice:$BUILD_NUMBER || docker service create --name history-service --replicas 1 --publish 8280:80 thohol02/calculator-historyservice:$BUILD_NUMBER"
                bat "docker service update minus-service --image thohol02/calculator-minusservice:$BUILD_NUMBER || docker service create --name minus-service --replicas 1 --publish 8180:80 thohol02/calculator-minusservice:$BUILD_NUMBER"
                bat "docker service update plus-service --image thohol02/calculator-plusservice:$BUILD_NUMBER || docker service create --name plus-service --replicas 1 --publish 8380:80 thohol02/calculator-plusservice:$BUILD_NUMBER"
            }
        }

    }
}