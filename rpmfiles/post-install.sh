#!/usr/bin/env bash
cd /var/deploy/BSP-CM-Frontend.%{version}
pwd

# If the bsp.service file is not already in place, then copy it to the required
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

version=%{version}
echo VERSION $version

# If there is no directory for the new release, create one
if [ ! -d /opt/bereavement/claim-manager/frontend-$version ]
then
        mkdir -p /opt/bereavement/claim-manager/frontend-$version
fi

echo "##########################"
echo
pwd
ls
echo
echo "##########################"

# Explode the tar into the new directory
tar -xf BSP-CM-Frontend.$version.tgz -C /opt/bereavement/claim-manager/frontend-$version

# Change the permissions of the deployment
chown -R bereavement:bereavement /opt/bereavement/claim-manager/frontend-$version

# If there is a current symbolic link to old/existing version, then delete it
if [ -L /opt/bereavement/claim-manager/frontend ]
then
rm /opt/bereavement/claim-manager/frontend
fi

# Create a symbolic link to the new version
ln -s /opt/bereavement/claim-manager/frontend-$version /opt/bereavement/claim-manager/frontend

# Restart the service
service bsp-cm restart

