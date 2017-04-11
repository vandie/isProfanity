# isProfanity
A profanity checker which, unlike alternatives, uses the Wagner–Fischer algorithm in order to catch variations that you haven't thought of. If you use it in a project, please do tweet using the hashtag #isProfanity and I'll be sure to check it out.

[![npm](https://img.shields.io/npm/v/isprofanity.svg?style=flat-square)](https://www.npmjs.com/package/isprofanity)
[![npm](https://img.shields.io/npm/dt/isprofanity.svg?style=flat-square)](https://www.npmjs.com/package/isprofanity)


## Installation
Installation is very simple due to isProfanity being on NPM. Simply type: `npm install isprofanity` from a console in the project directory then add ` var isprofanity = require('isprofanity');` to the top of your project file.

##Usage
There is only one function in isProfanity. Calling it is a simple as typing:
```javascript
isprofanity(s,function(t){
    // t will equal true if it contains a swear word and false if not
});
```
's' being the string that you want to check for profanity and 't' being the boolian callback.

For a full example usage, you can try out the following code, setting 's' as a string that you would like to test.
```javascript
var s = "You absolute vanker";//misspelling of 'wanker' which would be allowed by most filters...

isprofanity(s ,function(t){
    b = t ? 'contains' : 'does not contain';
    console.log('"'+s+'" '+b+' profanity');
    process.exit();
});
```

##Advance Usage
###Setting custom lists
isProfanity also contains the abilty to pass custom csv files for both profanity and exceptions. You can do this like so:
```javascript
isprofanity(s,function(t){
    // t will equal true if it contains a swear word and false if not
},'data/profanity.csv','data/exceptions.csv');
```
While an exceptions file is not needed to replace the profanity list, it is recomended as some words do get flagged that are not swear words. (A notable example in the default set is 'while')

###Get an array of the words that were blocked
I added this to help find exceptions although it could be useful in other cases too. In order to get this array, simply use the following:
```javascript
isprofanity(s,function(t,blocked){
    // t will equal true if it contains potential profanity and false if not
    // blocked will be an array of the blocked words, how sure it is about them and what word they are closest to.
});
```
If you find any false positives, please share them.


---

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/vandie/OcuCount/blob/master/LICENSE)

---

Follow me on twitter ([@MVD_Vandie](https://twitter.com/MVD_Vandie)) or on github in order to keep track of my projects and releases.

[![Twitter Follow](https://img.shields.io/twitter/follow/mvd_vandie.svg?label=Follow%20on%20Twitter&style=flat-square)](https://twitter.com/MVD_Vandie) 
[![GitHub followers](https://img.shields.io/github/followers/vandie.svg?label=Follow%20on%20Github&style=flat-square)](https://github.com/vandie)

Enjoy. :D