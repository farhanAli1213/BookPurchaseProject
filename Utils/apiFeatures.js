const Book = require("../model/bookModel");

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // BUILD QUERY
        if (this.queryString) {
            const queryObject = { ...this.queryString }
            const excludeFields = ['page', 'limit', 'sort', 'fields']
            excludeFields.forEach((element) => {
                delete queryObject[element]
            })
            // 2) Advanced filtering
            let queryString = JSON.stringify(queryObject);
            queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
            console.log(JSON.parse(queryString));

            this.query = this.query.find(JSON.parse(queryString))
           
        }
        return this;
        }
    sort() {
        // console.log(this.queryString.sort)
        if (this.queryString.sort) {
            this.query = this.query.sort(this.queryString.sort)
        } else {
            this.query = this.query.sort('-price')
        };
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            // console.log(111111111111111,fields);
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this;
    }
    paginate() {
        // Page 1
        if (this.queryString.page && this.queryString.limit) {
            const page = this.queryString.page * 1 || 1;
            const limit = this.queryString.limit * 1 || 2;
            const skip = (page - 1) * limit
            // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
            this.query = this.query.skip(skip).limit(limit);
        }
        return this;
    }
}

module.exports = APIFeatures;