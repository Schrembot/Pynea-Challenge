# Built REST API to ensure the NestJS part was working and begin understanding framework

# REST API tested - satisfied here that the service is doing it's job

    # OpenAPI setup: http://localhost:3000/api/docs
    # A "clearDeletedUsers" method exists to clear out the DB which shouldn't be sent into production, need to work on that
    # Ready for some HATEOS inputs

# DELETE /users/:id is a soft-delete for the purposes of a Social Network based on:

    # Don't want to break entities in collaboration environment, posts etc.
    # Local laws may apply which are more/less strict on what to keep and what to delete
    # Soft-delete anonymises Users.  Emails are changed to {id}@DELETED.COM and password changed to prevent log ins

# GraphQL

    # Don't know if doing the right approach best practice.
    # Unsure of best approach to remove 'password' from user(s) response for security

    # Query & Mutations:
        # createUser(data:CreateUserDto)
        # listUsers
        # getUser(id: "...")
        # deleteUser(id: "...")
        # updateUser(id: "...", data:UpdateUserDto)
