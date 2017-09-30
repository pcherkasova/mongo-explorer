# mongo-explorer
MongoDB online query runner. Delivers data in REST, CSV and HTML-table formats. 

The explorer is hosted here: www.mongo-explorer.com.

The user inrterface is designed to be self-descriptive. If it is not, please, create an [issue](https://github.com/pcherkasova/mongo-explorer/issues).


#Technologies
Mongo-exploprer stays on [nodejs](https://nodejs.org/en/), [mongodb](https://www.mongodb.com/) and [angularjs](https://angularjs.org/). 


#How to Host
1. Install nodejs and npm
2. Set environment variables:

  APP_SESSION_SECRET - any string
  
  APP_TELEMETRY_DB - connection string to a Mongo DB, with write permissions

3. Run commands:

  npm install
  
  node server.js


#How to Run Tests
1. Set environment variables like for hosting plus:

  APP_TEST_DB - connection string to a Mongo DB, with write permissions

2. Run 'node test.js'





