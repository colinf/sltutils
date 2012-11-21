if (typeof console == "undefined") {
    this.console = {log: function() {}};
}
var Datepicker = require('datepicker');
var o =require('jquery');
var distal =require('distal');
var ages = require('./ages');

var thisYear = (new Date()).getFullYear();
var yearsAgo = thisYear - 21;

var dpDob = new Datepicker;
dpDob
  .inputFields({
    '#dob-dd': 'DD',
    '#dob-mm': 'MM',
    '#dob-yyyy': 'YYYY'})
  .trigger('#pick-dob')
  .showMonthSelect()
  .showYearSelect(thisYear, yearsAgo);

var dpTo = new Datepicker({displayInitial: true});
dpTo
  .inputFields({
    '#to-dd': 'DD',
    '#to-mm': 'MM',
    '#to-yyyy': 'YYYY'})
  .trigger('#pick-to');

o('#calculate').click(function() {
  calculate();
})

var currentDateString = function() {
  var x = new Date(),
  m = x.getMonth()+1,
  d = x.getDate(),
  y = x.getFullYear();
  return (d<10?"0"+d:d)+"/"+(m<10?"0"+m:m)+"/"+y;
}

var calculate = function() {
  var error = '';
  showSection('footer', false);
  showSection('results', false);
  if (error = inputError()) {
    return showMessage(error);
  }
  var data = {};
  data.items = ages(dpDob.date(), dpTo.date());
  distal(document.getElementById('age-list'), data);

  showSection('results');
}

var showSection = function(section, show) {
  if (typeof show === "undefined") {show = true};
  if (show) {
    o('#'+section).show();
  } else {
    o('#'+section).hide();
  }
}

var inputError = function() {
  var dob = dpDob.date();
  var to = dpTo.date();
  if (!dob) {
    return "No date of birth has been entered";
  }
  if (!dpDob.inputValid()) {
    return "Date of birth entered is not a valid date";
  }
  if (!dpTo.inputValid()) {
    return "To date entered is not a valid date";
  }
  var currentDate = getCurrentDate();
  if (dob > currentDate) {
    return "Date of birth should be in the past";
  }
  if (dob >= to) {
    return "To date must be after date of birth";
  }
  return '';
}

showMessage = function(msg) {
  o("#error-message").html(msg);
  showSection('footer');
}

getCurrentDate = function() {
  var now = new Date();
  var currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return currentDate;
}

getAge = function(dob, to) {
  var dobDt     = getDateObj(dob),
      toDt      = getDateObj(to);
  var years = toDt.yr - dobDt.yr;
  if (toDt.mth < dobDt.mth || (toDt.mth == dobDt.mth && dobDt.day > toDt.day)) {
    years--;
  }
  var startMonth = dobDt.mth;
  if (toDt.yr > dobDt.yr && (toDt.mth < dobDt.mth || (toDt.mth == dobDt.mth && dobDt.day > toDt.day))) {
    startMonth -= 12;
  }
  var months = toDt.mth - startMonth;
  if (toDt.day < dobDt.day) {
    months--;
  }
  var startDate = dobDt.day;
  if ((toDt.yr > dobDt.yr || toDt.mth > dobDt.mth) && toDt.day < dobDt.day) {
    var startMonthDays = monthDays(toDt);
    startDate -= startMonthDays;
  }
  var days = toDt.day - startDate;

  return {years: years, months: months, days: days};
}

getAgeVariants = function(dob, to) {
  var age       = getAge(dob, to),
      toDt      = getDateObj(to),
      days      = monthDays(toDt, dob.getMonth()),
      partMonths = age.months+(age.days/days);
  return [
    {title: 'Years and whole months', value: age.years+ ' years, '+age.months+' months'},
    {title: 'Years, months, days', value: age.years+ ' years, '+age.months+' months, '+age.days+ ' days'},
    {title: 'Years and part months', value: age.years+ ' years, '+Math.round(partMonths*100)/100+' months'}
  ]
}
