#!/usr/bin/env groovy

node(label: "jenkins-slave") {
   final deployGitBranch = env.BRANCH_NAME
   try {
     stage("Checkout") {
       final scmVars = checkout scm
        def myGroovyVariable = "Hello"
        env.anEnvVariable = "Goodbye"
        sh "echo Display a groovy variable ${myGroovyVariable}"
        sh "echo Display an env variable \$anEnvVariable"
     }
     if (deployGitBranch == 'master') {
        stage("Publish") {
           sh 'echo Publishing image...'
        }
        stage("Deploy") {
           sh 'echo Deploying project...'
        }
     }
   } catch (e) {
     throw e
   } finally {
      stage("Clean") {
        sh 'echo Clean my images and containers'
      }
   }
}
