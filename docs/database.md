Required tables:
---------------
User

Workspace

WorkspaceMember

Project

Task

Message

Whiteboard

WhiteboardElement

Notification

GithubConnection


Database ER digram 
------------------

User
  │
  ├── WorkspaceMember
  │        │
  │        ▼
  │    Workspace
  │        │
  │   ┌────┼────┐
  │   │    │    │
  ▼   ▼    ▼    ▼
Project Message Whiteboard
  │              │
  ▼              ▼
Task      WhiteboardElement

User
 ├── Notification
 └── GithubConnection


Database
--------

User

↓

Workspace

↓

Project

↓

Task


Collection Hireachy
-------------------

Workspace
 ├ Members
 ├ Projects
 │    └ Tasks
 ├ Chat
 ├ Whiteboards
 ├ Notifications
 └ Github Integration

# Relationships

User ↔ Workspace (M:N)

Workspace ↔ Project (1:N)

Project ↔ Task (1:N)

User ↔ Task (1:N)

Workspace ↔ Message (1:N)

User ↔ Message (1:N)

Workspace ↔ Whiteboard (1:N)

Whiteboard ↔ WhiteboardElement (1:N)

User ↔ Notification (1:N)

User ↔ GithubConnection (1:1)

Table Definition
----------------

## User

Fields:

id
name
email
passwordHash
avatar
bio
githubUrl
linkedinUrl
createdAt
updatedAt

Relationships:

- Belongs to many Workspaces (through WorkspaceMember)
- Has many Tasks
- Has many Messages
- Has many Notifications
- Has one GithubConnection

## Workspace

Fields:

id
name
description
ownerId
createdAt
updatedAt

Relationships:

- Has many Members
- Has many Projects
- Has many Messages
- Has many Whiteboards

## WorkspaceMember

Fields:

id
workspaceId
userId
role -------------(ADMIN,OWNER,MEMBER)
joinedAt

Relationships:

- Belongs to User
- Belongs to Workspace

## Project

Fields:

id
workspaceId
name
description
createdBy
createdAt
updatedAt

Relationships:

- Belongs to Workspace
- Has many Tasks
- Created by User

## Task

Fields:

id
projectId
title
description
status --------(TODO,IN_PROGRESS,REVIEW,DONE)
priority -------------(LOW,MEDIUM,HIGH,URGENT)
assigneeId
createdBy
dueDate
createdAt
updatedAt

Relationships:

- Belongs to Project
- Assigned to User
- Created by User

## Message

Fields:

id
workspaceId
senderId
content
createdAt
updatedAt

Relationships:

- Belongs to Workspace
- Sent by User

## Whiteboard

Fields:

id
workspaceId
name
createdBy
createdAt
updatedAt

Relationships:

- Belongs to Workspace
- Has many WhiteboardElements
- Created by User

## WhiteboardElement

Fields:

id
whiteboardId
type ----------------(RECTANGLE,CIRCLE,ARROW,LINE,TEXT,STICKY_NOTE,IMAGE)
payload---------------(json format--- x,y,width,height,rotation,colour)
createdBy
createdAt
updatedAt

Relationships:

- Belongs to Whiteboard
- Created by User

## Notification

Fields:

id
userId
title
message
type ----------(TASK_ASSIGNED,TASK_UPDATED,PROJECT_CREATED,WORKSPACE_INVITE,MESSAGE_RECEIVED,GITHUB_EVENT)
isRead
createdAt

Relationships:

- Belongs to User

## GithubConnection

Fields:

id
userId
githubId
username
avatarUrl
accessToken
connectedAt
updatedAt

Relationships:

- Belongs to User