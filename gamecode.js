
function load(difficult){
	  var randomNum=""
	
       for(i=0;i<difficult;i++){
		   randomNum+=String(Math.round((Math.random() * 9)))
		}
	  
	  return randomNum;
	}
	
function checkAnswer(answer,randomNum){

		//var answer = document.getElementById('answer').value;
		let result = ""
				 
		  win=0
		for(i=answer.length-1;i>=0;i--){

			 
		    if(answer[i]==randomNum[i]){			
			 result="B"+result
			 win++;
			 }
			else if(answer.indexOf(randomNum[i])>-1)
		     result="K"+result
			else 
			 result="-"+result 
		}

		if(win==answer.length)
		 return "youwin";
		else
		 return result;
	}
	
function namedTable(difficult){
	if(difficult == 1) return "easyrank"
	else if(difficult == 2) return "normalrank"
	else if(difficult == 3) return "hardrank"
	else if(difficult == 4) return "veryhardrank"
}

	
module.exports = { load, checkAnswer,namedTable};