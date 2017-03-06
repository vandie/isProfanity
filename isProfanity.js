fs = require('fs');
/**
 * Gets the list of profanity words from the csv file
 * @function
 * @param {function(Array)} callback The function to pass profanity to.
 * @param {String} file (optional) The location of a csv file containing your list of profanity.
 */
function loadCSV(callback,file){
    file = typeof(file) == 'string' ? file : __dirname+'/data/profanity.csv';
    if(typeof(callback) != 'function') throw new Error('isProfanity Error: Valid callback not given...');
    fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
        throw err;
    }else{
        callback(data.split(','));
    }
    });
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
 */

function isProfanity(string,callback,customProfanity,customExceptions){
    customExceptions = customExceptions ? customExceptions : __dirname+'/data/exceptions.csv';
    if(typeof(string) != 'string') throw new Error('isProfanity Error: The var \'string\' is not a String...');
    if(typeof(callback) != 'function') throw new Error('isProfanity Error: Valid callback not given...');
    containsASwear = false;
    loadCSV(function(swears){
        loadCSV(function(exceptions){
            strings = string.split(' ');
            strings.forEach(function(word) {
                swears.forEach(function(swear) {
                    x = wagnerFischer(swear.toLowerCase(),word.toLowerCase());
                    if(x < (word.length/2) && exceptions.indexOf(word) === -1){
                        containsASwear = true;
                    }
                }, this);
            }, this);
            callback(containsASwear);
        },customExceptions);
    },customProfanity);
}

module.exports = isProfanity;