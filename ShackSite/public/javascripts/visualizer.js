var longSlydur = 10; //this is the duration modifier for any note that is longer than the number of milliseconds used later in an if check
var slydur = 300; //this is the default duration modifier
    window.onload = function(){
      //adding events and styles to the buttons
      document.querySelector("button").addEventListener("click", () => { 
        //show gif and close button on play and hide play button
        document.getElementById('dis').style.display = 'flex';
        document.getElementById('visualizerCloseButton').style.display = 'flex';
        document.getElementById('visualizerPlayButton').style.display = 'none';
        displayText();
      });
      document.querySelector("#visualizerCloseButton").addEventListener("click", () => {
        //refresh page to close visualizer (easier than exiting the loop on click)
        location.reload();
      });
    }
    
function getUrlVars() {
    //get variables from the url to use in javascript
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          vars[key] = value;
      });
      return vars;
}
var pid = getUrlVars("pid"); //set poem id with getUrlVars
//Use fetch to get our api data based on the poem id from the url
fetch('https://poetshack.com/api/poems/' + pid.pid)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        poemData = data;
    })
    .catch(console.error);
const sampler = new Tone.Sampler(
  //create a new sampler with Tone.js
    {
        //audio samples to base sampler on, an Upright piano from the VSCO-2-CE (https://github.com/sgossner/VSCO-2-CE) library in this case
        C4: "C4.wav",
        G4: "G4.wav"
    },
    {
        onload: () => {
          //remove the disabled attribute when the sampler finished loading
          document.querySelector("button").removeAttribute("disabled");
        }
    }
).toMaster();    
function displayText() {
    //this is how we display the poem and play the audio along with it
    document.getElementById("dis").innerHTML =""; //clear innerHTML on start
    document.getElementById("dis").className = "gif" + poemData[0].gif; //get the gif and set the div class to it.
    var counter = -1; //loop counter
    var interval; //create a variable for our set interval later in this function.
    var wordDuration = wordDur();//call the word duration function to add syllables and their durations back into full words 
    var poem = JSON.parse(poemData[0].json); //parse the poem data json out of the server response.
    var duration = wordDuration[0][1] * slydur;//multiply duration by global modifier from begining of the code. Used to set the first interval in the loop
    if(duration >= 1500){//this is for when poems have too many words and their durations get too long. We switch to the other modifier. current check if for anything longer than 1.5 seconds
        duration = wordDuration[0][1] * longSlydur;
    }
    function repeat() {//function loop to allow variable setInterval calls)
        counter += 1; //increment counter
        interval = setInterval(function () { //set interval based on the duration of the first syllable
              clearInterval(interval); //clear the interval so it can be different the next time 'round.
              if (counter < wordDuration.length) {
                  document.getElementById("dis").innerHTML += "<span class='fadeIn'>" + wordDuration[counter][0] + " </span>"; //fade in a span with the word from the poem
                  //trigger a note based on the midi created with midify.js. duration gets an extra second so that the sound is more legato 
                  sampler.triggerAttackRelease(
                      poem.midis[counter].note,
                      poem.midis[counter].duration + 1
                  );
                  duration = wordDuration[counter][1] * slydur; //set the new duration for the next loop
                  if(duration >= 1500){ //same deal as above but happens if the sound is over 1.5 seconds
                      duration = wordDuration[counter][1] * longSlydur; 
                  }
                  setTimeout(function(){ //remove the fade in class on the spans so they dont repeat the animation in the next loop
                      var fade = document.querySelector(".fadeIn");
                      fade.classList.remove("fadeIn");
                  }, slydur);
                  repeat(); //repeat the loop
                }else {
                    counter = -1;
                }
        }, duration);
    }
    repeat(); //start the loop for the first time
}
var input;
function wordDur() {
    var poemjson = JSON.parse(poemData[0].json); //parse poem data from the api
    var poem = poemData[0].poem; //get the poem from the data
    input = poem.replace(/\r?\n|\r/gm, " "); //remove all new line characters with a regular expression (regex) and replace them with spaces
    var words = input.split(" "); //split words into an array by spaces
    //console.log(poem); //for troubleshooting
    var wordDuration = []; //make a blank array. it will be a double array so each element will look like this array[0] = [word,duration]
    for (var i = 0; i < words.length; i++) {//iterate over the length of words
        var dur = 0;
        for (var a = 0; a < poemjson.midis.length; a++) {
            if (words[i].includes(poemjson.midis[a].syllable)) {//find all sylables included in the word and increment based on the frequency in the poem
                dur++;
            }
        }
        var temp = [words[i], dur];//create a temporary array to push into word duration as one element
        wordDuration.push(temp);
    }
    return wordDuration;//return the words and their durations
}