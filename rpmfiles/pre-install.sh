#!/usr/bin/env bash
# If the bereavement group does not already exist, then create it
if getent group bereavement > /dev/null; then
   echo "Group bereavemnet exists"
else
   echo "Bereavement group does not exist, creating"
   groupadd bereavement
fi

# If the bereavement user does not already exist, then create it
if getent passwd bereavement > /dev/null; then
   echo "User bereavemnet exists"
else
   echo "Bereavement user does not exist, creating"
   useradd -g bereavement bereavement
fi

# Only keep three old builds on the server at any one time, plus the new deployment
#NoOptBuilds=`ls -ld /opt/bereavement/claim-manager/frontend-* | wc -l`
#echo "No of builds in opt = $NoOptBuilds"

#NoDeployBuilds=`ls -ld /var/deploy/BSP-CM-Frontend.* | wc -l`
#echo "No of builds in deploy = $NodeployBuilds"

#DeployToRemove=$((NoDeployBuilds - 3))
#OptToRemove=$((NoOptBuilds - 3))

#for optdir in `ls -d /opt/bereavement/claim-manager/frontend-* | head -$OptToRemove`
#do
#    rm -rf $optdir
#done

#for deploydir in `ls -d /var/deploy/BSP-CM-Frontend.* | head -$OptToRemove`
#do
#    rm -rf $deploydir
#done

