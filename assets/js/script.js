window.addEventListener('beforeunload', (event) => {
  event.preventDefault();
  event.returnValue = 'Are you sure you want to leave? You might lose unsaved changes.';
});


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
let optionButton = document.querySelectorAll(".option-button");
let advOptionButton = document.querySelectorAll(".adv-option-button");
let text = document.getElementById('text-input');
let fullScreen = document.getElementById('fullScreen');
let info = document.getElementById('info')
let infoContent = document.getElementById('infoContent')
let overlay = document.getElementById("overlay");
let downloadBtn = document.getElementById("download");
let upload = document.getElementById("upload");
let uploadBtn = document.getElementById("uploadBtn");


let savedinnerHTML = [];
let formatIndexArray = [];
let currentIndex = -1;

info.addEventListener("click", () => {
  const isCurrentlyVisible = infoContent.style.display === "block";

  infoContent.style.display = isCurrentlyVisible ? "none" : "block";
  overlay.style.display = isCurrentlyVisible ? "none" : "block";
});

overlay.addEventListener("click", () => {
  infoContent.style.display = "none";
  overlay.style.display = "none";
});

infoContent.addEventListener("click", (e) => {
  e.stopPropagation(); 
});

function endsWithFormattingOrNBSP(textContent) {
  const formattingTags = ["em", "sub", "sup", "u", "strike", "b"];
  
  let endsWithTag = false;
  
  formattingTags.forEach(() => {
    const formattedEnd = `}>`;
    if (textContent.endsWith(formattedEnd)) {
      endsWithTag = true;
    }
  });

  const endsWithList = textContent.endsWith("l>");
  const endsWithNBSP = textContent.endsWith('&nbsp;');
  
  return endsWithTag || endsWithNBSP || endsWithList;
}

function checkSpace() {
  const textContent = text.innerHTML

  if (!endsWithFormattingOrNBSP(textContent)) {
    text.innerHTML += '&nbsp;';
  }

  save();
}

fullScreen.addEventListener("click", () => {
  const element = document.documentElement;

  if (!document.fullscreenElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});


document.addEventListener("keydown", (event) => {
  if (event.ctrlKey) {
    if (event.key === 's'){
      event.preventDefault();
      checkSpace();
      filterSavedContent();
      getLastListItem("li");
    }else if(event.key === 'b'){
      event.preventDefault();
      combineFunctions("b");
    }else if(event.key === 'i'){
      event.preventDefault();
      combineFunctions("em");
    }else if(event.key === 'u'){
      event.preventDefault();
      combineFunctions("u");
    }
  }
});

function updateFontColor(color) {
  text.style.color = color;
}

foreColor.addEventListener("change", (e) => {
  const selectedColor = e.target.value;
  updateFontColor(selectedColor); 
  save(); 
});


function updateFontFamily(fontFamily) {
  text.style.fontFamily = fontFamily;
} 

fontName.addEventListener("change", (e) => {
  const selectedFont = e.target.value; 
  updateFontFamily(selectedFont); 
  save();
});


function isInsideList() {
  const selection = document.getSelection();
  if (selection && selection.rangeCount > 0) {
    const startContainer = selection.getRangeAt(0).startContainer;
    const parent = startContainer.nodeType === Node.TEXT_NODE
      ? startContainer.parentNode
      : startContainer;

    return parent.closest("ul, ol"); 
  }

  return false; 
}


text.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); 

    const listContext = isInsideList();
    if (listContext) {
      const newListItem = document.createElement("li");
      newListItem.appendChild(document.createElement("br"));
      listContext.appendChild(newListItem);

      const selection = document.getSelection();
      const range = document.createRange();
      range.setStart(newListItem, 0);
      range.collapse(true);

      selection.removeAllRanges(); 
      selection.addRange(range); 
    } else {
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
  }
});


function filterSavedContent() {
  save();

  savedinnerHTML = savedinnerHTML.map(item => item.replace(/\*/gi, ''));
  
  if (savedinnerHTML.length > 0) {
    text.innerHTML = savedinnerHTML[savedinnerHTML.length - 1];
  }
}

