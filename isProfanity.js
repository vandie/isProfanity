async = require('async');
try {
    var fs = require('fs')
}catch(e){
    var fs = false;
}

/**
 * Gets the list of profanity words from the csv file
 * @function
 * @param {function(Array)} callback The function to pass profanity to.
 * @param {String} file (optional) The location of a csv file containing your list of profanity.
 */
function loadCSV(callback,file){
    file = typeof(file) == 'string' ? file : __dirname+'/data/profanity.csv';
    if(fs){
        if(typeof(callback) != 'function') throw new Error('isProfanity Error: Valid callback not given...');
        fs.readFile(file, 'utf8', function (err,data) {
            if (err) {
                throw err;
            }else{
                callback(data.split(','));
            }
        });
    }else{//browser version
        if(file.includes('exceptions')){
            e = require(__dirname+'/data/exceptions.js');
            callback(e.t.split(','));
        }else{
            e = require(__dirname+'/data/profanity.js');
            callback(e.t.split(','));
        }
    }
}
/**
 * Stores a word and it's current rating
 * @class
 * @param {String} word The word as a string
 * @param {Number} rating The Levenshtein distance provided by wangerFischer
 * @param {String} closeWord The word tested against
 */
function Word(word,rating,closeWord){
    this.word = String(word) || '';
    this.sureness = 1 - Number(rating)/this.word.length || 0;
    this.closestTo = String(closeWord)
}
/**
 * Perform the Wagner-Fischer algorithm on the 2 inputs
 * ( https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm )
 * @function
 * @param {String} str1 The first string to compare 
 * @param {String} str2 The Second string to compare
 */
function wagnerFischer(str1,str2){
    if(typeof(str1) != 'string' || typeof(str2) != 'string') throw new Error('isProfanity Error: Both str1 and str2 must both be strings...');
    var dist = [];
    for(var i = 0; i < str1.length+1; ++i)
        dist[i] = [i];
    for(var i = 0; i < str2.length+1; ++i)
        dist[0][i] = i
    for (var t = 1; t < str2.length+1; ++t)
        for (var i = 1; i < str1.length+1; ++i)
            dist[i][t] = str1[i - 1] === str2[t - 1] ? dist[i-1][t-1] : 
                Math.min.apply(Math, [dist[i-1] [t]+1,dist[i] [t-1]+1,dist[i-1] [t-1]+1
                ]);
    return dist[str1.length][str2.length];
}

/**
 * Passes a boolian to a callback saying whether a string contains profanity or not.
 * @function
 * @param {String} string The string to check for profanity.
 * @param {function(boolian)} callback The function to pass answer to.
 * @param {String} customProfanity (optional) The location of a csv file containing your list of profanity.
 * @param {String} customExceptions (optional) the location of a csv file containing exceptions that should not be blocked.
 * @param {float} sensitivity (optional) (requires custom exceptions list) How sensitive to be to changes. Must be between 0 and 1 (defaults to 0.67)
 */

function isProfanity(string,callback,customProfanity,customExceptions,sensitivity){
    var minSure = sensitivity && sensitivity >= 0 && sensitivity <= 1 ? 1-sensitivity : 0.32;
    minSure = minSure < 0.32 ? customExceptions ? minSure : 0.32 : minSure;
    customExceptions = customExceptions && fs ? customExceptions : __dirname+'/data/exceptions.csv';
    if(typeof(string) != 'string') throw new Error('isProfanity Error: The var \'string\' is not a String...');
    if(typeof(callback) != 'function') throw new Error('isProfanity Error: Valid callback not given...');
    var containsASwear = false;
    var blockedWords = new Array();
    loadCSV(function(swears){
        loadCSV(function(exceptions){
            strings = string.split(' ');
            async.each(strings,function(word,callback) {
                word = word.replace(/\b[-.,()&$#:!\[\]{}"']+\B|\B[-.,()&$#:!\[\]{}"']+\b/g, "");
                var WorstSwear = new Word();
                var mostlikelyexception = new Word();
                var foundExeption = exceptions.includes(word.toLowerCase());
                async.each(swears,function(swear,callback){
                    x = wagnerFischer(swear.toLowerCase(),word.toLowerCase());
                    if(new Word(word,x).sureness > WorstSwear.sureness){
                        WorstSwear = new Word(word,x,swear);
                    }
                    callback();
                }, function(err) {
                    if(!foundExeption && WorstSwear.sureness > minSure){
                        blockedWords.push(WorstSwear);
                        containsASwear = true;
                    }
                });
                callback();
            }, function(err){
                callback(containsASwear,blockedWords);
            });
        },customExceptions);
    },customProfanity);
}

module.exports = isProfanity;