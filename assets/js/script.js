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
let format = document.getElementById('format');

let savedinnerHTML = [];
let formatIndexArray = [];
let currentIndex = -1;

function endsWithFormattingOrNBSP(textContent) {
  const formattingTags = ["em", "sub", "sup", "u", "strike", "b"];
  
  let endsWithTag = false;
  
  formattingTags.forEach((tag) => {
    const formattedEnd = `>*<\/${tag}>`;
    if (textContent.endsWith(formattedEnd)) {
      endsWithTag = true;
    }
  });

  const endsWithNBSP = textContent.endsWith('&nbsp;');
  
  return endsWithTag || endsWithNBSP;
}

function checkSpace() {
  const textContent = text.innerHTML.trim();

  if (!endsWithFormattingOrNBSP(textContent)) {
    text.innerHTML += '&nbsp;';
  }

  save();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "\\") {
    event.preventDefault();
    checkSpace();
  }
});

document.addEventListener("click", (event) => {
  if (event.target !== text) {
    checkSpace();
  }
});

function updateFontFamily(fontFamily) {
  text.style.fontFamily = fontFamily;
} 

fontName.addEventListener("change", (e) => {
  const selectedFont = e.target.value; 
  updateFontFamily(selectedFont); 
  save();
});


text.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); 
    const selection = document.getSelection();

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const newDiv = document.createElement("div");
      newDiv.appendChild(document.createElement("br")); 
      
      range.deleteContents(); 
      range.insertNode(newDiv); 
      
      const newRange = document.createRange();
      newRange.setStart(newDiv, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }
});

function filterSavedContent() {
  save();

  savedinnerHTML = savedinnerHTML.map(item => item.replace(/\*/gi, ''));
  
  if (savedinnerHTML.length > 0) {
    text.innerHTML = savedinnerHTML[savedinnerHTML.length - 1];
  }
}

format.addEventListener("click", () => {
  filterSavedContent();
  save();
});


function save() {
  const currentText = text.innerHTML.trim();

  if (currentText === '' || currentText === '&nbsp;') {
    return;
  }

  if (savedinnerHTML.length === 0 || currentText !== savedinnerHTML[currentIndex]) {
    if (currentIndex < savedinnerHTML.length - 1) {
      savedinnerHTML = savedinnerHTML.slice(0, currentIndex + 1);
    }

    savedinnerHTML.push(currentText);
    currentIndex++;

    console.log("Content saved:", savedinnerHTML);
  }
}





function undoMethod() {
  if (currentIndex > 0) { 
    currentIndex--;
    text.innerHTML = savedinnerHTML[currentIndex];
  }else{
    text.innerHTML = "";
  }
}

function redoMethod() {
  if (currentIndex < savedinnerHTML.length - 1){
    currentIndex++
    text.innerHTML = savedinnerHTML[currentIndex]
  }
}

function textSelection(tag) {   
  const selection = document.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0); 

    const newElement = document.createElement(tag);

    range.surroundContents(newElement);
  }
}


function textFormatting(tag) {
  let formatIndex = currentIndex;

  formatIndexArray.push(formatIndex);

  formatIndexArray.forEach(item => {
    text.innerHTML =  savedinnerHTML[item] + `<${tag}>*</${tag}>`;
  });
} 

fontSize.addEventListener("change", (e) => {
  const selectedSize = e.target.value;

  let formatIndex = currentIndex;
  formatIndexArray.push(formatIndex);
  formatIndexArray.forEach(item => {
    text.innerHTML = savedinnerHTML[item] + `<div style="font-size:${selectedSize};">*</div>`;
  });
});



bold.addEventListener("click", () => {
  save();
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) {
    textSelection("b");
  } else {
    textFormatting("b");
  }
});


italic.addEventListener("click", () => {
  save();
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) { 
    textSelection("em");
  } else {
    textFormatting("em");
  }  save();
});

underline.addEventListener("click", () => {
  save();
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) {  
    textSelection("u");
  } else {
    textFormatting("u");
  }  save();
});

strikethrough.addEventListener("click", () => {
  save();
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) { 
    textSelection("strike");
  } else {
    textFormatting("strike");
  }
  save();
});

superscript.addEventListener("click", () => {
  save();
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) { 
    textSelection("sup");
  } else {
    textFormatting("sup");
  }
  save();
});

subscript.addEventListener("click", () => {
  save();
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) { 
    textSelection("sub");
  } else {
    textFormatting("sub");
  }
  save();
});



document.addEventListener("click", (event) => {
  if (event.target !== text) {
    save();
  }
});

undo.addEventListener("click", () => {
  if (text.innerHTML != '') {
    undoMethod()}
  }
);

redo.addEventListener("click", () => {
  redoMethod();
});


function setSelectionAlignment(alignment) {
  const selection = document.getSelection();
  
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    let startContainer = range.startContainer;
    let endContainer = range.endContainer;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      startContainer = startContainer.parentNode;
    }
    
    if (endContainer.nodeType === Node.TEXT_NODE) {
      endContainer = endContainer.parentNode;
    }

    const newWrapper = document.createElement("div");
    newWrapper.style.textAlign = alignment;

    const fragment = range.cloneContents();
    newWrapper.appendChild(fragment);

    range.deleteContents();

    range.insertNode(newWrapper);

    const newRange = document.createRange();
    newRange.selectNodeContents(newWrapper);

    selection.removeAllRanges();
    selection.addRange(newRange);

    save(); 
  }
}

justifyLeft.addEventListener("click", () => {
  setSelectionAlignment("left");
});

justifyCenter.addEventListener("click", () => {
  setSelectionAlignment("center");
});

justifyRight.addEventListener("click", () => {
  setSelectionAlignment("right");
});

justifyFull.addEventListener("click", () => {
  setSelectionAlignment("justify");
}); 

