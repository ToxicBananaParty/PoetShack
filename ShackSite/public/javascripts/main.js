

var active = false;
var selectedGif = 0;
var shareToggled = false;
document.addEventListener('click', function(event){
    var et = event.target;

    if(et.className.match('im_in')) {
      document.querySelector('.explain').style.display = 'none';
      document.querySelector('.tut').style.display = 'block';
      document.querySelector('.introHeader').style.display = 'none';
      document.querySelector('.tutHeader').style.display = 'flex';
      
      
    }

    if (et.className.match('share-btn-container') || et.className.match('share-btn')) {
      if (shareToggled) {
        shareToggled = false;
        document.querySelector('.popup').classList.toggle('animate');
        // document.querySelector('.popup').style.display = 'none';
      } else {
        shareToggled = true;
        document.querySelector('.popup').classList.toggle('animate');
        // document.querySelector('.popup').style.display = 'flex';

      }
    }

    // console.log(et);
    // Changes selected gif based on arrows
    var previousSelected = selectedGif;
    if (et.className.match('forwardArrow') && selectedGif == 20) {
      selectedGif = 0;
      console.log(selectedGif);
      
      document.getElementById(''+selectedGif+'').checked = true;
      
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+previousSelected);
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+selectedGif);
    } else if (et.className.match('backArrow') && selectedGif == 0) {
      selectedGif = 20
      
      console.log(selectedGif);
      document.getElementById(''+selectedGif+'').checked = true;
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+previousSelected);
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+selectedGif);
    } else if (et.className.match('forwardArrow')) {
      selectedGif++;
      console.log(selectedGif);
    
      document.getElementById(''+selectedGif+'').checked = true;
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+previousSelected);
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+selectedGif);
    } else if (et.className.match('backArrow')) {
      selectedGif = selectedGif - 1;
      console.log(selectedGif);
      document.getElementById(''+selectedGif+'').checked = true;
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+previousSelected);
      document.getElementsByClassName('pickerDiv')[0].classList.toggle('gif'+selectedGif);
    }
   
    // for (i=0; i <= 20; i++) {
    //   if (et.id === '' + i + '') {
    //     alert(i);
    //     console.log(document.getElementsByClassName('pickerDiv'));
    //     console.log(document.getElementsByClassName('pickerDiv')[0].classList[1]);
    //     var prev = document.getElementsByClassName('pickerDiv')[0].classList[1];
    //     document.getElementsByClassName('pickerDiv')[0].classList.toggle(prev);
        

    //   }
    // }

    //Shows what is being clicked. useful for debugging

    // Opens mobile nav drop down
    else if (et.className.match("hamburger")) {
      if (active == false) {
        active = true;
      } else {
        active = false;
      }
      document.querySelector(".hamburger").classList.toggle("open");
      document.querySelector("header").classList.toggle("openHeader");
      document.querySelector(".nav").classList.toggle("openNav");
      if (active) {
        document.querySelector(".nav").style.display = 'flex';
      } else {
        document.querySelector(".nav").style.display = 'none';
      }
    }
    else if (et.classList.contains('nextSection') || et.classList.contains('closeIntro')){
       document.querySelector('.introCont').style.display = 'none';
    }
    else if (et.classList.contains('gettingStarted')){
        document.querySelector('.introCont').style.display = 'block';
        document.querySelector('.openHeader').style.display = "none";
    }
    else if (et.classList.contains('next')) {
      document.querySelector('.gifPicker').style.display = 'flex';
      document.querySelector('.p1').style.display = 'none';
    } else if (et.classList.contains('back')) {
      document.querySelector('.gifPicker').style.display = 'none';
      document.querySelector('.p1').style.display = 'flex';
    }else if(et.classList.contains("poem")) {
        var poemHeader = et.closest(".poemRedirect");
        window.location.href = "https://poetshack.com/poems?pid=" + poemHeader.dataset.pid;
        // window.location.href = "http://localhost:3000/poems?pid=" + poemHeader.dataset.pid; 
        
    }else if(et.classList.contains("more")){
      var moreEl = document.createElement("div");
      moreEl.classList = "modal";
      moreEl.id = "menu";
      moreEl.innerHTML = "<header><h1>Poet Shack Logo</h1><img class='close' src='close.svg'></header><nav><a href='/meet'>who we are</a><a href='/history'>the poet's shack</a><a href='/about'>about the project</a></nav>";
      document.body.appendChild(moreEl);
    }else if(et.classList.contains("closeButton")) {
      window.location.href = "https://poetshack.com";
    }else if(et.classList.contains("arcloseButton")) {
      window.location.href = "https://poetshack.com/ar";
    }else if(et.classList.contains("headerRe")){
      window.location.href = "https://poetshack.com";
    } 
   

  });

  // window.onload = function() { 
    var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search

    // alert(newURL);
    console.log(newURL);
 
    var navIcons = document.getElementsByClassName('navIcon');
    var navIconImage = document.getElementsByClassName('navIconImage');
    console.log(navIconImage);
    if (!(newURL.includes('add')) && !(newURL.includes('ar'))) {
      // home
      navIcons[0].classList.toggle('active');
      console.log(navIconImage[0].attributes[2].value);
      navIconImage[0].attributes[2].value = 'homefilled.svg';
      
      



      // circles[0].classList.remove('circle-down');
      // circles[0].classList.add('circle-up');

      // // Remove circle from other nav buttons 
      // circles[1].classList.remove('circle-up');
      // circles[2].classList.remove('circle-up');
      // circles[1].classList.add('circle-down');
      // circles[2].classList.add('circle-down');
    } else if (newURL.includes('add')) {
       // Compose

       navIcons[1].classList.toggle('active');
       navIconImage[1].attributes[2].value = 'quillfill.svg';
       navIconImage[0].attributes[2].value = 'home_hallow.svg';





      // alert('add');
      // houseImg = 'homehallow.svg';
      // circles[1].classList.remove('circle-down');
      // circles[1].classList.add('circle-up');


      //   // Remove circle from other nav buttons
      //   circles[0].classList.remove('circle-up');
      //   circles[2].classList.remove('circle-up');
      //   circles[0].classList.add('circle-down');
      //   circles[2].classList.add('circle-down');
    } else if (newURL.includes('ar')) {
      // AR
      navIcons[2].classList.toggle('active');
      navIconImage[2].attributes[2].value = 'boxfilled.svg';







      // document.querySelector('.bottomNav').style.marginLeft = '353px';
      // houseImg = 'homehallow.svg';
      // circles[2].classList.remove('circle-down');
      // circles[2].classList.add('circle-up');
      

      // // Remove circle from other nav buttons
      // circles[0].classList.remove('circle-up');
      // circles[1].classList.remove('circle-up');
      // circles[0].classList.add('circle-down');
      // circles[1].classList.add('circle-down');
    } 