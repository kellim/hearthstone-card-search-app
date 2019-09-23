const path = require('path');
const fs = require('fs');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

const routes = require('./routes');

const port = process.env.PORT || 3000;

// Setup Handlebars
app.set('views', path.join(__dirname, '../views/pages'));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts')
}))

app.set('view engine', 'handlebars');

const slimSelectPath = path.join(__dirname, '../node_modules/slim-select/dist');
app.use('/vendor', express.static(slimSelectPath));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Log message to console if there's a set that hasn't been added to data/card-sets.json yet. Sets have to be manually
// added to that file.
// TODO: Refactor so this isn't in app
try {
  const setsToAddFilePath = path.join(__dirname, '../data/card-sets-to-manually-add.json');
  const setsToAdd = JSON.parse(fs.readFileSync(setsToAddFilePath, 'utf-8'));
  console.log('The following sets need to be manually added to data/card-sets.json after determining set names (the set code is provided below):');
  setsToAdd.forEach(setToAdd => {
    console.log(setToAdd);
  })
  console.log('If the sets were already added, please delete data/card-sets-to-manually-add.json');
} catch {
  console.log('Reminder: See "Update Card Data and Card Sets" in README for steps to take when a new expansion comes out!');
}

try {
  const cardsFilePath = path.join(__dirname, '../data/cards.json');
  const cardsData = fs.readFileSync(cardsFilePath, 'utf-8');
  app.locals.cardsData = JSON.parse(cardsData);
} catch {
  console.error('Error obtaining card data. Please fix and restart server.');
}

app.use(routes);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
})