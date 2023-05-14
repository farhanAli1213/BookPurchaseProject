My Postman Json File is also added in that project folder named "FarhanMiniBook", you can import it into postman and test my APIs.
You can use my cloud base cluster by using this connection string "mongodb+srv://farhanaliansari13:12345@cluster0.dceiwir.mongodb.net/".
When we create new book,we pass Ids of chapters as array that includes all chapters for that book and when we create new chapter we pass Ids of pages as array that includes all pages for that chapters(Because I used embedding)
When query for all books,we pass query parameter for title and price to show the only title and price in result.
When we block or unBlock any user,we pass in query parameter that we want user blocked or unBlocked.
