# mongoCRUD
Mongo CRUD basics on node js enviroment

1. install git

2. install nodejs
  - mac: https://nodejs.org/dist/v0.12.6/node-v0.12.6.pkg or
  - $ brew install node
  - $ node -v && npm -v

3. install mongodb
  - $ brew install mongodb
  - $ mongo -version

4. clone this repository
  - $ git clone https://github.com/jayrore/mongoCRUD.git && cd mongoCRUD
   
5. install nodemon as global and dependencies 
  - npm install nodemon -g && npm install

6. run mongo daemon
  - $ mongod 
  - $ mongod [-dbpath /directory/path/ ] [-port 27017]
  
7. run server
  - DEBUG=mongo-crud npm start
