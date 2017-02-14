var router = require('express').Router();
var Person = require('../models/Person');
var fs = require('fs');

// Permet de créer une route qui map l'url "/" en GET
router.get('/', function(req, res) {



    // Permet de retrouver des résultats sur un modèle
<<<<<<< HEAD
    if(!req.query.page){
    	req.query.page + 1;
	}	
        // Permet d'afficher une vue et de lui passer 
        var currentPage = Number(req.query.page); 

        if(currentPage<=0){
     		 currentPage=1;
		}
=======

        // Permet d'afficher une vue et de lui passer
        var currentPage = req.query.page;
>>>>>>> origin/master
	    var nbItemPage = 100;
	    
	    	Person.find({}).then(function(persons) {
<<<<<<< HEAD
	    		var nbItem = persons.length;
	    		 var nbPage = Math.ceil(nbItem / nbItemPage); 
			     
=======
	    		var nbItem = count;
	    		 var nbPage = Math.ceil(nbItem / nbItemPage);
			     if(currentPage == 0){
			     	currentPage = 1;
			     }
			     else if(!currentPage){
			     	currentPage = 1;
			     }
>>>>>>> origin/master
			    var nbmin = (currentPage * nbItemPage) - nbItemPage;
			    var table = []; 
				
			    for (var i = 1; i < 4; i++) {
			    	table.push(i);

			    }
				if(currentPage < nbPage){
				    if(currentPage > 3){
				   	 table.push("...");
					}
				    
				    	for (var i = currentPage -1; i <= (currentPage + 1); i++) {
				    	//console.log(i, table.indexOf(i));
				    	if(table.indexOf(i) === -1){
				    		table.push(i);
				    	}
				    	

				    }
				    table.push("...");

				}	
				    
				    
				    
				    for (var i = nbPage -2; i <= nbPage ; i++) {
				    	if(table.indexOf(i) === -1){
				    	table.push(i);
				    	}
				    }
				   	console.log(table);
				
			   	Person.find().skip(nbmin).limit(nbItemPage).exec(function(err, persons) {
		        if (err) {
		            return res.status(400).send({
		                message: err
		            });
		        } else {

		           res.render('home.ejs', {nbPage : nbPage , persons : persons , currentPage: currentPage , table: table});
		        }
		    });
	    });
	});


// Permet de créer une route qui map l'url "/hello" en GET
router.get('/hello', function(req, res) {
    var p = new Person({
        firstname: 'Ted',
        lastname: 'Mosby',
        age: 30
    });

    // Permet d'insérer une nouvelle donnée
    p.save().then(function(personSaved){
        res.render('hello.ejs', personSaved);
    });
});

router.get('/add', function(req, res) {
    res.render('add.ejs');
});

router.post('/add', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var gender = req.body.gender;
    var age = Number(req.body.age);
    var company = req.body.company;
    var departement = req.body.departement;
    var email = req.body.email;
    var city = req.body.city;
    var country = req.body.country;
    var ip_address = req.body.ip_address;

    var p = new Person({
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      age: age,
      company: company,
      departement: departement,
      email: email,
      city: city,
      country: country,
      ip_address: ip_address
    });
    p.save().then(function(){

    });
    res.redirect('/add');
});

router.get('/loadData', function(req, res){

  fs.readFile('data/persons.csv', 'utf-8', function (err, data) {
      if (err) {
          return console.log("Unable to read file " + err);
      }

      var stringcsv = data.split('\n');

      for (var i = 1; i < stringcsv.length; i++) {
        var arrayString = stringcsv[i].split(',');

        var p = new Person({
          firstname: arrayString[0],
          lastname: arrayString[1],
          gender: arrayString[2],
          age: Number(arrayString[3]),
          company: arrayString[4],
          departement: arrayString[5],
          email: arrayString[6],
          city: arrayString[7],
          country: arrayString[8],
          ip_address: arrayString[9]
        });
        p.save().then(function(){

        });
      }
      res.render('csv.ejs');
    });
});

router.get('/stats', function(req, res) {

    res.redirect('/req1');
});

router.get('/req1', function(req, res) {
  Person.find({gender: "Male",  age: { $gte: 20, $lte: 40 } , company: { $in: [ "Quamba", "Zoomcast" ] }}).then(function(persons){
    res.render('stats.ejs', { persons: persons , name : "req1"});
  });
});

router.get('/req2', function(req, res) {
  Person.find({gender: "Female", company: "Meevee"}).sort({age:-1}).limit(1).then(function(persons){
    res.render('stats.ejs', { persons: persons , name : "req2"});
  });
});

router.get('/req3', function(req, res) {
  Person.find({ip_address: {$regex: /\d{1,3}\.129\.\d{1,3}\.\d{1,3}/}}).then(function(persons){
    res.render('stats.ejs', { persons: persons , name : "req3"});
  });
});

router.get('/req4', function(req, res) {
  Person.find({email: {$regex: /\d/}}).then(function(persons){
    res.render('stats.ejs', { persons: persons , name : "req4"});
  });
});

router.get('/req5', function(req, res) {
  Person.aggregate([
  {$group:
    {
      _id:"$company",
      nbrFemmes:{$sum: {$cond: {if: {$eq:["$gender","Female"]}, then:1, else:0 } } },
      totalPersonnes:{$sum:1},
    }
  },
  {$project:
    {
      _id:0,
      company:"$_id",
      percent:{$divide:["$nbrFemmes","$totalPersonnes"]}
    }
  },
  {$sort:{percent:-1}},
  {$limit:1}
]).then(function(womens){

  res.render('stats.ejs', { name : "req5" , womens: womens});
  });
});

module.exports = router;
