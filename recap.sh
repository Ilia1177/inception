chown


# list all groups
cat /etc/group
getent group

# check user's group
groups					# Current user's groups
groups username			# Specific user's groups
id username				# Detailed user/group info with UIDs/GIDs
whoami && groups		# Current user and their groups

# find specific group
grep groupname /etc/group
getent group groupname
cat /etc/group | grep incept

# List group members
getent group groupname
grep "^groupname:" /etc/group
members groupname        # If available (not on all systems)

# Create new group
addgroup groupname              # Debian/Ubuntu/Alpine
groupadd groupname              # RedHat/CentOS
addgroup groupname 2>/dev/null || true  # Silent creation (ignore if exists)

# Create group with specific GID
addgroup -g 1000 groupname      # Alpine/Debian
groupadd -g 1000 groupname      # RedHat/CentOS

# Add user to group
addgroup username groupname     # Alpine/Debian
usermod -aG groupname username  # Add to additional group (preserves other groups)
usermod -G groupname username   # Set as only group (removes from others)
gpasswd -a username groupname   # Alternative method

# Remove user from group
deluser username groupname      # Debian/Ubuntu
gpasswd -d username groupname   # Generic method
usermod -G group1,group2 username  # Set specific groups (removes from unlisted)

# Create user with specific group
adduser -D -G groupname username        # Alpine
useradd -g primarygroup -G extragroups username  # Generic

# Remove group
delgroup groupname              # Debian/Ubuntu/Alpine
groupdel groupname              # RedHat/CentOS

#----------------------------------
## File/Directory Group Operations

# Change group ownership
chgrp groupname file            # Single file
chgrp -R groupname directory    # Recursive
chown user:group file           # Change user and group
chown :group file               # Change only group

# Set group permissions
chmod g+w file                  # Add group write
chmod g+rw file                 # Add group read/write
chmod 774 directory             # rwxrwxr-- (group can read/write/execute)
chmod g+s directory             # Set group sticky bit (new files inherit group)

# Switch to different group (if member)
newgrp groupname                # Switch primary group for current session
sg groupname                    # Run command with different group
sg groupname -c "command"       # Run specific command as group
