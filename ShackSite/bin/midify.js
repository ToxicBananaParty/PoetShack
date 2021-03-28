var Ccluster = [];
Ccluster.push(["C4", "D4", "F4", "G4", "G#4", "B4", "D5"]);
Ccluster.push(["E4", "F4", "G#4", "A4", "B4", "D5"]);
Ccluster.push(["C4", "F4", "G#4", "A#4", "D#5"]);
var cluster = Math.floor(Math.random() * Math.floor(3));
  

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function midify(poemData) {
    var sylFreq = poemData.syllableFreq;
    var shuffledSyl = shuffle(sylFreq[0]);
    sylFreq[0].sort();
    var noteSyl = [];
    var noteSylDur = [];
    var noteSylDurOrd = [];
    var note = 0; 
    for(var i = 0; i<shuffledSyl.length; i++){
        if(note >= Ccluster[cluster].length){
            note = 0;
            noteSyl.push([shuffledSyl[i],Ccluster[cluster][note]]);
            note++;
        }else{
            noteSyl.push([shuffledSyl[i],Ccluster[cluster][note]]);
            note++;
        }
    }
    //console.log(noteSyl);
    for(let [key, value] of noteSyl){
        for(var i = 0; i< sylFreq[0].length;i++){
            if(sylFreq[0][i] === key){
                noteSylDur.push([key, value, sylFreq[1][i]]);
            }
        }
    }
    for(var i = 0; i<= poemData.syllableOrder.size; i++){
        var syllable = poemData.syllableOrder.get(i);
        for(let [key, value, dur] of noteSylDur){
            if(syllable == key){
                var midiObj = {
                    syllable: key,
                    note: value,
                    duration: dur,
                    order: i
                }
                noteSylDurOrd.push(midiObj);
            }
        }
    }
    // playMus(noteSylDurOrd);
    //console.log("played muisc");
    return noteSylDurOrd;
}

module.exports = midify;