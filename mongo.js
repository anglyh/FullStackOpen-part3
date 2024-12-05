const mongoose = require('mongoose');

if (process.argv < 3) {
  console.log('give password as an argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@clustertest.lcdbu.mongodb.net/personApp;?retryWrites=true&w=majority&appName=ClusterTest`;

mongoose.set('strictQuery', false);

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB');

    if (process.argv.length === 3) {
      console.log('phonebook:');

      return Person.find({}).then((result) => {
        result.forEach((person) => console.log(person));
      });
    }

    const person = new Person({ name, number });
    return person
      .save()
      .then((result) =>
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
      );
  })
  .then(() => mongoose.connection.close())
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
