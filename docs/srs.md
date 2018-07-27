# (Simplified) System Requirement Software

## User

A user must be able to get registered inside the system.
A registered user in the system must have a set of roles:
-  admin: have access to diagnostic data and such, manage other users' roles.
-  editor/writer: have access to a dictionary, create a new dictionary, edit the dictionary data, create and words to a dictionary, etc...
-  reviewer: have access to a dictionary, approve dictionary and words created or edited by writer
-  basic/readonly: have access to a dictionary, notify the system for missing features, bugs, errors in the dictionary data, etc.

Although in the list previously mentioned user roles have repeated features across them, user roles must be designed to be composable (a user will be able to have a list of roles.

Unregistered users will be able to access dictionary data that will be marked as public.
