%define _unpackaged_files_terminate_build 0

Name: Bereavement-Claim-Manager

Summary: Bereavement Support Payments, Claim Management Frontend

# The following 'VERSION' & 'RELEASE' strings will be replaced with the current
# version and release values of the build when the Jenkins job is run.
Version: [VERSION]
Release: [RELEASE]

License: DWP
Distribution: DWP
Group: Application/System

Provides: claim-manager-frontend
# Requires: rh-nodejs4-nodejs = 8.9.1

autoprov: yes
autoreq: yes
Prefix: /

BuildRoot: /var/lib/jenkins/rpmbuild/SOURCES

%description
Bereavement Support Payment, Claim Management Frontend.  This is a Node.js
application that provides a web based front end, allowing agents to create &
maintain BSP claims.  The frontend interfaces with the related backend
service in order to persist the claim details.

# To be changed later depending on the test/dev structure.
%define _rpmdir /var/lib/jenkins/rpmbuild/RPMS
%define _topdir /var/lib/jenkins/rpmbuild/
%define _tmpdir /var/lib/jenkins/rpmbuild/temp

%prep

%files
/var/deploy/%{name}.%{version}.%{release}/bsp-cm.service
/var/deploy/%{name}.%{version}.%{release}/BSP-CM-Frontend-%{version}.%{release}.tgz

%pre
##########
# Create Bereavement user/group if they don't already exist
##########
if getent group bereavement > /dev/null; then
    echo "Group bereavemnet exists"
else
    echo "Bereavement group does not exist, creating"
    groupadd bereavement
fi

if getent passwd bereavement > /dev/null; then
    echo "User bereavemnet exists"
else
    echo "Bereavement user does not exist, creating"
    useradd -g bereavement bereavement
fi

##########
# Only keep three old builds on the server at any one time, plus the new deployment
##########
NoOptBuilds=`ls -ld /opt/bereavement/claim-manager/frontend-* | wc -l`
echo "No of builds in opt = $NoOptBuilds"

NoDeployBuilds=`ls -ld /var/deploy/Bereavement.* | wc -l`
echo "No of builds in deploy = $NodeployBuilds"

DeployToRemove=$((NoDeployBuilds - 3))
OptToRemove=$((NoOptBuilds - 3))

for optdir in `ls -d /opt/bereavement/claim-manager/frontend-* | head -$OptToRemove`
do
    rm -rf $optdir
done

for deploydir in `ls -d /var/deploy/Bereavement.* | head -$OptToRemove`
do
    rm -rf $deploydir
done

%post
# postinstall scriptlet (using /bin/sh):
mkdir -p /var/deploy/%{name}.%{version}.%{release}
cd /var/deploy/%{name}.%{version}.%{release}

# If the bsp-cm.service file is not already in place, then copy it to the required
# location
if [ -L /etc/systemd/system/multi-user.target.wants/bsp-cm.service ]
then
    systemctl disable bsp-cm
elif [ -f /etc/systemd/system/multi-user.target.wants/bsp-cm.service ]
then
    rm -f /etc/systemd/system/multi-user.target.wants/bsp-cm.service
fi

# Change service location so we can use systemctl disable
cp bsp-cm.service /usr/lib/systemd/system/.
systemctl daemon-reload
systemctl enable bsp-cm

version=`ls BSP-CM-Frontend* | cut -f3 -d- | cut -f1,2 -d.`

# If there is no directory for the new release, create one
if [ ! -d /opt/bereavement/claim-manager/frontend-$version ]
then
    mkdir -p /opt/bereavement/claim-manager/frontend-$version
fi

# Explode the tar into the new directory
tar -xf BSP-CM-Frontend-$version.tgz -C /opt/bereavement/claim-manager/frontend-$version

# Change the permissions of the deployment
chown -R bereavement:bereavement /opt/bereavement/claim-manager/frontend-$version

# If there is a current symbolic link to old/existing version, then delete it
if [ -L /opt/bereavement/claim-manager/frontend ]
then
    rm /opt/bereavement/claim-manager/agent-frontend
fi

# Create a symbolic link to the new version
ln -s /opt/bereavement/claim-manager/frontend-$version /opt/bereavement/claim-manager/frontend

# Restart the service
service bsp-cm restart
