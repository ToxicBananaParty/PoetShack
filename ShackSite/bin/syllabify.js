var poemData = {
    input: "",
    poem: "",
    syllableOrder: "",
    syllableFreq: ""
};

function syllabify(words) {
    const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
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

    var key = 0;
    for(var i = 0; i < layeredSyl.length; i++) {
        for(var a = 0; a , layeredSyl[i].length; a++) {
            key++;
            syl.set(key, layeredSyl[i][a]);
        }
    }
    poemData.syllableOrder = syl;
    poemData.syllableFreq = getFreq(sortSyl);

    return syl;
}

module.exports = parser;