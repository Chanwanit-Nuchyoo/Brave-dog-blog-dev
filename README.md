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
![image](https://github.com/user-attachments/assets/51070de2-407f-430f-bc02-0baf2d27d44e)
![image](https://github.com/user-attachments/assets/e6f24f50-ba36-4db5-8a77-5ac23efff5ca)
![image](https://github.com/user-attachments/assets/c998dca8-fc86-44fa-8917-d406d7cb4d23)
![image](https://github.com/user-attachments/assets/4ce143d8-871e-4387-9ea2-8477c5f9f78a)
![image](https://github.com/user-attachments/assets/0d9ac0c6-473a-467b-9a98-5d2da17c4789)

