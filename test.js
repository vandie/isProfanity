var isprofanity = require('./isProfanity.js');

//var ta = ['Thanks for helping to solve the bug.','Thanks for helping me to create such a cool system :D',"That was a great game you played the other day.","Thanks for helping to test the thanks swear checker...","Thanks for helping to test thanks","RobinsonThomas Robinson was thanked by Joseph Crane \"thanks man.\" positive positive","Make Andy proud","Thanks for the holy water","Yay your on thanks!","Thanks for the hep testing thanks."];
var ta =['aww mate, what the bloom are you doing ?'];
var bwords = [];

ta.forEach(function(tstring) {
    isprofanity(tstring,function(t,a){
        a.forEach(function(e) {
            bwords.push(e);
            console.log(e);
        }, this);
    });
}, this);