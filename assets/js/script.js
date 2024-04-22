let bold = document.getElementById('bold');
let italic = document.getElementById('italic');
let underline = document.getElementById('underline');
let strikethrough = document.getElementById('strikethrough');
let superscript = document.getElementById('superscript');
let subscript = document.getElementById('subscript');
let insertOrderedList = document.getElementById('insertOrderedList');
let insertUnorderedList = document.getElementById('insertUnorderedList');
let undo = document.getElementById('undo');
let redo = document.getElementById('redo');
let justifyLeft = document.getElementById('justifyLeft');
let justifyCenter = document.getElementById('justifyCenter');
let justifyRight = document.getElementById('justifyRight');
let justifyFull = document.getElementById('justifyFull');
let indent = document.getElementById('indent');
let outdent = document.getElementById('outdent');
let formatBlock = document.getElementById('formatBlock');
let fontName = document.getElementById('fontName');
let fontSize = document.getElementById('fontSize');
let foreColor = document.getElementById('foreColor');
let backColor = document.getElementById('backColor');
let optionButton = document.querySelectorAll(".option-button");
let advOptionButton = document.querySelectorAll(".adv-option-button");
let text = document.getElementById('text-input');

let savedTextContent = [];
let currentIndex = -1;

function save() {
  const currentText = text.textContent.trim();
  if (currentText === '') {
    return;
  }

  if (savedTextContent.length === 0 || currentText !== savedTextContent[currentIndex]) {
    if (currentIndex < savedTextContent.length - 1) {
      savedTextContent = savedTextContent.slice(0, currentIndex + 1);
    }

    savedTextContent.push(currentText);
    currentIndex++;
    console.log("Content saved:", savedTextContent);
  }
}

function undoMethod() {
  if (currentIndex > 0) { 
    currentIndex--;
    text.textContent = savedTextContent[currentIndex];
  }else{
    text.textContent = "";
  }
}

function redoMethod() {
  if (currentIndex < savedTextContent.length - 1){
    currentIndex++
    text.textContent = savedTextContent[currentIndex]
  }
}

function textFormatting(tag) {
  const selection = document.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0); 

    const newElement = document.createElement(tag);

    range.surroundContents(newElement);
  }
}

bold.addEventListener("click", () => {
  textFormatting("b"); 
  save();
});

italic.addEventListener("click", () => {
  textFormatting("em"); 
  save();
});

underline.addEventListener("click", () => {
  textFormatting("u"); 
  save();
});

strikethrough.addEventListener("click", () => {
  textFormatting("strike");
  save();
});

superscript.addEventListener("click", () => {
  textFormatting("sup"); 
  save();
});

subscript.addEventListener("click", () => {
  textFormatting("sub"); 
  save();
});



document.addEventListener("click", (event) => {
  if (event.target !== text) {
    save();
  }
});

undo.addEventListener("click", () => {
  if (text.textContent != '') {
    undoMethod()}
  }
);

redo.addEventListener("click", () => {
  redoMethod();
});


