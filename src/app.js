const path = require('path')
const fs = require('fs')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()

const port = process.env.PORT || 3001

// Setup Handlebars
app.set('views', path.join(__dirname, '../views/pages'))

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts')
}))

app.set('view engine', 'handlebars')

const slimSelectPath = path.join(__dirname, '../node_modules/slim-select/dist')
app.use('/vendor', express.static(slimSelectPath))
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

// Log message to console if there's a set that hasn't been added to data/card-sets.json yet. Sets have to be manually
// added to that file.
// TODO: Refactor so this isn't in app
try {
  const setsToAddFilePath = path.join(__dirname, '../data/card-sets-to-manually-add.json')
  const setsToAdd = JSON.parse(fs.readFileSync(setsToAddFilePath, 'utf-8'))
  console.log('The following sets need to be manually added to data/card-sets.json after determining set names (the set code is provided below):')
  setsToAdd.forEach(setToAdd => {
    console.log(setToAdd)
  })
  console.log('If the sets were already added, please delete data/card-sets-to-manually-add.json')
} catch {
  console.log('Reminder: See "Update Card Data and Card Sets" in README for steps to take when a new expansion comes out!')
}

try {
  const cardsFilePath = path.join(__dirname, '../data/cards.json')
  const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
  app.locals.cardsData = JSON.parse(cardsData)
} catch {
  console.error('Error obtaining card data. Please fix and restart server.')
}

const setsFilePath = path.join(__dirname, '../data/card-sets.json')
const sets = JSON.parse(fs.readFileSync(setsFilePath, 'utf-8'))

// TODO: Put into separate route file
app.get('/', (req, res) => {
  const searchTerm = req.cookies.search_term || ''
  const selectedSets = req.cookies.selected_sets ? req.cookies.selected_sets.split('|') : ''
  res.clearCookie('search_term')
  res.clearCookie('selected_sets')
  let matchingCards = []
  const searchKeys = ['race', 'name', 'text']    // string keys in card objects to search
  // const searchKeyArrays = ['mechanics']      // array keys in card objects to search

    const wildSets = sets.filter(set => set.format === "wild")
    wildSets.forEach(set => {
      set.selected = selectedSets.includes(set.code) ? true : false
    })
  
   const standardSets = sets.filter(set => set.format === "standard")
   standardSets.forEach(set => {
    set.selected = selectedSets.includes(set.code) ? true : false
  })

  if (searchTerm) {
    matchingCards = app.locals.cardsData
    // Filter for selected sets if any
    if (selectedSets) { 
      matchingCards = matchingCards.filter((card) => selectedSets.includes(card.set))
    }

    // Filter by search term
    matchingCards = matchingCards.filter((card) => {
      return searchKeys.some(key => {
        if (card.hasOwnProperty(key)) {
            return card[key].toLowerCase().includes(searchTerm.toLowerCase().trim())
        }
        return false          
      })
    })
  }

   res.render('index', {
    standardSets,
    wildSets,
    matchingCards,
    searchTerm,
    selectedSets,
    helpers: {
      titleCaseWord: (string) => string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
    }
  })
})

app.post('/submit', function(req, res) {
  console.log('req.body', req.body) 
  const searchTerm = req.body.search;
  const selectedSets = Array.isArray(req.body.sets) ? req.body.sets.join('|') : req.body.sets
  if (searchTerm) res.cookie('search_term', searchTerm, { maxAge: 60000, httpOnly: true })
  if (selectedSets) res.cookie('selected_sets', selectedSets, { maxAge: 60000, httpOnly: true })
  res.redirect('/');
});

// This route is for testing purposes/reference, to be removed later
app.get('/json', (req, res) => {
  res.send(app.locals.cardsData)
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})