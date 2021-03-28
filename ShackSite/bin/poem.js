var MonkeyLearn = require('monkeylearn');
var ml = new MonkeyLearn('87cb48634d4219bc8ecddabde0e6815945350f5b');
var fs = require('fs');
var midify = require('./midify');

const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

function syllabify(words) {
    return words.match(syllableRegex);
}

function getFreq(arr){
    var syll = [], freq = [], prev;

    arr.sort();
    for(var i = 0; i < arr.length; i++){
        if (arr[i] !== prev){
            syll.push(arr[i]);
            freq.push(1);
        }else{
            freq[freq.length-1]++;
        }
        prev = arr[i];
    }

    return[syll, freq];
}

function parser(poem, poemData) {
    var words = poem.split(" ");
    var layeredSyl = words.map(syllabify);
    var sortSyl = layeredSyl.flat();
    var syl = new Map();
    var sylOut = [];
    console.log(layeredSyl.length);
    console.log(layeredSyl);
    console.log(layeredSyl[0]);

    var key = 0;
    for(var i = 0; i < layeredSyl.length; i++) {
        if(layeredSyl[i] != null) {
            for(var a = 0; a < layeredSyl[i].length; a++) {
                key++;
                syl.set(key, layeredSyl[i][a]);
                sylOut.push(layeredSyl[i][a]);
            }
        }
    }

    poemData.syllableOrder = syl;
    poemData.syllableFreq = getFreq(sortSyl);
    //console.log(syl);
    //console.log(JSON.stringify(syl));

    return [sylOut, poemData];
}

class Poem {
    poem = '';
    author = '';
    syllables = [];
    midiArray = [];

    constructor(poem, author) {
        this.poem = poem;
        this.author = author;
        var punctuationless = poem.replace(/[.,\/#!$%\^&\*;:{}=\-_`?~()]/g,"");

        var poemData = {
            input: "",
            poem: "",
            syllableOrder: "",
            syllableFreq: ""
        };

        poemData.input = poem;
        poemData.poem = punctuationless.replace(/\s{2,}/g," ").toLowerCase();

        var syllabify = parser(poem, poemData);

        this.syllables = syllabify[0];
        poemData = syllabify[1];

        this.calculateMidi(poemData);
        this.sentiment(poem);
        this.urgency(poem);

        var json = JSON.stringify(this);
        var outputLocation = __dirname + '/../data/poem.json';
        fs.writeFileSync(outputLocation, json);
	console.log("Created poem file");
    }

    calculateSyllables(poem) {
        this.syllables = parser(poem)[0];
        this.syllables = [this.syllables];
    }

    calculateMidi(data) {
        this.midiArray = midify(data);
    }

    sentiment(text) {
        var data = [text];
        ml.classifiers.classify('cl_pi3C7JiL', data).then(res => {
            var outputLocation = __dirname + '/../data/sentiment.json';
            var json = JSON.stringify(res.body[0].classifications[0]);
            
            fs.writeFileSync(outputLocation, json);
	    console.log("Created sentiment file");
        });
    } 

    urgency(text) {
        var data = [text];
        ml.classifiers.classify('cl_Aiu8dfYF', data).then(res => {
            var outputLocation = __dirname + '/../data/urgency.json';
            var json = JSON.stringify(res.body[0].classifications[0]);

            fs.writeFileSync(outputLocation, json);
	    console.log("Created urgency file.");
        });
    }
}

module.exports = Poem;
