//array for memo (objects) presented in task board
var memos = []; 

//array for Error Messages to manage user input errors
var errorMessages = [];

//function executed on page load 
function pageInit() {
 
    setDateTime();
    setCursor();
    loadMemos();
} 

function setDateTime() {
 
    var currentDate = new Date();   
    document.getElementById("memoDate").valueAsDate = currentDate;

    var hours = currentDate.getHours();
    var minute = currentDate.getMinutes();
    if(hours < 10) {
        hours = '0' + hours; 
    }
    if(minute < 10) { 
        minute = '0' + minute; 
    }
    document.getElementById("memoTime").value = hours + ":" + minute; 
}

//position cursor on memo content field 
function setCursor() { 
 
    document.getElementById("memoContent").focus();
    document.getElementById("memoContent").select();
}

function loadMemos() {
 
    var memos_from_localStorage = localStorage.getItem("memos_local"); 
    if(memos_from_localStorage != null) {   //previously stored memos for user found
        memos = JSON.parse(memos_from_localStorage); 
        attachMemos(false);
    }
}

//input parm newMemo: assign fade in effect to new memo => if function called without input parameter: assign value false => no fade-in 
function attachMemos(newMemo = false) {
    
    var memosList = document.getElementById("memos");
    memosList.innerHTML = ""; //clear previous memos before attaching new memos 

    for (var index = memos.length -1 ; index >=  0; index--)  //backwards loop => display latest memo first 
    {
      var memoBackground = document.createElement("div"); 
      var deleteButton = document.createElement("button"); 
      var memoContent = document.createElement("textarea");
      var memoDate = document.createElement("label");
      var lineBreak = document.createElement('br');
      var memoTime = document.createElement("label");

      handle_memoBackground_Element(memoBackground, (index == memos.length -1 && newMemo) ? " fade-in" : ""); //if this memo has just been added (latest memo and newMemo)  add fade-in css class
      handle_deleteButton_Element(deleteButton, index);
      handle_memoContent_Element(memoContent, memos[index].content);
      handle_memoDate_Element(memoDate, memos[index].date);
      handle_memoTime_Element(memoTime, memos[index].time);

      memoBackground.appendChild(deleteButton);
      memoBackground.appendChild(memoContent);
      memoBackground.appendChild(memoDate);
      memoBackground.appendChild(lineBreak);
      memoBackground.appendChild(memoTime);  

      memosList.appendChild(memoBackground);
    }
}

function handle_memoBackground_Element(memoBackground, fadeIn) {

   memoBackground.className ="col-xs-12 col-sm-6 col-md-4 col-lg-3 memo-background " + fadeIn;
}        

function handle_memoContent_Element(memoContent, content) {
 
      memoContent.className = "form-control memo";
      Object.assign(memoContent.style, { height: "140px", background: "transparent"}); //this attribute does not work in css class
      memoContent.disabled = "true";
      memoContent.background = "transparent";
      memoContent.appendChild(document.createTextNode(content));
}

function handle_memoDate_Element(memoDate, date) {
 
      var dtString = date;
      var dateString = dtString.slice(8, 10) + "/" + 
                       dtString.slice(5, 7) + "/" + 
                       dtString.slice(0, 4);
      memoDate.appendChild(document.createTextNode(dateString));                  
}

function handle_deleteButton_Element(deleteButton, index) {
 
      deleteButton.className = "btn btn-link"; 
      var GlyphiconSpan = document.createElement("span");
      GlyphiconSpan.className = "glyphicon glyphicon-trash deleteButton"; 
      deleteButton.appendChild(GlyphiconSpan);
      deleteButton.id = index; 
      deleteButton.addEventListener("click", DeleteMemo, true);
}

function handle_memoTime_Element(memoTime, time) {

      memoTime.appendChild(document.createTextNode(time));
}


function saveMemo() {
 
    errorMessages.length = 0; //delete any error messages from previous saves 
    var memoDate = document.getElementById("memoDate").value;
    var memoTime = document.getElementById("memoTime").value; 
    var memoContent = document.getElementById("memoContent").value;

    if(inputValid(memoDate, memoTime, memoContent)) {
        var MemoObject = { date: memoDate, time: memoTime, content: memoContent };
        memos.push(MemoObject);
        localStorage.setItem("memos_local", JSON.stringify(memos));
        attachMemos(true);
        document.getElementById("errorMessages").style.display = 'none';
        setDateTime();
        setCursor();
        document.getElementById("memoContent").value = "";
    }
    else {
        document.getElementById("errorMessages").style.display = 'block';
        document.getElementById("errorMessages").innerText = errorMessages.join("");
    }

    return false;
}

function inputValid(memoDate, memoTime, memoContent) {
 
    checkDate(memoDate);
    checkTime(memoTime);
    checkContent(memoContent);
    return errorMessages.length == 0; //errorMessages.length == 0 => no errors were made
}

function checkDate(memoDate) {
 
    var date = Date.parse(memoDate);
    if (memoDate == "") {
       errorMessages.push("Date Required \n");
    }
    if(isNaN(date) && memoDate != "") { //if necessary for browsers that do NOt support <input type="date"
       errorMessages.push("Date Format Invalid \n");
    }
}

//this function is necessary for browsers that do NOT support <input type="time"
function checkTime(memoTime) {
 
    var time = Date.parse("2017-01-01 " + memoTime);//must add date string before memoTime for Date.parse function to work properly
    if(isNaN(time) && memoTime != "") {
       errorMessages.push("Time Format Invalid \n");
    }
}

function checkContent(memoContent) {

    if (memoContent.trim() == "") {
       errorMessages.push("Memo Content Required \n");
    }
    else { //check for malicious content -> html inside memo content
            var pattern = new RegExp("<|/>");
            if(pattern.test(memoContent)) {
                errorMessages.push("Malicious Content found \n");
            }
        }
}

function DeleteMemo() { 

   memos.splice(this.id, 1);
   localStorage.removeItem('memos_local');
   localStorage.setItem("memos_local", JSON.stringify(memos));
   attachMemos(false);
}
