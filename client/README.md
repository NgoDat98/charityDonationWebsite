# product

- name : project charity donation
- purpose: + Create a website to support people who want to help those in need or a humanitarian organization but lack the budget to maintain + Make it simple to donate money to charity, encapsulating in a few small steps on your laptop or mobile phone. Information about donations and sponsorships is public and constantly updated, users can easily look up
- participant : + The project is aimed at all philanthropists and non-profit humanitarian organizations + Contributing to helping disadvantaged people, children in remote areas, orphans, the elderly, people with disabilities, and people with serious illnesses

## install plugin :

- npm install
  - (plugin base) @testing-library/jest-dom: ^5.11.8,@testing-library/react: ^11.2.3,@testing-library/user-event: ^12.6.0,
    react: ^17.0.1,react-dom: ^17.0.1,react-router-dom: ^5.2.0,react-scripts: 4.0.1,web-vitals: ^0.2.4
  - (plugin for code) alertifyjs: ^1.13.1,antd: ^5.4.2,axios: ^0.21.4,dayjs: ^1.11.7,moment: ^2.29.4,query-string: ^6.13.8,react-cookie: ^4.1.1,react-toastify: ^8.0.0,sweetalert2: ^11.7.3,

### config PORT (default 5000 not config):

- set PORT=3000 && react-scripts start

#### configAPIgateWay (configApp.jsx)

- apiGateWay: "http://localhost:5000"
- if configAPIgateWay change change then change "http://localhost:5000" with desired apiGateWay

##### Start

- npm start
