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

Relationship:
User<->Workspace
workspace<->project
Project<->Task
Workspace<->Message
Workspace<->Whiteboard

Database ER digram 
------------------

User
 │
 ├─────────────┐
 │             │
WorkspaceMember
 │
Workspace
 │
 ├──────────┬──────────┬──────────┐
 │          │          │
Project   Message  Whiteboard
 │                     │
Task          WhiteboardElement


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

├── Members

├── Chat

├── Whiteboard

├── Notifications

└── GitHub Integration