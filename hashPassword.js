const bcrypt = require('bcrypt');

const password = 'Gcsvn@123'; // Replace with the password you want to set
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log(hash); // Use this hash for your database
    }
});
