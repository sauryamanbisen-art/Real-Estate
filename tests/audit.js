/**
 * Automated Verification & Audit Test Suite
 * Validates JavaScript syntax, DOM ID binding, property integrity, and filter queries.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('=== [1] SYNTAX AUDIT ===');
['assets/js/script.js', 'assets/js/auth.js', 'assets/js/sell.js'].forEach(relPath => {
  const file = path.join(rootDir, relPath);
  try {
    const code = fs.readFileSync(file, 'utf8');
    new Function(code);
    console.log('✔ ' + relPath + ': VALID JS');
  } catch (err) {
    console.error('✘ ' + relPath + ' ERROR:', err.message);
    process.exit(1);
  }
});

console.log('\n=== [2] HTML & DOM ID AUDIT ===');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const requiredIds = [
  'propertyGrid', 'propertyFilters', 'propertyEmpty', 'propertyModal', 'modalClose', 'modalBody',
  'searchBar', 'searchLocation', 'searchType', 'searchPurpose', 'searchMinPrice', 'searchMaxPrice',
  'searchBedrooms', 'searchBtn', 'clearFiltersBtn', 'authModalBackdrop', 'animatedAuthBox',
  'animatedLoginForm', 'animatedRegisterForm', 'toggleToRegister', 'toggleToLogin', 'authModalCloseBtn'
];

requiredIds.forEach(id => {
  if (indexHtml.includes('id=\"' + id + '\"')) {
    console.log('✔ ID verified: #' + id);
  } else {
    console.error('✘ MISSING ID: #' + id);
    process.exit(1);
  }
});

console.log('\n=== [3] PROPERTIES & ASSETS AUDIT ===');
const scriptCode = fs.readFileSync(path.join(rootDir, 'assets/js/script.js'), 'utf8');
const propsCode = scriptCode.substring(scriptCode.indexOf('const properties = ['), scriptCode.indexOf('function getCustomProperties'));
const props = eval('(function(){ ' + propsCode + '; return properties; })()');

props.forEach(p => {
  const pth = path.join(rootDir, p.image.replace('./', ''));
  if (!fs.existsSync(pth)) {
    console.error('✘ MISSING IMAGE:', pth, 'for property id:', p.id);
    process.exit(1);
  }
  const stats = fs.statSync(pth);
  if (stats.size === 0) {
    console.error('✘ EMPTY IMAGE:', pth);
    process.exit(1);
  }
});
console.log('✔ All ' + props.length + ' property assets verified on disk!');

console.log('\n=== [4] SECTION & FILTER AUDIT ===');
const sale = props.filter(p => p.purpose === 'sale');
const rent = props.filter(p => p.purpose === 'rent');
const apt = props.filter(p => p.type === 'apartment');
const house = props.filter(p => p.type === 'house' || p.type === 'villa' || p.type === 'townhouse');

console.log('For Sale count:', sale.length, '(India:', sale.filter(p => p.location.includes('India')).length + ')');
console.log('For Rent count:', rent.length, '(India:', rent.filter(p => p.location.includes('India')).length + ')');
console.log('Apartments count:', apt.length, '(India:', apt.filter(p => p.location.includes('India')).length + ')');
console.log('Houses count:', house.length, '(India:', house.filter(p => p.location.includes('India')).length + ')');

if (sale.length < 5 || rent.length < 5 || apt.length < 5 || house.length < 5) {
  console.error('✘ FAILED: One or more sections has fewer than 5 listings');
  process.exit(1);
}

const indiaCount = props.filter(p => p.location.includes('India')).length;
const indiaRatio = indiaCount / props.length;
console.log('India ratio:', (indiaRatio * 100).toFixed(1) + '%');
if (indiaRatio <= 0.5) {
  console.error('✘ FAILED: India properties must exceed 50%');
  process.exit(1);
}

console.log('\n✔ AUDIT COMPLETE: ALL ASSERTIONS PASSED!');