function save() {
  const currentText = text.innerHTML

  if (currentText === '' || currentText === '&nbsp;') {
    return;  
  }

  if (savedinnerHTML.length === 0 || currentText !== savedinnerHTML[currentIndex]) {
    if (currentIndex < savedinnerHTML.length - 1) {
      savedinnerHTML = savedinnerHTML.slice(0, currentIndex + 1);
    }

    savedinnerHTML.push(currentText);
    currentIndex++;

    console.log("Content saved:", savedinnerHTML[currentIndex]);
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
    text.innerHTML = savedinnerHTML[item] + `<size style="font-size:${selectedSize};">*</size>`;
  });
});


formatBlock.addEventListener("change", (e) => {
  const selectedSize = e.target.value;

  let formatIndex = currentIndex;
  formatIndexArray.push(formatIndex);
  formatIndexArray.forEach(item => {
    text.innerHTML = savedinnerHTML[item] + `<div style="font-size:${selectedSize};">*</div>`;
  });
});


function  combineFunctions(tag){
  save();
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) {
    textSelection(tag);
  } else {
    textFormatting(tag);
  }
};


bold.addEventListener("click", () => {combineFunctions("b");});
italic.addEventListener("click", () => {combineFunctions("em");});
underline.addEventListener("click", () => {combineFunctions("u");});
strikethrough.addEventListener("click", () => {combineFunctions("strike");});
superscript.addEventListener("click", () => {combineFunctions("sup");});
subscript.addEventListener("click", () => {combineFunctions("sub");});




const listArray = [];

function creatingListTypes(listType, listItem) {
  const existingLists = text.querySelectorAll(listType);

  if (existingLists.length > 0) {
    const lastList = existingLists[existingLists.length - 1];
    const newListItem = document.createElement(listItem);
    newListItem.textContent = '*';
    lastList.appendChild(newListItem);
  } else {
    const newList = document.createElement(listType);
    const newListItem = document.createElement(listItem);
    newListItem.textContent = '*';
    newList.appendChild(newListItem);
    text.appendChild(newList);
  }

  save();
}

const extractedContentArray = [];

function getLastListItem(listItem) {
  const content = savedinnerHTML[currentIndex];
  const lastOpenTagIndex = content.lastIndexOf(`<${listItem}>`);

  const closingTag = `</${listItem}>`;
  const closingTagIndex = content.indexOf(closingTag, lastOpenTagIndex);

  const extractedContent = content.substring(
    lastOpenTagIndex,
    closingTagIndex + closingTag.length
  );

  extractedContentArray.push(extractedContent);
  // console.log('Extracted Content:', extractedContentArray);
}

insertOrderedList.addEventListener("click", () => {
  creatingListTypes("ol", "li");
});

insertUnorderedList.addEventListener("click", () => {
  creatingListTypes("ul", "li");
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

justifyLeft.addEventListener("click", () => {setSelectionAlignment("left");});
justifyCenter.addEventListener("click", () => {setSelectionAlignment("center");});
justifyRight.addEventListener("click", () => {setSelectionAlignment("right");});
justifyFull.addEventListener("click", () => {setSelectionAlignment("justify");}); 




// download

downloadBtn.addEventListener("click", () => {

  filterSavedContent();

  const wordContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><title>Document</title></head>
      <body>${text.innerHTML}</body>
    </html>
  `;

  const blob = new Blob([wordContent], { type: "application/msword" });
  const downloadLink = document.createElement("a");
  
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "formatted-text.doc";
  downloadLink.click(); 
});

// upload

uploadBtn.addEventListener("click", () => {
  upload.click();
});

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      text.innerHTML = fileContent;
      
      savedinnerHTML.push(fileContent);
      currentIndex = savedinnerHTML.length - 1;
    };

    reader.readAsText(file);
  }
});

// exit or not
