Tech Stack
----------
Frontend

Next.js
TypeScript
Tailwind
Shadcn
Zustand
React Query

Backend

Node.js
Express
TypeScript

Database

PostgreSQL
Prisma

Cache

Redis

Realtime

Socket.IO

Storage

Cloudinary

Infrastructure

Docker
Nginx

User onboarding flow
--------------------
User Opens DevFlow

↓
Landing Page

↓
Register / Login

↓
JWT Generated

↓
User Dashboard

↓
Create Workspace OR Join Workspace

↓
Workspace Home




AUthentication Flow
------------------
User
↓
Frontend Form
↓
POST /auth/register
↓
Validation (Zod)
↓
Hash Password (bcrypt)
↓
PostgreSQL
↓
Generate JWT
↓
Store Refresh Token
↓
Response
↓
Frontend

Project Flow
------------
Workspace

↓
Create Project

↓
Project Dashboard

↓
Create Tasks

↓
Assign Members

↓
Track Progress

Task Management flow 
--------------------
Project

↓
Create Task

↓
Assign User

↓
Update Status

↓
Mark Complete



Chat Architecture 
-----------------
User A
↓
Socket.IO Client
↓
Socket.IO Server
↓
Workspace Room
↓
Store Message
↓
PostgreSQL
↓
Broadcast
↓
User B


WhiteBoard Architecture 
-----------------------

Draw
↓
Socket Event
↓
Whiteboard Service
↓
PostgreSQL
↓
Socket Broadcast
↓
Connected Clients

Workspace Flow 
--------------

User
↓
Create Workspace
↓
Invite Members
↓
Assign Roles
↓
Create Project
↓
Create Tasks
↓
Collaborate

REQUEST Lifecycle Flow
----------------------

Browser

↓
Next.js

↓
Axios

↓
Express Route

↓
Controller

↓
Service

↓
Prisma

↓
PostgreSQL

↓
Response

↓
Frontend

Notification Flow
-----------------
Task Assigned

↓

Notification Service

↓

Store Notification

↓

PostgreSQL

↓

Push Notification

↓

Frontend

Github Integration Flow 
-----------------------
User Connects GitHub

↓

GitHub OAuth

↓

Access Token

↓

GitHub API

↓

Fetch Repositories

↓

Store Metadata

↓

Display In Workspace

Redis Flow 
----------
Frontend

↓

Backend

↓

Redis

↓

PostgreSQL

Docker Flow
-----------

Docker

├── Frontend Container
├── Backend Container
├── PostgreSQL Container
├── Redis Container

NGINX Flow 
----------
Internet

↓

Nginx

↓

Frontend

↓

Backend