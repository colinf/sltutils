var datecalc = require('datecalc');

module.exports = function (fromDt, toDt) {

  var age = datecalc.age(fromDt, toDt);
  var fromDay = fromDt.getDay();
  var toDay = toDt.getDay();
  var toMonth = toDt.getMonth();
  if (toDay < fromDay) {toMonth--};
  var partMonthLength = datecalc.daysInMonth(toDt.getFullYear(), toMonth);

  var results = [];
  results.push({title: 'Years and whole months', value: [
    age.years+' years',
    age.months+' months'
  ].join(', ')});
  results.push({title: 'Years, months, days', value: [
    age.years+' years',
    age.months+' months',
    age.days+' days'
  ].join(', ')});
  results.push({title: 'Years and part months', value: [
    age.years+' years',
    (age.months+(age.days/partMonthLength)).toFixed(2)+' months'
  ].join(', ')});
  if (age.years == 0 && age.months < 4) {
    var ageWeeks = datecalc.ageInWeeks(fromDt, toDt);
    results.push({title: 'Weeks and days', value: [
      ageWeeks.weeks+' weeks',
      ageWeeks.days+' days'
    ].join(', ')});
  }
  return results;
}