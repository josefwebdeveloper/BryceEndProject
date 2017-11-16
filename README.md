# Tennis Social Network
MEAN stack Application "Tennis Battle"

##Working example of the application
https://tennisbattle2017.herokuapp.com/#/home


## GitHub
https://github.com/josefwebdeveloper/BryceEndProject

## Requirements

This application requires installation of NodeJS and MongoDB prior to running.

#For testing:
ADMIN
- Password : admin
- Login: admin
## Installation

- Install all dependencies in package.json file. This can be done by navigating to the root directory in the command prompt/terminal/console (I will refer to it as command prompt) and running the following command:

```
$ npm install
```

- You must enter your own MongoDB configuration settings in the app.js file:

```
mongoose.connect('mongodb://josi:tennis@ds229435.mlab.com:29435/tennis', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});
```
- You must enter your own  e-mail information (found in index.js file):

```
var transporter = nodemailer.createTransport({
    service: 'Mail.Ru',
    auth: {
        user: 'josef2007@list.ru',
        pass: ''
    },
    tls: { rejectUnauthorized: false }
});
```
- Installation is complete. Navigate to main folder of a project and enter the following into command prompt:

```
$ npm start
```

## Contributors

Joseph Shainskii.

## License

MIT license. 