const express = require('express');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const csurf = require('csurf');

const router = express.Router();

const csurfProtection = csurf({ cookie: true });
router.use(csurfProtection);

const setsFilePath = path.join(__dirname, '../../data/card-sets.json');
const sets = JSON.parse(fs.readFileSync(setsFilePath, 'utf-8'));

const mechanicsFilePath = path.join(__dirname, '../../data/mechanics-list.json');
const mechanics = JSON.parse(fs.readFileSync(mechanicsFilePath, 'utf-8'));

const tribesFilePath = path.join(__dirname, '../../data/tribes-list-raw.json');
let tribes = JSON.parse(fs.readFileSync(tribesFilePath, 'utf-8'));
tribes = JSON.parse(JSON.stringify(tribes));
tribes.forEach((tribe, i) => {
  tribes[i] = {type: tribe.toLowerCase()};
})

router.get('/', csurfProtection, (req, res) => {
  let matchingCards = req.app.locals.cardsData;
  const searchKeys = ['race', 'name', 'text', 'rarity'];
  const filters = {
    rarities: [{type: 'free'}, {type: 'common'}, {type:'rare'}, {type: 'epic'}, {type: 'legendary'}],
    types:  [{type: 'minion'}, {type: 'spell'}, {type: 'weapon'}],
    classes: [{type: 'neutral'}, {type: 'druid'}, {type: 'hunter'}, {type: 'mage'}, {type: 'paladin'}, {type: 'priest'},
              {type: 'rogue'}, {type: 'shaman'}, {type: 'warlock'}, {type: 'warrior'}],
    sets: JSON.parse(JSON.stringify(sets)),
    mechanics: JSON.parse(JSON.stringify(mechanics)),
    tribes: tribes
  };
  const filterKeys = Object.keys(filters);

  const apiFilterName = { rarities: 'rarity',
                          types:    'type',
                          classes:  'cardClass',
                          sets:     'set',
                          mechanics: 'mechanics',
                          tribes:    'race' };                       

  // Get search term from cookie and delete cookie
  const searchTerm = req.cookies.search_term || '';
  res.clearCookie('search_term');
    
  // Filter results (matchingCards) by search filters selected by user; it uses temporary cookies to get selected items.
  filterKeys.forEach(filterName => {
    let selectedItems = [];
    filters[filterName].forEach(item => {
      item.selected = (req.cookies['selected_' + filterName] && req.cookies['selected_' + filterName].split('|').includes(item.type)) ? true : false;
      res.clearCookie('selected_' + filterName);
      if (item.selected) { selectedItems.push(item.type) };
    })
    
    if (selectedItems.length > 0) {
      matchingCards = matchingCards.filter(card => {
        return card.hasOwnProperty(apiFilterName[filterName]) ? selectedItems.some(item => card[apiFilterName[filterName]].includes(item.toUpperCase())) : false;
      })
    }
  });

  searchError = req.cookies['search_error'];
  res.clearCookie('search_error');

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
    classes: filters['classes'],
    standardSets: filters['sets'].filter(set => set.format === 'standard'),
    wildSets: filters['sets'].filter(set => set.format === 'wild'),
    mechanics: filters['mechanics'],
    tribes: filters['tribes'],
    matchingCards,
    searchTerm,
    searchError,
    csrfToken: req.csrfToken(),
    helpers: {
      titleCaseWord: (string) => string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
    }
  })
});

  // The purpose of this route is to process the search form. It will set temporary cookies with the 
  // search term and selected filter items so the data can be passed to the get '/' view. Using post
  // because it would be an overwhelming amount of query strings in the URL otherwise.
  router.post('/submit', [
    csurfProtection,
    check('search')
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage('Please limit search term to alphanumeric characters and spaces.')
  ], 
  function(req, res) {
    const errors = validationResult(req).mapped();
    const searchError = errors['search'] ? errors['search'].msg : '';
    const getSelectedFilterItems = filter => Array.isArray(req.body[filter]) ? req.body[filter].join('|') : req.body[filter];

    const cookiesToSet = { search_term: req.body.search,
                           selected_rarities: getSelectedFilterItems('rarities'),
                           selected_types: getSelectedFilterItems('types'),
                           selected_classes: getSelectedFilterItems('classes'),
                           selected_sets: getSelectedFilterItems('sets'),
                           selected_mechanics: getSelectedFilterItems('mechanics'),
                           selected_tribes: getSelectedFilterItems('tribes') };
    const cookiesNamesToSet = Object.keys(cookiesToSet);

    cookiesNamesToSet.forEach(cookieName => {
      if (cookiesToSet[cookieName]) {
        res.cookie(cookieName, cookiesToSet[cookieName], { maxAge: 60000, httpOnly: true });
        }
    });
    if (searchError) {
      res.cookie('search_error', searchError, { maxAge: 60000, httpOnly: true });
    }
    res.redirect('/');
  });

// This route is for testing purposes/reference, to be removed later
router.get('/json', (req, res) => {
    res.send(req.app.locals.cardsData);
});

module.exports = router;