# mongo-explorer
MongoDB online data explorer. Delivers data in REST, CSV and HTML-table formats. 

The explorer is hosted here: www.mongo-explorer.com.

The user inrterface is designed to be self-descriptive. If it is not, please, create an [issue](https://github.com/pcherkasova/mongo-explorer/issues).


#Technologies
Mongo-exploprer is written in [nodejs](https://nodejs.org/en/), uses [mongodb](https://www.mongodb.com/) to store data and html/css/javascript to interact with user.

#How to Host
1. Install nodejs and npm
2. Set environment variables:

  APP_SESSION_SECRET - any string
  
  APP_TELEMETRY_DB - connection string to a DB in Mango engine

3. Run commands:

  npm install
  
  node server.js


#How to Run Tests
1. Set environment variables like for hosting
2. Run node tools/test/test.js





