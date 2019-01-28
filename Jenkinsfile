#!/usr/bin/env groovy
////////////////////////////////////////////////////////////////////////////////
// Jenkins pipeline script in 'Script' format
////////////////////////////////////////////////////////////////////////////////
node {
    String NODE_CONFIG = 'Node 10.14.1 and NPM 6.4.1' // Needs to match a config setup in Jenkins

    // Get system date in YY.MM.DD format. Used to stamp/version our artifacts
    String BUILD_DATE = sh (script: 'date +%y.%m.%d',
                            returnStdout: true).trim()

    String VERSION = "${BUILD_DATE}.${BUILD_NUMBER}"

    // Clone the RBAC-AWS Jenkins utilities repo. NOTE: Assumes the
    // PIPELINE_UTILS_REPO is defined in Jenkins global config
    git credentialsId: "jenkins", url: PIPELINE_UTILS_REPO, branch: "master"

     // Get handle on the RBAC code scanner utilities
    def scanner_utils = load("scanner_utils.groovy")
    def docker_utils = load("docker_utils.groovy")

    ////////////////////////////////////////////////////////////////////////////
    // Clear old builds and setup initial directory structure
    ////////////////////////////////////////////////////////////////////////////
    stage('1. Preparation') {
        // Delete any and all contents of the workspace, as Jenkins doesn't seem
        // to do this by default for pipeline jobs
        cleanWs()
    }

    ////////////////////////////////////////////////////////////////////////////
    // Get code from GIT
    ////////////////////////////////////////////////////////////////////////////
    stage('2. Clone the project from gitlab') {
        // Checkout the project using the details in the Jenkins job
        checkout scm
    }

    ////////////////////////////////////////////////////////////////////////////
    // Run an install, then run quality/coverage tests
    ////////////////////////////////////////////////////////////////////////////
    stage('3. Build & test') {
        // Provide a Node container using the required Node & NPM config
        nodejs(NODE_CONFIG) {
            sh "npm install"

            // Run tests
            sh "npm test"
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Run code analysers
    ////////////////////////////////////////////////////////////////////////////
    stage('4. Code analysis (If selected)') {
        String scannerProject = "BSP"
        String scannerApp = "Claims-Frontend"
        String scannerProjectApp = scannerProject + ":" + scannerApp

        ////////////////////////////////////////////////////////////////////////
        // Blackduck
        ////////////////////////////////////////////////////////////////////////
        if (RUN_BLACKDUCK.equalsIgnoreCase("true")) {
            echo "# Running code through Blackduck"
            scanner_utils.blackDuckScan(scannerProjectApp)
        }

        else {
            echo "# Blackduck analysis NOT selected, so skipping that step"
        }

        ////////////////////////////////////////////////////////////////////////
        // Sonarqube
        ////////////////////////////////////////////////////////////////////////
        if (RUN_SONARQUBE.equalsIgnoreCase("true")) {
            echo "# Running code through SONARQUBE"
            // Pass the location of the root directories of the src & test branches with relation to the workspace
            // NOTE: We also rely on sonar-project.properties file in project root
            scanner_utils.sonarScanNode(scannerProjectApp, scannerProjectApp, "-Dsonar.tests=test -Dsonar.sources=src")
        }

        else {
            echo "# Sonarcube analysis NOT selected, so skipping that step"
        }

        ////////////////////////////////////////////////////////////////////////
        // Checkmarks
        ////////////////////////////////////////////////////////////////////////
        if (RUN_CHECKMARKS.equalsIgnoreCase("true")) {
            echo "# Running code through CHECKMARKS"
            docker_utils.login()
            scanner_utils.checkmarxScan("PDF", scannerApp, scannerProject, "Engineering")
        }

        else {
            echo "# Checkmarks analysis NOT selected, so skipping that step"
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Package
    ////////////////////////////////////////////////////////////////////////////
    stage('5. Package into RPM') {
        // Create a directory to hold the artifacts we want to package/deploy
        sh "mkdir -p var/deploy/BSP-CM-Frontend.${VERSION}"

        // Bundle our artifacts into a tarball and store in our deploy directory
        sh "tar acf var/deploy/BSP-CM-Frontend.${VERSION}/BSP-CM-Frontend.${VERSION}.tgz . \
                --exclude='./.*' \
                --exclude='./var' \
                --exclude='Jenkinsfile'"

        // Add the .service file to our deploy directory
        sh "cp ${WORKSPACE}/rpmfiles/bsp-cm.service var/deploy/BSP-CM-Frontend.${VERSION}/."

        // Build the RPM using the resources now sitting in the holding ('var') folder
        sh "/usr/local/bin/fpm -s dir \
                                           -t rpm \
                                           -n BSP-CM-Frontend \
                                           -v ${VERSION} \
                                           --before-install ${WORKSPACE}/rpmfiles/pre-install.sh \
                                           --after-install ${WORKSPACE}/rpmfiles/post-install.sh \
                                           var"
    }

    ////////////////////////////////////////////////////////////////////////////
    // Promote
    ////////////////////////////////////////////////////////////////////////////
    stage('6. Promote RPM to yum in S3') {
        // Create and switch to a new directory that we'll use to pull down
        // the existing bereavement yum repository
        dir('s3_sync') {
            // Synchronize our new folder with the S3 bucket containing our yum
            // repository (This pulls down all the yum repo files).
            sh "aws s3 sync s3://rbc-code-promotion-dev/RPMS/BSP . \
                            --only-show-errors"

            // Add our new RPM package to this folder
            sh "mv ${WORKSPACE}/*.rpm ."

            // Rebuild the yum repository to include our new RPM package"
            sh "createrepo -d ."

            // Re-sync the folder to push the rebuilt/updated repo back to the
            // S3 bucket
            sh "aws s3 sync . s3://rbc-code-promotion-dev/RPMS/BSP \
                            --sse AES256 \
                            --delete \
                            --only-show-errors"
        }
    }
}
