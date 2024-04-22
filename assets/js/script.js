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

// if it is clicked any where other than text then the text will be saved in array every time textContent
let savedTextContent = [];
function save() {
  const currentText = text.textContent;
    if (savedTextContent.length === 0 || currentText !== savedTextContent[savedTextContent.length - 1]) {
    savedTextContent.push(currentText);
    console.log("Content saved:", savedTextContent);
  }
}
document.addEventListener("click", (event) => {
  if (event.target !== text) {
    save();
  }
});

function undoMethod() {
  savedTextContent.pop();
  text.textContent = savedTextContent[savedTextContent.length - 1];
}

undo.addEventListener("click", undoMethod);