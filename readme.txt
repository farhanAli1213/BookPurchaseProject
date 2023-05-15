Features
User can view all books and purchase any books.
User can read any specific book if he buyed that book otherwise not.
If admin has blocked a user then that user will not be able to buy or read any book even if he has bought that book.
Admin will be able to check book sales report by applying daily, weekly, monthly and even overall filter.
----------------------------------------------------------------------

My Postman Json File is also added in that project folder named "FarhanMiniBook", you can import it into postman and test my APIs.
When we create new book,we pass Ids of chapters as array that includes all chapters for that book and when we create new chapter we pass Ids of pages as array that includes all pages for that chapters(Because I used embedding)
When query for all books,we pass query parameter for title and price to show the only title and price in result.
When we block or unBlock any user,we pass in query parameter that we want user blocked or unBlocked.
