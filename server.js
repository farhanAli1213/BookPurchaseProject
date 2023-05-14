const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);



const app = require('./app')

// console.log(process.env);

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
})
    .then(con => {
        console.log('DB connection successful');
    })



const port = process.env.PORT || 8000
const server = app.listen(port, 'localhost', () => {
    console.log(`Listening on port number ${port}`);
})



// Handled rejected promises globally
process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION! Shutting down...');
    console.log(err.name, err.message);

    server.close(() => {        
        process.exit(1)
    })
})
