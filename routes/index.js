
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


/*
 * GET datecalc page.
 */

exports.datecalc = function(req, res){
  res.render('datecalc', { title: 'Age Calculator' });
};