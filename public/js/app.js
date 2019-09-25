// Run npm run build after updating this file to make slim-select package available on the client side using browserify.
// For Each Select element in the html, add new SlimSelect with its id in this file.
const SlimSelect = require('slim-select');

new SlimSelect({
  select: '#rarities'
});

new SlimSelect({
  select: '#types'
});

new SlimSelect({
  select: '#classes'
});

new SlimSelect({
  select: '#sets'
});

new SlimSelect({
  select: '#mechanics'
});

new SlimSelect({
  select: '#tribes'
});

// Helps fix FOUC
(function(H){H.className=H.className.replace(/\bno-js\b/,'js')})(document.documentElement);