# product

- name : project charity donation
- purpose: + Create a website to support people who want to help those in need or a humanitarian organization but lack the budget to maintain, + Make it simple to donate money to charity, encapsulating in a few small steps on your laptop or mobile phone. Information about donations and sponsorships is public and constantly updated, users can easily look up
- participant : + The project is aimed at all philanthropists and non-profit humanitarian organizations, + Contributing to helping disadvantaged people, children in remote areas, orphans, the elderly, people with disabilities, and people with serious illnesses

## Configure MongoDB:

- Create an account on cloud.mongodb.com
- Build and deploy database, create user, click connect select drivers and get connection string
- Change the MONGODB_CONNECT_KEY parameter in the .env file with a connection string of the form below:
  mongodb+srv://<username>:<password>@nodejs-lab-cluster.n2bebv4.mongodb.net/?retryWrites=true&w=majority

### install plugin :

- npm install
  - (plugin base) express: ~4.16.1,mongoose: ^7.0.3,nodemon: ^2.0.22,
  - (plugin for code) bcryptjs: ^2.4.3,cors: ^2.8.5,dotenv: ^16.0.3,express-session: ^1.17.3,express-validator: ^7.0.1,jsonwebtoken: ^9.0.0,morgan: ~1.9.1,multer: ^1.4.5-lts.1,react-cookie: ^4.1.1

#### Get port from environment and store in Express:(/bin/www) (default 3000 not config)

- port = normalizePort(process.env.PORT || "5000")
- create .env add the PORT parameter with the PORT you want to change or leave the default as 5000

##### Start

- npm start
