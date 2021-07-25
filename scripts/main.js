//*****************************************//
/* Necessary Variables & Class */
//*****************************************//
//Encapuslating class which contains the note, the note's number which is used to determine which note to play
//when using the WebAudioFont package, whether or not the note is currently pressed (which is used to prevent the note
//from repeatedly playing while the key is pressed), and an AudioBufferSourceNode which will be used to stop the note
//when the key is released.
var NoteObject = /** @class */ (function () {
    function NoteObject(enteredNote, noteNum) {
        this.note = enteredNote;
        this.noteNumber = noteNum;
        this.notePressed = false;
    }
    return NoteObject;
}());
//"Map" object which maps keys on the keyboard to the various keys on the piano.
var keyBindings = new Map();
//Variables for accessing relevant DOM elements declared at the start for global access.
var canvas;
var canvasContainer;
var ctx;
var spanDiv;
//Keys' dimension variables declared at the start for global access.
var whiteKeyHeight;
var whiteKeyWidth;
var blackKeyHeight;
var blackKeyWidth;
var offset;
//*****************************************//
/* Initial Setup */
//*****************************************//
function setUp() {
    canvas = document.getElementById("pageCanvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvasContainer = document.getElementById("canvasDiv");
        //Heights of Canvas and Black & White Keys are Constant
        canvas.height = window.innerHeight * 0.8;
        whiteKeyHeight = canvas.height;
        blackKeyHeight = canvas.height * 0.55;
        //This sets the Div's size
        canvas.width = window.innerWidth * 29 / 14.0;
        //With the Div(i.e. "canvasContainer")'s size set,
        //the Canvas's and White Keys' Widths are set.
        //Initially, 24 Keys are shown, but the widths of the Canvas 
        //and Black & White Keys can change.
        canvas.width = canvasContainer.clientWidth * 29 / 14.0;
        whiteKeyWidth = canvasContainer.clientWidth / 14.0;
        blackKeyWidth = whiteKeyWidth * 0.6;
        /*Setting up the Spans/"Keys" container*/
        //The "offset"px of Paddding on the top helps align 
        //the spans with their respective keys.
        var canvasRect = document.getElementById("pageCanvas").getBoundingClientRect();
        var spanRect = document.getElementById("escape").getBoundingClientRect();
        offset = spanRect.top - canvasRect.top;
        spanDiv = document.getElementById("spanDiv");
        spanDiv.setAttribute("padding-top", -offset + "px");
        spanDiv.style.paddingTop = -offset + "px";
        //Setting the Width of the Span Div so that it spans across the entire piano.
        spanDiv.setAttribute("width", canvas.width + 3 + "px");
        spanDiv.style.width = canvas.width + 3 + "px";
        /* Setting default key bindings and mapping them to a object that encapsulates
           the note, its sound number, and "pressed' status.*/
        //First Octave
        keyBindings.set("escape", new NoteObject("C1", 0 + 12 * 3));
        keyBindings.set("f1", new NoteObject("C#/D♭1", 1 + 12 * 3));
        keyBindings.set("`", new NoteObject("D1", 2 + 12 * 3));
        keyBindings.set("f2", new NoteObject("D#/E♭1", 3 + 12 * 3));
        keyBindings.set("1", new NoteObject("E1", 4 + 12 * 3));
        keyBindings.set("2", new NoteObject("F1", 5 + 12 * 3));
        keyBindings.set("f3", new NoteObject("F#/G♭1", 6 + 12 * 3));
        keyBindings.set("3", new NoteObject("G1", 7 + 12 * 3));
        keyBindings.set("f4", new NoteObject("G#/A♭1", 8 + 12 * 3));
        keyBindings.set("4", new NoteObject("A1", 9 + 12 * 3));
        keyBindings.set("f5", new NoteObject("A#/B♭1", 10 + 12 * 3));
        keyBindings.set("5", new NoteObject("B1", 11 + 12 * 3));
        //Second Octave
        keyBindings.set("tab", new NoteObject("C2", 0 + 12 * 4));
        keyBindings.set("q", new NoteObject("C#/D♭2", 1 + 12 * 4));
        keyBindings.set("capslock", new NoteObject("D2", 2 + 12 * 4));
        keyBindings.set("w", new NoteObject("D#/E♭2", 3 + 12 * 4));
        keyBindings.set("a", new NoteObject("E2", 4 + 12 * 4));
        keyBindings.set("s", new NoteObject("F2", 5 + 12 * 4));
        keyBindings.set("e", new NoteObject("F#/G♭2", 6 + 12 * 4));
        keyBindings.set("d", new NoteObject("G2", 7 + 12 * 4));
        keyBindings.set("r", new NoteObject("G#/A♭2", 8 + 12 * 4));
        keyBindings.set("f", new NoteObject("A2", 9 + 12 * 4));
        keyBindings.set("t", new NoteObject("A#/B♭2", 10 + 12 * 4));
        keyBindings.set("g", new NoteObject("B2", 11 + 12 * 4));
        //Third Octave
        keyBindings.set("u", new NoteObject("C3", 0 + 12 * 5));
        keyBindings.set("i", new NoteObject("C#/D♭3", 1 + 12 * 5));
        keyBindings.set("j", new NoteObject("D3", 2 + 12 * 5));
        keyBindings.set("o", new NoteObject("D#/E♭3", 3 + 12 * 5));
        keyBindings.set("k", new NoteObject("E3", 4 + 12 * 5));
        keyBindings.set("l", new NoteObject("F3", 5 + 12 * 5));
        keyBindings.set("p", new NoteObject("F#/G♭3", 6 + 12 * 5));
        keyBindings.set(";", new NoteObject("G3", 7 + 12 * 5));
        keyBindings.set("[", new NoteObject("G#/A♭3", 8 + 12 * 5));
        keyBindings.set("'", new NoteObject("A3", 9 + 12 * 5));
        keyBindings.set("]", new NoteObject("A#/B♭3", 10 + 12 * 5));
        keyBindings.set("enter", new NoteObject("B3", 11 + 12 * 5));
        //Fourth Octave
        keyBindings.set("f6", new NoteObject("C4", 0 + 12 * 6));
        keyBindings.set("f7", new NoteObject("C#/D♭4", 1 + 12 * 6));
        keyBindings.set("7", new NoteObject("D4", 2 + 12 * 6));
        keyBindings.set("f8", new NoteObject("D#/E♭4", 3 + 12 * 6));
        keyBindings.set("8", new NoteObject("E4", 4 + 12 * 6));
        keyBindings.set("9", new NoteObject("F4", 5 + 12 * 6));
        keyBindings.set("f9", new NoteObject("F#/G♭4", 6 + 12 * 6));
        keyBindings.set("0", new NoteObject("G4", 7 + 12 * 6));
        keyBindings.set("f10", new NoteObject("G#/A♭4", 8 + 12 * 6));
        keyBindings.set("-", new NoteObject("A4", 9 + 12 * 6));
        keyBindings.set("f11", new NoteObject("A#/B♭4", 10 + 12 * 6));
        keyBindings.set("=", new NoteObject("B4", 11 + 12 * 6));
        //Last C
        keyBindings.set("backspace", new NoteObject("C5", 0 + 12 * 7));
        //Initializing the sizes and event handlers for the keys
        var allKeySpans = document.querySelectorAll("span");
        allKeySpans.forEach(initializeKeySpan);
        //Drawing the piano:
        draw();
    }
    else {
        alert("This browser does not support the Javascript Canvas element which is necessary to run this application.");
        console.error("Error: Canvas not supported.");
    }
}
//*****************************************//
/* Functionality */
//*****************************************//
//Note: 24 keys are initially displayed.
function initializeKeySpan(spanElement, key) {
    //Adding Event Listeners
    spanElement.addEventListener("mouseenter", onHover);
    spanElement.addEventListener("mouseleave", normal);
    spanElement.addEventListener("mouseup", onHover);
    //Sizing the Spans
    resizeSpans(spanElement);
}
/* Event Listener Methods which change the appearance of the keys in different conditions.*/
function onHover(event) {
    event.target.setAttribute("class", "hoveredKey");
}
function normal(event) {
    event.target.setAttribute("class", "normalKey");
}
//Note: This method is called in the in-line script tag in index.html
function playNote(pushedKey) {
    var pressedSpan = document.getElementById(pushedKey);
    pressedSpan.setAttribute("class", "pressedKey");
    var notePlayed = keyBindings.get(pushedKey);
    //If the key isn't pressed, it is set to true in the pressedKeys binding.
    //If the key is already pressed, nothing happens.
    if (!notePlayed.notePressed) {
        notePlayed.notePressed = true;
    }
}
//Note: This method is called in the in-line script tag in index.html
function stopNote(releasedKey) {
    //The code only runs if the key that is pressed is bound to a note.
    //When the key is released, the pressedKeys's entry for they key is set to false
    //as that key is no longer pressed.
    var pressedSpan = document.getElementById(releasedKey);
    pressedSpan.setAttribute("class", "normalKey");
    var playedNote = keyBindings.get(releasedKey);
    playedNote.notePressed = false;
}
//When the mouse is released, it will still be on top of the key that was pressed, so the key
//would be styled as if the mouse was hovering on it.
function stopNoteMouse(releasedKey) {
    var pressedSpan = document.getElementById(releasedKey);
    pressedSpan.setAttribute("class", "hoveredKey");
    var playedNote = keyBindings.get(releasedKey);
    playedNote.notePressed = false;
}
function resizeSpans(pianoKey) {
    if (pianoKey)
        resizingSpan(pianoKey);
    else {
        var keySpans = document.querySelectorAll("span");
        keySpans.forEach(resizingSpan);
    }
}
//Variable used to shift white keys that are right of black keys
//to the left in order to align them with their respective keys.
var moveRightWhiteKeyLeft = false;
function resizingSpan(currSpan) {
    //Setting the width and height of each span element.
    //Black Keys' Notes have a "/" in them to separate
    //the Sharp/Flat they represent. Also, the spans are aligned 
    //in front of their respective keys using a negative margin.
    if (keyBindings.get(currSpan.id).note.indexOf("/") !== -1) {
        currSpan.setAttribute("width", blackKeyWidth + "px");
        currSpan.style.width = blackKeyWidth + "px";
        currSpan.setAttribute("height", blackKeyHeight + "px");
        currSpan.style.height = blackKeyHeight + "px";
        currSpan.setAttribute("margin-bottom", -blackKeyHeight - 3 + "px");
        currSpan.style.marginBottom = -blackKeyHeight - 3 + "px";
        currSpan.setAttribute("margin-left", -blackKeyWidth / 2 + "px");
        currSpan.style.marginLeft = -blackKeyWidth / 2 + "px";
        //Setting the z-index to 2 so that the black keys' are on top of the 
        //white keys and the correct note is played when they are pressed.
        currSpan.setAttribute("z-index", "2");
        currSpan.style.zIndex = "2";
        moveRightWhiteKeyLeft = true;
    }
    else {
        currSpan.setAttribute("width", whiteKeyWidth + "px");
        currSpan.style.width = whiteKeyWidth + "px";
        currSpan.setAttribute("height", whiteKeyHeight + "px");
        currSpan.style.height = whiteKeyHeight + "px";
        currSpan.setAttribute("marginBottom", -whiteKeyHeight - 3 + "px");
        currSpan.style.marginBottom = -whiteKeyHeight - 3 + "px";
        if (moveRightWhiteKeyLeft === true) {
            currSpan.setAttribute("margin-left", -blackKeyWidth / 2 + "px");
            currSpan.style.marginLeft = -blackKeyWidth / 2 + "px";
            moveRightWhiteKeyLeft = false;
        }
    }
}
var buttonsDiv = document.getElementById("numKeysVisible");
//Keeps track of the number of keys currently visible. Will be used to check
//if a different # of currently visible keys is selected. Initial value is 24.
var currentNumKeys = 24;
buttonsDiv.addEventListener("click", function (event) {
    var newNumKeys = Number(event.target.textContent);
    if (newNumKeys === currentNumKeys)
        return;
    else {
        currentNumKeys = newNumKeys;
        switch (newNumKeys) {
            case 12:
                whiteKeyWidth = canvasContainer.clientWidth / 7.0;
                break;
            case 24:
                whiteKeyWidth = canvasContainer.clientWidth / 14.0;
                break;
            case 36:
                whiteKeyWidth = canvasContainer.clientWidth / 21.0;
                break;
            case 49:
                whiteKeyWidth = canvasContainer.clientWidth / 29.0;
                break;
        }
        canvas.width = whiteKeyWidth * 29;
        //Adding 1 to the canvas's width to prevent last span from
        //circling back to the front.
        spanDiv.setAttribute("width", canvas.width + 1 + "px");
        spanDiv.style.width = canvas.width + 1 + "px";
        blackKeyWidth = whiteKeyWidth * 0.6;
        reDraw();
    }
});
//*****************************************//
/* Graphical User Interface */
//*****************************************//
function drawWhiteKeys() {
    for (var counter = 0; counter < 28; counter += 7)
        for (var i = 0; i <= 6; i++) {
            ctx.strokeRect(whiteKeyWidth * (counter + i), 0, whiteKeyWidth, whiteKeyHeight);
        }
    //Drawing the Final White Key
    ctx.strokeRect(whiteKeyWidth * 28, 0, whiteKeyWidth, whiteKeyHeight);
}
function drawBlackKeys() {
    for (var counter = 0; counter < 28; counter += 7)
        for (var i = 0; i <= 6; i++) {
            if (i != 2 && i != 6) {
                ctx.fillRect(whiteKeyWidth * (counter + i + 0.7), 0, blackKeyWidth, blackKeyHeight);
            }
        }
}
var pianoNotes = ["A", "B", "C", "D", "E", "F", "G"];
function drawWhiteKeysNotes() {
    for (var counter = 0; counter < 28; counter += 7)
        for (var i = 0; i <= 6; i++) {
            //Middle-C will be a different color than the other notes.
            if (counter + i == 14) {
                ctx.save();
                ctx.fillStyle = "crimson";
                ctx.fillText(pianoNotes[(i + 2) % 7], whiteKeyWidth * (counter + i + 0.225), whiteKeyHeight * 5 / 6, whiteKeyWidth);
                ctx.restore();
            }
            //For every other note,
            else
                ctx.fillText(pianoNotes[(i + 2) % 7], whiteKeyWidth * (counter + i + 0.225), whiteKeyHeight * 5 / 6, whiteKeyWidth);
        }
    //Drawing the Final White Key's Note
    ctx.fillText("C", whiteKeyWidth * 28.225, whiteKeyHeight * 5 / 6, whiteKeyWidth);
}
function drawBlackKeysNotes() {
    for (var counter = 0; counter < 28; counter += 7)
        for (var i = 0; i <= 6; i++) {
            if (i != 2 && i != 6) {
                var topLeft = whiteKeyWidth * (counter + i + 0.7);
                ctx.fillText(pianoNotes[(i + 2) % 7] + "#", topLeft + (blackKeyWidth * 0.01), blackKeyHeight * 1 / 3, blackKeyWidth);
                ctx.fillText(pianoNotes[(i + 3) % 7] + "♭", topLeft + (blackKeyWidth * 0.03), blackKeyHeight * 2 / 3, blackKeyWidth);
            }
        }
}
function drawWhiteKeyBindings() {
    var keys = keyBindings.keys();
    var boundNotes = keyBindings.values();
    var currentKey = keys.next();
    var currentNote = boundNotes.next();
    var counter = 0;
    while (!currentKey.done) {
        if (currentNote.value.note.indexOf("#") === -1) {
            var currentKeyBinding = currentKey.value;
            var topLeft = whiteKeyWidth * counter;
            if (currentKey.value.length <= 3)
                ctx.fillText("[" + currentKeyBinding + "]", topLeft + whiteKeyWidth / 2.5, whiteKeyHeight * 9 / 10, whiteKeyWidth);
            else
                ctx.fillText("[" + currentKeyBinding + "]", topLeft + whiteKeyWidth / (currentKey.value.length), whiteKeyHeight * 9 / 10, whiteKeyWidth);
            counter++;
        }
        currentKey = keys.next();
        currentNote = boundNotes.next();
    }
}
function drawBlackKeyBindings() {
    var keys = keyBindings.keys();
    var boundNotes = keyBindings.values();
    var currentKey = keys.next();
    var currentNote = boundNotes.next();
    var counter = -1;
    while (!currentKey.done) {
        if (currentNote.value.note.indexOf("#") !== -1) {
            var currentKeyBinding = currentKey.value;
            var topLeft = whiteKeyWidth * (counter + 0.7);
            ctx.fillText("[" + currentKeyBinding + "]", topLeft + blackKeyWidth * (0.4 - (currentKeyBinding.length / 16.5)) + 2, blackKeyHeight * 5 / 6, blackKeyWidth);
        }
        else {
            //If the currentKey is a White Key, move forward 1 White Key Width.
            counter++;
        }
        currentKey = keys.next();
        currentNote = boundNotes.next();
    }
}
function draw() {
    //Draws the keys for a 49-key Keyboard
    ctx.moveTo(0, 0);
    ctx.strokeStyle = "grey";
    drawWhiteKeys();
    ctx.fillStyle = "black";
    ctx.font = whiteKeyWidth * 0.8 + "px sans-serif";
    drawBlackKeys();
    drawWhiteKeysNotes();
    ctx.fillStyle = "white";
    ctx.font = blackKeyWidth * 0.8 + "px sans-serif";
    drawBlackKeysNotes();
    ctx.fillStyle = "purple";
    ctx.font = whiteKeyWidth * 0.16 + "px sans-serif";
    drawWhiteKeyBindings();
    ctx.fillStyle = "lightblue";
    ctx.font = blackKeyWidth * 0.25 + "px sans-serif";
    drawBlackKeyBindings();
}
function reDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resizeSpans();
    draw();
}
