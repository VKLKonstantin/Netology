# insert book
db.books.insertOne({
    title: "newBook",
    description = "newDescription", 
    authors = "newAuthors", 

})

# insert books
db.books.insertMany([
    {
    title: "newBook",
    description = "newDescription", 
    authors = "newAuthors", 
   },
   {
    title: "newBook2",
    description = "newDescription2", 
    authors = "newAuthors2", 
},
])

# find book

db.books.findOne({title: "newBook2"})

# update book

db.books.findOne({_id:"112345678"}, { $set: {description: "blablabla", authors:"blablabla"} })

