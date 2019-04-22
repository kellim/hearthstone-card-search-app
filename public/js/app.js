// Make Node Module Packages available on the client side using browserify
// Run npm run build after updating this file.
const SlimSelect = require('slim-select')

// For Each Select element, add new SlimSelect with its id.
new SlimSelect({
    select: '#sets'
})