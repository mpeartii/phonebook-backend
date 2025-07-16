const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://mpeartii:${password}@cluster0.cyiyebs.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('person', personSchema)

switch (process.argv.length) {
case 5:
{ const person = new Person({ name: process.argv[3], number: process.argv[4],  })
  // eslint-disable-next-line no-unused-vars
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
  break }
case 3:
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
  break
default:
  console.log('arg(s) error')
  process.exit(1)
}