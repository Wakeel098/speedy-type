 const words="The quick brown fox jumps over the lazy dog while swiftly evading the sneaky sly cats In the stillness of the night the gentle breeze whispers secrets of the stars Bright ideas often emerge from the quiet moments we cherish most".split(" ")
//  console.log(words[40])
 const gameTime=30*1000;
 window.timer=null;
 window.gameStart=null




function addClass(el,Cname){
    el.className+=" "+Cname;
}

function removeClass(el,Cname){
    el.className=el.className.replace(Cname,"");
}


const wordCount=words.length
// console.log(wordCount)
const randomWord=()=>{
     
    const randomIndex= Math.ceil(Math.random()*wordCount)
// console.log(randomIndex)
// console.log(words[randomIndex])
    return(words[randomIndex-1])
}
// console.log(randomWord()) 


function formatWord(word){
     return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

 function Game(){
   let wordB= document.querySelector(".words") 
    wordB.innerHTML="";
    for(let i=0;i<250;i++){
        

      let  wb=randomWord()
        // console.log(wb)
          wordB.innerHTML+=formatWord(wb);

        //   if(i===1){
                    document.querySelector(".cursor").style.left =wordB.getBoundingClientRect().left+'px'
        //   }
    }

    addClass(document.querySelector(".word"),"current")
    addClass(document.querySelector(".letter"),"current")
      
    document.querySelector(".info").innerHTML=gameTime/1000;

    window.timer=null;
    
    }


    function getWpm() {
        const words = [...document.querySelectorAll('.word')];
        const lastTypedWord = document.querySelector('.word.current');
        const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
        const typedWords = words.slice(0, lastTypedWordIndex);
        const correctWords = typedWords.filter(word => {
          const letters = [...word.children];
          const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
          const correctLetters = letters.filter(letter => letter.className.includes('correct'));
          return incorrectLetters.length === 0 && correctLetters.length === letters.length;
        });
        return correctWords.length / gameTime * 60000;
      }
      


function gameOver(){

   clearInterval( window.timer)
  addClass( document.querySelector(".game"), "game-over" )

  document.querySelector("#focus-error").style.display="none"

  document.querySelector(".info").innerHTML=`WPM : ${getWpm()}`

}









    document.querySelector(".game").addEventListener("keyup", ev => {
        const key = ev.key;
        const currentWord=document.querySelector(".word.current")
        const currentLetter = document.querySelector(".letter.current");
        const expected = currentLetter?.innerHTML || ' ';
        const isLetter = key.length === 1 && key !== ' ';
        const isSpace=key===' ';
        const isBackspace=key==='Backspace';
        const isFirstLetter= currentLetter===currentWord.firstChild;
        const isExtra = document.querySelector(".letter.incorrect.extra");
         


        if(document.querySelector(".game.game-over")){
            return;
        }



        if(!window.timer && isLetter){

            window.timer=setInterval(() => {

                if(!window.gameStart){
                       window.gameStart=(new Date()).getTime();


                }
                const currentTime=(new Date()).getTime();
                const TimePassedInms=currentTime-window.gameStart;
                const TimePassedInSeconds=Math.round(TimePassedInms/1000);
                const secondsLeft=(gameTime/1000)-TimePassedInSeconds;

                 if(secondsLeft <= 0){
                    //alert("game over")
                    gameOver();
                    return
                 }
             


           document.querySelector(".info").innerHTML=secondsLeft;
            

                
            },  1000);
           // alert("start your timer")
        }
     

   // const isFirstWordOfPara=currentWord===document.querySelector(".words").firstChild;
    // if(isFirstWordOfPara){
    //     console.log("thi is fisrt")
    // }

        

        console.log(key)
        if (isLetter) {
            if (currentLetter) {
                // if (key === expected) {
                //     addClass(currentLetter, 'correct');
                // } else {
                //     addClass(currentLetter, 'incorrect');
                // }
    
                // removeClass(currentLetter, 'current');
                // if (currentLetter.nextSibling) {
                //     addClass(currentLetter.nextSibling, 'current');
                // }


                addClass(currentLetter,key===expected? 'correct':'incorrect');
                removeClass(currentLetter,"current")
                if(currentLetter.nextSibling){
                    addClass(currentLetter.nextSibling,"current")
                }

            }
            else{
                const incorrectLetter=document.createElement("span");
                incorrectLetter.innerHTML=key 
                incorrectLetter.className='letter incorrect extra';
                currentWord.appendChild(incorrectLetter)


            }
              
        }

      //sapce
       if(isSpace){
        if(expected!==' '){
            lettersToInvalidate=[...document.querySelectorAll(".word.current .letter:not(.correct)")]
             lettersToInvalidate.forEach(letter => {
                addClass(letter,'incorrect')
                
             });
        }

        removeClass(currentWord,"current");
        addClass(currentWord.nextSibling,"current")
        if(currentLetter){
            removeClass(currentLetter,"current")
        }
        addClass(currentWord.nextSibling.firstChild,"current")

       }

      //Backspace

      if(isBackspace){
        // if(!isFirstWordOfPara && isFirstLetter){

        if(isExtra){
            currentWord.removeChild(isExtra)
        }
       else if(currentLetter && isFirstLetter){
           // make prev word current and last letter of prev word current
           removeClass(currentWord,"current");
           addClass(currentWord.previousSibling,'current')
           removeClass(currentLetter,"current");
           addClass(currentWord.previousSibling.lastChild,"current")

           removeClass(currentWord.previousSibling.lastChild,"incorrect")
           removeClass(currentWord.previousSibling.lastChild,"correct")



        }
      else  if(currentLetter && !isFirstLetter){
            // move back 1 letter
            removeClass(currentLetter,"current")
            addClass(currentLetter.previousSibling,"current")

            removeClass(currentLetter.previousSibling,"incorrect")
           removeClass(currentLetter.previousSibling,"correct")


        }
       else if(!currentLetter){
            addClass(currentWord.lastChild,'current')
            removeClass(currentWord.lastChild,"incorrect")
            removeClass(currentWord.lastChild,"correct")
        }
      

    //   }

    }

      //scroll
      if(currentWord.getBoundingClientRect().top > 200){
        //  alert("move")
        // const words=document.querySelector(".words");
        // words.style.marginTop='-30px'
        currentWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }



       //cursor
       const nextWord=document.querySelector('.word.current');
       const nextLetter = document.querySelector('.letter.current');
       const cursor=document.querySelector('.cursor')
       //console.log(nextLetter)
       if(nextLetter){
        cursor.style.top=nextLetter.getBoundingClientRect().top+2+'px'
        cursor.style.left =nextLetter.getBoundingClientRect().left+'px'
       }
       else{
        cursor.style.top=nextWord.getBoundingClientRect().top+2+'px'
        cursor.style.left =nextWord.getBoundingClientRect().right+'px'

       }


    });

   

document.querySelector(".new-game-btn").addEventListener("click",()=>{
    location.reload();
});




 Game();




 