# Brave Dog
A simple blog website that, despite the name, has nothing to do with dogs.
The name is actually a playful word twist in Thai: Blog Dev → Bev Dog → Brave Dog!
This website is the result of my journey learning Vue.js and Nest.js and wanting to create something fun using them.

# Features
- authentication
- user profile
- CRUD blog
- like & comment

# Installation
1. clone this repo to your local computer
2. install dependencies using packages manager of choice
```
npm install
```
3. create .env file from .env.example in both client & server dir
```
# copy env from .env.example
cat .env.example > .env
```
4. init sqlite file using prisma
```
# go to server directory
cd ./app/server

# run prisma migrate
npx prisma migrate dev -m 'init'

# run prisma generate to generate types
npx prisma generate
```
5. run both server and client and everything is good to go!
```
# in client dir
npm run dev

# in server dir
npm run start:dev
```

# screenshots
WIP
