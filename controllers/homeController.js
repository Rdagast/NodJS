var router = require('express').Router();
var Person = require('../models/Person');
var fs = require('fs');

// Permet de créer une route qui map l'url "/" en GET
router.get('/', function(req, res) {
    // Permet de retrouver des résultats sur un modèle
    Person.find({}).then(function(persons) {
        // Permet d'afficher une vue et de lui passer des paramètres
        res.render('home.ejs', { persons: persons});
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
    var age = req.body.age;
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
          age: arrayString[3],
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


module.exports = router;
