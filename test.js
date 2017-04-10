var isprofanity = require('./isProfanity.js');
var ta =['Hello my friend! Thanks! for the help.'];

ta.forEach(function(tstring) {
    isprofanity(tstring,function(t,a){
        g = t ? 'has profanity '+': Found '+JSON.stringify(a) : 'has no profanity \n';
        console.log('"'+tstring+'" '+g);
    });
});