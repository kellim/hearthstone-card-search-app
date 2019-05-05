const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const setsFilePath = path.join(__dirname, '../../data/card-sets.json');
const sets = JSON.parse(fs.readFileSync(setsFilePath, 'utf-8'));

router.get('/', (req, res) => {
  let matchingCards = req.app.locals.cardsData;
  const searchKeys = ['race', 'name', 'text', 'rarity'];
  const filters = {
    rarities: [{type: 'free'}, {type: 'common'}, {type:'rare'}, {type: 'epic'}, {type: 'legendary'}],
    types:  [{type: 'minion'}, {type: 'spell'}, {type: 'weapon'}],
    sets: JSON.parse(JSON.stringify(sets))
  };
  const filterKeys = Object.keys(filters);

  // Filter arrays have plural names, and will need to be converted to be singular to match individual card properties
  const singularFilterNames = { rarities: 'rarity',
                                types: 'type',
                                sets: 'set' }

  // Get search term from cookie and delete cookie
  const searchTerm = req.cookies.search_term || '';
  res.clearCookie('search_term');
    
     // Add selected property to filters based on selected items in cookies, then delete the cookies  
  filterKeys.forEach(filterName => {
    let selectedItems = [];
    filters[filterName].forEach(item => {
      item.selected = (req.cookies['selected_' + filterName] && req.cookies['selected_' + filterName].split('|').includes(item.type)) ? true : false;
      res.clearCookie('selected_' + filterName);
      if (item.selected) { selectedItems.push(item.type) };
    })
    
    if (selectedItems.length > 0) {
      matchingCards = matchingCards.filter(card => selectedItems.map(item => item.toLowerCase()).includes(card[singularFilterNames[filterName]].toLowerCase()));
    }
  });

  if (searchTerm) {     
    // Filter by search term
    matchingCards = matchingCards.filter((card) => {
      return searchKeys.some(key => {
        if (card.hasOwnProperty(key)) {
            return card[key].toLowerCase().includes(searchTerm.toLowerCase().trim());
        }
        return false;        
      })
    })
  } else {
    matchingCards = [];
  }

  res.render('index', {
    rarities: filters['rarities'],
    types: filters['types'],
    standardSets: filters['sets'].filter(set => set.format === 'standard'),
    wildSets: filters['sets'].filter(set => set.format === 'wild'),
    matchingCards,
    searchTerm,
    helpers: {
      titleCaseWord: (string) => string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
    }
  })
});

  router.post('/submit', function(req, res) {
    console.log('req.body', req.body) 
    const searchTerm = req.body.search;
    const selectedRarities = Array.isArray(req.body.rarities) ? req.body.rarities.join('|') : req.body.rarities;
    const selectedTypes = Array.isArray(req.body.types) ? req.body.types.join('|') : req.body.types;
    const selectedSets = Array.isArray(req.body.sets) ? req.body.sets.join('|') : req.body.sets;
    if (searchTerm) res.cookie('search_term', searchTerm, { maxAge: 60000, httpOnly: true });
    if (selectedRarities) res.cookie('selected_rarities', selectedRarities, { maxAge: 60000, httpOnly: true });
    if (selectedTypes) res.cookie('selected_types', selectedTypes, { maxAge: 60000, httpOnly: true });
    if (selectedSets) res.cookie('selected_sets', selectedSets, { maxAge: 60000, httpOnly: true });
    res.redirect('/');
  });

// This route is for testing purposes/reference, to be removed later
router.get('/json', (req, res) => {
    res.send(req.app.locals.cardsData);
});

module.exports = router;