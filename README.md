# project charity donation

## Project introduction

- purpose:
  - Create a website to support people who want to help those in need or a humanitarian organization but lack the budget to maintain,
  - Make it simple to donate money to charity, encapsulating in a few small steps on your laptop or mobile phone. Information about donations and sponsorships is public and constantly updated, users can easily look up
- participant :
  - The project is aimed at all philanthropists and non-profit humanitarian organizations,
  - Contributing to helping disadvantaged people, children in remote areas, orphans, the elderly, people with disabilities, and people with serious illnesses

## Functional description

- Donation Page: Provides an interface for users to easily make donations, including safe and convenient payment methods such as credit cards, or bank transfers.
- Account Management: Allows users to register an account, update personal information, track donation history, and manage their account
- Project information: Provides detailed information about the specific projects the organization is donating to, including donation goals, project progress, and how people can help.
- Security and privacy: Ensure that users' personal information is protected securely and in compliance with privacy regulations.
- Statistics and reporting: Provide statistics and reports on donation amounts, project progress and charity performance.
- Results page: Post reports and updates on what has been achieved thanks to community contributions.

## Demo link (Note that this is a demo website so it can only be pushed to Free Cloud Application Storage so you need to reload the page 1 to 2 times for the server to start and return data)

- link : https://quytraitimnhanai.web.app/
  - You can use a dedicated admin account to access the admin page:
    - email: admin
    - password: 12345678

## Deployment guide (on local)

### Font-end

- set PORT=3000 && react-scripts start
- configAPIgateWay (configApp.jsx)
- apiGateWay: "http://localhost:5000"
- if configAPIgateWay change change then change "http://localhost:5000" with desired apiGateWay

### Back-end

- Create an account on cloud.mongodb.com
- Build and deploy database, create user, click connect select drivers and get connection string
- Change the MONGODB_CONNECT_KEY parameter in the .env file with a connection string of the form below:
  mongodb+srv://<username>:<password>@nodejs-lab-cluster.n2bebv4.mongodb.net/?retryWrites=true&w=majority

- port = normalizePort(process.env.PORT || "5000")
- create .env add the PORT parameter with the PORT you want to change or leave the default as 5000

## install plugin

- npm install

## Start

- npm start
