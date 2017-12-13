const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoConnectionString = 'mongodb://piwnk:piwnk@ds135916.mlab.com:35916/kd-mongo';
mongoose.connect(mongoConnectionString, {
  useMongoClient: true,
});

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: Boolean,
});


userSchema.methods.manify = (next) => {
  this.name += '-boy';
  console.log(`Twoje nowe imię to: ${this.name}`);
  return next(null, this.name);
};

userSchema.pre('save', (next) => {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (this.created_at) {
    this.created_at = currentDate;
  }

  console.log(`Uzytkownik ${this.name} zapisany pomyslnie`);
  next();
});

const User = mongoose.model('User', userSchema);

const addUser = (name, pass) => {
  const user = new User({
    name,
    username: `${name}_the_boy`,
    password: pass,
  });

  user.manify((err) => {
    if (err) throw err;
  });

  console.log(user);

  user.save((err) => {
    if (err) throw err;
  });

  // return user;
};
//

// addUser('Kenny', 'kenny');


Promise.all([
  addUser('Kenny', 'kenny'),
//   addUser('Benny', 'benny'),
//   addUser('Mark', 'mark'),
]).then(() => {
  mongoose.connection.close();
  console.log('Disconnected');
});

