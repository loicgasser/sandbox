#!/usr/bin/env groovy

node(label: "jenkins-slave") {
   final deployGitBranch = env.BRANCH_NAME
   try {
     stage("Checkout") {
       final scmVars = checkout scm
     }
   } catch (e) {
     throw e
   } finally {
      stage("Clean") {
        sh 'echo Clean my images and containers'
      }
   }
}
