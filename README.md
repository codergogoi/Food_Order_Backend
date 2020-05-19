If you are seeing this page. Definately you are keen about the mechanism of Online Food Delivery System working. I am giving a rough overview through this project to make a simple product availability and consumer side how behaving while we try to access the RESTFul API's from Mobile or Web applications.

This application is not covering the Admin part which is a saperate module with complete features to deliver admin and restaurant and Delivery agent section.

The Missing Piece to run the application:

1. Mongo DB access through https://cloud.mongodb.com/
2. User Credential which is encaptulated due to maintain Security.

   Create -> AppConst.js
   add the following:
   exports.MONGODB_URI ="mongodb+srv://your_mongodb_url/online_foods";

   exports.APP_KEY = "APP_ACCESS_KEY";

   The front End part is devided into two section Web App [REACT JS] and Mobile App [REACT NATIVE] you can find the front end source code in my repositoy list.

   Post Man COllections for API Testing Part:

   https://documenter.getpostman.com/view/8734310/Szt5fBTP?version=latest
