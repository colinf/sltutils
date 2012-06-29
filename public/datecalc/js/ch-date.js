$(function() {
	$( "#dob-picker" ).datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "dd/mm/yy",
		yearRange: "c-18:c",
		showOn: "button",
		buttonImage: "/datecalc/images/calendar.png",
		buttonText: "Show calendar...",
		buttonImageOnly: true
	});
	$("#to-picker").val(currentDateString());
	$( "#to-picker" ).datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "dd/mm/yy",
		yearRange: "c-5:c+2",
		showOn: "button",
		buttonImage: "/datecalc/images/calendar.png",
		buttonText: "Show calendar...",
		buttonImageOnly: true
	});
	$("#calculate").button({
		icons: { primary: "ui-icon-calculator"}
	}).click(calculate);
});

currentDateString = function() {
	var x = new Date(),
	m = x.getMonth()+1,
	d = x.getDate(),
	y = x.getFullYear();
	return (d<10?"0"+d:d)+"/"+(m<10?"0"+m:m)+"/"+y;
}

calculate = function() {
	showMessage();
	$("#main").hide();
	var currentDate = getCurrentDate();
	var dobDate = $( "#dob-picker" ).datepicker("getDate"),
			toDate	= $( "#to-picker" ).datepicker("getDate");
	if (!dobDate || !toDate) {
		return showMessage("DOB and To Date must both be valid dates");
	}
	if (dobDate >= currentDate) {
		return showMessage("DOB must be a valid date and in the past");
	}
	if (toDate <= dobDate) {
		return showMessage("To Date must be after DOB");		
	}
	var results = getAgeVariants(dobDate, toDate);
	console.log(results);
	jade.render(document.getElementById('age-list'), 'item', {ageList: results});
	$("#main").show();
}

showMessage = function(msg) {
	if (msg) {
		$("#error-message").html(msg);
		$("#footer").show();
	} else {
		$("#footer").hide();
	}
}

getCurrentDate = function() {
	var now = new Date();
	var currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	return currentDate;
}

getAge = function(dob, to) {
	var dobDt 		= getDateObj(dob),
			toDt 			= getDateObj(to);
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
	var age 			= getAge(dob, to),
			toDt			= getDateObj(to),
			days 			= monthDays(toDt, dob.getMonth()),
			partMonths = age.months+(age.days/days);
	return [
		{title: 'Years and whole months', value: age.years+ ' years, '+age.months+' months'},
		{title: 'Years, months, days', value: age.years+ ' years, '+age.months+' months, '+age.days+ ' days'},
		{title: 'Years and part months', value: age.years+ ' years, '+Math.round(partMonths*100)/100+' months'}
	]
}

var getDateObj = function(aDate) {
	return {
		yr: aDate.getFullYear(),
		mth: aDate.getMonth(),
		day: aDate.getDate(),
	}
}

var monthDays = function(dt, fromMonth) {
	var monthEnds = [31,28,31,30,31,30,31,31,30,31,30,31],
			month;
			if (fromMonth && fromMonth == dt.mth) {
				month = fromMonth;
			} else {
				month = dt.mth == 0 ? 11 : dt.mth-1;				
			}
			var days = monthEnds[month];
			if (month == 1) {
				var leapDate = new Date(dt.yr, 1, 29);
				if (leapDate.getMonth() == 1) {
					days++;
				}
			}
			console.log(days);
			return days;
			}

	
