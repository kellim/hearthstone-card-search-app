const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const setsFilePath = path.join(__dirname, '../../data/card-sets.json');
const sets = JSON.parse(fs.readFileSync(setsFilePath, 'utf-8'));

router.get('/', (req, res) => {
    const searchTerm = req.cookies.search_term || '';
    const selectedSets = req.cookies.selected_sets ? req.cookies.selected_sets.split('|') : '';
    const selectedRarities = req.cookies.selected_rarities ? req.cookies.selected_rarities.split('|') : '';
    const selectedTypes = req.cookies.selected_types ? req.cookies.selected_types.split('|') : '';
    res.clearCookie('search_term');
    res.clearCookie('selected_rarities');
    res.clearCookie('selected_types');
    res.clearCookie('selected_sets');
    let matchingCards = [];
    const searchKeys = ['race', 'name', 'text', 'rarity'];    // string keys in card objects to search
    // const searchKeyArrays = ['mechanics']      // array keys in card objects to search
    const rarities = [{rarity: 'free'}, {rarity: 'common'}, {rarity:'rare'}, {rarity: 'epic'}, {rarity: 'legendary'}];
    const types = [{type: 'minion'}, {type: 'spell'}, {type: 'weapon'}];
    const wildSets = sets.filter(set => set.format === "wild");
    const standardSets = sets.filter(set => set.format === "standard");
  
    // Add selected property for selected items for each type of filter
    rarities.forEach(rarity => { rarity.selected = selectedRarities.includes(rarity.rarity) ? true : false });
    types.forEach(type => { type.selected = selectedTypes.includes(type.type) ? true : false });
    wildSets.forEach(set => { set.selected = selectedSets.includes(set.code) ? true : false });
    standardSets.forEach(set => { set.selected = selectedSets.includes(set.code) ? true : false });
  
    if (searchTerm) {
      matchingCards = req.app.locals.cardsData;
      // Apply sidebar filter only if a filter has a value
      if (selectedSets) matchingCards = matchingCards.filter(card => selectedSets.includes(card.set));
      if (selectedRarities) matchingCards = matchingCards.filter(card => selectedRarities.includes(card.rarity.toLowerCase()));
      if (selectedTypes) matchingCards = matchingCards.filter(card => selectedTypes.includes(card.type.toLowerCase()));
  
      // Filter by search term
      matchingCards = matchingCards.filter((card) => {
        return searchKeys.some(key => {
          if (card.hasOwnProperty(key)) {
              return card[key].toLowerCase().includes(searchTerm.toLowerCase().trim());
          }
          return false;        
        })
      })
    }
  
     res.render('index', {
      rarities,
      types,
      standardSets,
      wildSets,
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