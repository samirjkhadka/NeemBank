const NepaliDate = require('nepali-date');

function getNepaliDate() {
    const nepaliDate = new NepaliDate();
    return nepaliDate.format('YYYY-MM-DD');
}

module.exports = { getNepaliDate };
