//Problems that need Solved + Ideas:
//  1. Depending on screen size, Spans are offset incorrectly
//     resulting in them not covering the entire key. This also affects the shadow effect onpress/onclick
//  2. Need to? precisely place C6 so that it does not go to the start of the div
//     and does not take up more or less room than available.
//  ** Highlight "Middle C" on Canvas
//  ** If the user's screen is large enough, add a button which allows the user to look up a video tutorial of the song they want to play.
//     When they select a song, a Video/IFrame element loads above the piano w/ the video which they can play to simultaneously watch
//     the tutorial and play the song on the piano.
//  ** Add different tones to piano.
//  3. When hovered/pressed, the change in background color of the White keys is also applied to the Black keys that are above them.
// ** Could group together note, note audio, and pressed status as an object which is mapped to key bindings in 1 Map Object.
//*****************************************//
/* Necessary Variables */
//*****************************************//

//Variables for accessing relevant DOM elements declared at the start for global access.
let canvas: HTMLCanvasElement;
let canvasContainer: HTMLDivElement;
let ctx: CanvasRenderingContext2D|null;
let spanDiv: HTMLDivElement;
//"Map" object which maps keys on the keyboard to the various keys on the piano.
const keyBindings: Map<string, string> = new Map<string, string>();
//Object which keeps track of which keys are pressed to prevent duplicates.
const pressedKeys: Map<string, boolean> = new Map<string, boolean>();
//Keys' dimension variables declared at the start for global access.
let whiteKeyHeight: number;
let whiteKeyWidth: number;
let blackKeyHeight: number;
let blackKeyWidth: number;
let offset: number;

//*****************************************//
/* Initial Setup */
//*****************************************//

function setUp(){
    canvas = document.getElementById("pageCanvas") as HTMLCanvasElement;
    if(canvas.getContext){

        ctx = canvas.getContext("2d");
        canvasContainer = document.getElementById("canvasDiv") as HTMLDivElement;
        //Heights of Canvas and Black & White Keys are Constant
        canvas.height = window.innerHeight * 0.8;
        whiteKeyHeight = canvas.height;
        blackKeyHeight = canvas.height * 0.55;

        //This sets the Div's size
        canvas.width = window.innerWidth * 29/14.0;

        //With the Div(i.e. "canvasContainer")'s size set,
        //the Canvas's and White Keys' Widths are set.
        //Initially, 24 Keys are shown, but the widths of Canvas 
        //and Black & White Keys can Change.
        canvas.width = canvasContainer.clientWidth * 29/14.0;
        whiteKeyWidth = canvasContainer.clientWidth/14.0;
        blackKeyWidth = whiteKeyWidth * 0.6;   

        /*Setting up the Spans/"Keys" container*/

        //The "offset"px of Paddding on the top helps align 
        //the spans with their respective keys.
        let canvasRect = document.getElementById("pageCanvas")!.getBoundingClientRect();
        let spanRect = document.getElementById("C1")!.getBoundingClientRect();
        offset = spanRect.top - canvasRect.top;
        spanDiv = document.getElementById("spanDiv") as HTMLDivElement;
        spanDiv!.setAttribute("padding-top", `${-offset}px`);
        spanDiv!.style.paddingTop = `${-offset}px`;

        //Setting the Width of the Span Div so that it spans across the entire piano.
        spanDiv!.setAttribute("width", `${canvas.width + 3}px`);
        spanDiv!.style.width = `${canvas.width + 3}px`;

        /*Setting up the Spans/"Keys" which will handle 
        the interactions with the piano.*/

        //Initializing the sizes and event handlers for the keys
        let allKeySpans = document.querySelectorAll("span");
        allKeySpans.forEach(initializeKeySpan);

        //Adding event listener for when keys are pressed.
        window.addEventListener("keydown", onKeyPressed);
        window.addEventListener("keyup", onKeyReleased);

        /* Setting default key bindings: */
        //NOTE: can change insertion order to utilize the ".keys()" method when drawing key
        //bindings on keyboard.
        //First Octave
        keyBindings.set("escape", "C1");
        keyBindings.set("`", "D1");
        keyBindings.set("1", "E1");
        keyBindings.set("2", "F1");
        keyBindings.set("3", "G1");
        keyBindings.set("4", "A1");
        keyBindings.set("5", "B1");
        keyBindings.set("f1", "C#/D♭1");
        keyBindings.set("f2", "D#/E♭1");
        keyBindings.set("f3", "F#/G♭1");
        keyBindings.set("f4", "G#/A♭1");
        keyBindings.set("f5", "A#/B♭1");

        //Second Octave
        keyBindings.set("tab", "C2");
        keyBindings.set("capslock", "D2");
        keyBindings.set("a", "E2");
        keyBindings.set("s", "F2");
        keyBindings.set("d", "G2");
        keyBindings.set("f", "A2");
        keyBindings.set("g", "B2");
        keyBindings.set("q", "C#/D♭2");
        keyBindings.set("w", "D#/E♭2");
        keyBindings.set("e", "F#/G♭2");
        keyBindings.set("r", "G#/A♭2");
        keyBindings.set("t", "A#/B♭2");

        //Third Octave
        keyBindings.set("y", "C3");
        keyBindings.set("h", "D3");
        keyBindings.set("j", "E3");
        keyBindings.set("k", "F3");
        keyBindings.set("l", "G3");
        keyBindings.set(";", "A3");
        keyBindings.set("'", "B3");
        keyBindings.set("u", "C#/D♭3");
        keyBindings.set("i", "D#/E♭3");
        keyBindings.set("o", "F#/G♭3");
        keyBindings.set("p", "G#/A♭3");
        keyBindings.set("[", "A#/B♭3");

        //Fourth Octave
        keyBindings.set("f6", "C4");
        keyBindings.set("7", "D4");
        keyBindings.set("8", "E4");
        keyBindings.set("9", "F4");
        keyBindings.set("0", "G4");
        keyBindings.set("-", "A4");
        keyBindings.set("=", "B4");
        keyBindings.set("f7", "C#/D♭4");
        keyBindings.set("f8", "D#/E♭4");
        keyBindings.set("f9", "F#/G♭4");
        keyBindings.set("f10", "G#/A♭4");
        keyBindings.set("f11", "A#/B♭4");

        //Last C
        keyBindings.set("Enter", "C5");

        /* Default key pressed values. Initially, no keys are pressed and therefore
        map to a value of "false."*/
        pressedKeys.set("C1", false);
        pressedKeys.set("C#/D♭1", false);
        pressedKeys.set("D1", false);
        pressedKeys.set("D#/E♭1", false);
        pressedKeys.set("E1", false);
        pressedKeys.set("F1", false);
        pressedKeys.set("F#/G♭1", false);
        pressedKeys.set("G1", false);
        pressedKeys.set("G#/A♭1", false);
        pressedKeys.set("A1", false);
        pressedKeys.set("A#/B♭1", false);
        pressedKeys.set("B1", false);
        pressedKeys.set("C2", false);
        pressedKeys.set("C#/D♭2", false);
        pressedKeys.set("D2", false);
        pressedKeys.set("D#/E♭2", false);
        pressedKeys.set("E2", false);
        pressedKeys.set("F2", false);
        pressedKeys.set("F#/G♭2", false);
        pressedKeys.set("G2", false);
        pressedKeys.set("G#/A♭2", false);
        pressedKeys.set("A2", false);
        pressedKeys.set("A#/B♭2", false);
        pressedKeys.set("B2", false);
        pressedKeys.set("C3", false);
        pressedKeys.set("C#/D♭3", false);
        pressedKeys.set("D3", false);
        pressedKeys.set("D#/E♭3", false);
        pressedKeys.set("E3", false);
        pressedKeys.set("F3", false);
        pressedKeys.set("F#/G♭3", false);
        pressedKeys.set("G3", false);
        pressedKeys.set("G#/A♭3", false);
        pressedKeys.set("A3", false);
        pressedKeys.set("A#/B♭3", false);
        pressedKeys.set("B3", false);
        pressedKeys.set("C4", false);
        pressedKeys.set("C#/D♭4", false);
        pressedKeys.set("D4", false);
        pressedKeys.set("D#/E♭4", false);
        pressedKeys.set("E4", false);
        pressedKeys.set("F4", false);
        pressedKeys.set("F#/G♭4", false);
        pressedKeys.set("G4", false);
        pressedKeys.set("G#/A♭4", false);
        pressedKeys.set("A4", false);
        pressedKeys.set("A#/B♭4", false);
        pressedKeys.set("B4", false);
        pressedKeys.set("C5", false);
        //Testing
        //console.log(keyBindings);
        //console.log(pressedKeys);
        //Drawing the piano
        draw();
    }
    else{
        alert("This browser does not support the Javascript Canvas element which is necessary to run this application.");
        console.error("Error: Canvas not supported.")
    }
}

//*****************************************//
/* Interactivity & Functionality */
//*****************************************//

function playNote(e: Event){
    console.log((e.target as HTMLSpanElement).id);
}

//Note: 24 keys are initially displayed.
function initializeKeySpan(spanElement: HTMLSpanElement, key: number){
    //Adding Event Listeners
    spanElement.addEventListener("mouseenter", onHover);
    spanElement.addEventListener("mouseleave", normal);
    spanElement.addEventListener("mousedown", onMousePressed);
    spanElement.addEventListener("mouseup", onHover);
    spanElement.addEventListener("click", playNote);

    //Sizing the Spans
    resizeSpans(spanElement);
}
/* Event Listener Methods which are executed when the user intereacts with the piano. */

function onHover(event: MouseEvent){
    (event.target as HTMLSpanElement).setAttribute("class", "hoveredKey");
}

function normal(event: MouseEvent){
    (event.target as HTMLSpanElement).setAttribute("class", "normalKey");
}

function onMousePressed(event: MouseEvent){
    (event.target as HTMLSpanElement).setAttribute("class", "pressedKey");
}

function onKeyPressed(event: KeyboardEvent){
    event.preventDefault();
    //For Testing:
    //console.log(event);
    //console.log(event.key);
    //console.log(event.key.toLowerCase());

    //Adding ".toLowerCase()" as "Caps Lock" is a key and when it is on, the keys
    //containing letters won't be recognized.
    let keyPressed = event.key.toLowerCase();
    //The code only runs if the key that is pressed is bound to a note.
    if(keyBindings.has(keyPressed)){
        let playedNote = keyBindings.get(keyPressed);
        let pressedSpan = document.getElementById(playedNote!);
        pressedSpan!.setAttribute("class", "pressedKey");
        //If the key isn't pressed, it is set to true in the pressedKeys binding.
        //If the key is already pressed, nothing happens.
        if(!pressedKeys.get(playedNote!)){
            pressedKeys.set(playedNote!, true);
            console.log("Key played");
        }
        else{
            console.log("Key is repeatedly playing");
        }
    }
}

function onKeyReleased(event: KeyboardEvent){
    //Adding ".toLowerCase()" as "Caps Lock" is a key and when it is on, the keys
    //containing letters won't be recognized.
    let keyPressed = event.key.toLowerCase();
    //The code only runs if the key that is pressed is bound to a note.
    if(keyBindings.has(keyPressed)){
        //When the key is released, the pressedKeys's entry for they key is set to false
        //as that key is no longer pressed.
        let playedNote = keyBindings.get(keyPressed);
        pressedKeys.set(playedNote!, false);
        let pressedSpan = document.getElementById(playedNote!);
        pressedSpan!.setAttribute("class", "normalKey");
    }
}

function resizeSpans(pianoKey?: HTMLSpanElement){
    if(pianoKey)
        resizingSpan(pianoKey);
    else{
        let keySpans = document.querySelectorAll("span");
        keySpans.forEach(resizingSpan);
    }
}
//Variable used to shift white keys that are right of black keys
//to the left in order to align them with their respective keys.
let moveRightWhiteKeyLeft = false;
function resizingSpan(currSpan: HTMLSpanElement){
    //Setting the width and height of each span element.

    //Black Keys' Ids will have a "/" in them to separate
    //the Sharp/Flat notes they represent. Also, the spans are aligned 
    //in front of their respective keys using a negative margin.
    if(currSpan.id.indexOf("/") !== -1){
        currSpan.setAttribute("width", `${blackKeyWidth}px`);
        currSpan.style.width = `${blackKeyWidth}px`;
        currSpan.setAttribute("height", `${blackKeyHeight}px`);
        currSpan.style.height = `${blackKeyHeight}px`;
        currSpan.setAttribute("margin-bottom", `${-blackKeyHeight}px`);
        currSpan.style.marginBottom = `${-blackKeyHeight}px`;
        currSpan.setAttribute("margin-left", `${-blackKeyWidth/2}px`);
        currSpan.style.marginLeft = `${-blackKeyWidth/2}px`;
        //Setting the z-index to 2 so that the black keys' are on top of the 
        //white keys and the correct note is played when they are pressed.
        currSpan.setAttribute("z-index", "2");
        currSpan.style.zIndex = "2";
        moveRightWhiteKeyLeft = true;
    }
    else{
        currSpan.setAttribute("width", `${whiteKeyWidth}px`);
        currSpan.style.width = `${whiteKeyWidth}px`
        currSpan.setAttribute("height", `${whiteKeyHeight}px`);
        currSpan.style.height = `${whiteKeyHeight}px`;
        currSpan.setAttribute("marginBottom", `${-whiteKeyHeight}px`);
        currSpan.style.marginBottom = `${-whiteKeyHeight}px`;
        if(moveRightWhiteKeyLeft === true){
            currSpan.setAttribute("margin-left", `${-blackKeyWidth/2}px`);
            currSpan.style.marginLeft = `${-blackKeyWidth/2}px`;
            moveRightWhiteKeyLeft = false;
        }
    }
}

let buttonsDiv = document.getElementById("numKeysVisible");
//Keeps track of the number of keys currently visible. Will be used to check
//if a different # of currently visible keys is selected. Initial value is 24.
let currentNumKeys = 24
buttonsDiv!.addEventListener("click", (event: MouseEvent) => {
    let newNumKeys = Number((event.target as HTMLButtonElement).textContent);
    //Testing if the selected number of keys is what is already being displayed. If so,
    //nothing happens.
    if(newNumKeys === currentNumKeys)
        return;
    else{
        //If the selected number of keys is different from the current,
        //The new number of visible keys is stored to check for next time.
        currentNumKeys = newNumKeys;
        switch(newNumKeys){
            case 12:
                whiteKeyWidth = canvasContainer.clientWidth/7.0;
                break;
            case 24:
                whiteKeyWidth = canvasContainer.clientWidth/14.0;
                break;
            case 36:
                whiteKeyWidth = canvasContainer.clientWidth/21.0;
                break;
            case 49:
                whiteKeyWidth = canvasContainer.clientWidth/29.0;
                break;
        }
        
        canvas.width = whiteKeyWidth * 29;

        //Adding 1 to the canvas's width to prevent last span from
        //circling back to the front.
        spanDiv!.setAttribute("width", `${canvas.width + 1}px`);
        spanDiv!.style.width = `${canvas.width + 1}px`;

        blackKeyWidth = whiteKeyWidth * 0.6;
        reDraw();
    }
});

//*****************************************//
/* Graphical User Interface */
//*****************************************//

function drawWhiteKeys(){
    for(let counter = 0; counter < 28; counter += 7)
        for(let i = 0; i <= 6; i++)
            ctx!.strokeRect(whiteKeyWidth * (counter + i), 0, whiteKeyWidth, whiteKeyHeight);
    //Drawing the Final White Key
    ctx!.strokeRect(whiteKeyWidth * 28, 0, whiteKeyWidth, whiteKeyHeight);
}

function drawBlackKeys(){
    for(let counter = 0; counter < 28; counter += 7)
        for(let i = 0; i <= 6; i++)
        {
            if(i != 2 && i != 6)
            {
                ctx!.fillRect(whiteKeyWidth * (counter + i + 0.7), 0, blackKeyWidth, blackKeyHeight);
            }
        }
}

let pianoNotes = ["A", "B", "C", "D", "E", "F", "G"];
function drawWhiteKeysNotes(){
    for(let counter = 0; counter < 28; counter += 7)
        for(let i = 0; i <= 6; i++){
            //Middle-C will be a different color than the other notes.
            if(counter + i == 14){
                ctx!.save();
                ctx!.fillStyle = "crimson";
                ctx!.fillText(pianoNotes[(i + 2) % 7], whiteKeyWidth * (counter + i + 0.225), whiteKeyHeight * 5/6, whiteKeyWidth);
                ctx!.restore();
            }
            //For every other note,
            else
                ctx!.fillText(pianoNotes[(i + 2) % 7], whiteKeyWidth * (counter + i + 0.225), whiteKeyHeight * 5/6, whiteKeyWidth);
        }

    //Drawing the Final White Key's Note
    ctx!.fillText("C", whiteKeyWidth * 28.225, whiteKeyHeight * 5/6, whiteKeyWidth)
}

function drawBlackKeysNotes(){
    for(let counter = 0; counter < 28; counter += 7)
        for(let i = 0; i <= 6; i++)
        {
            let topLeft = whiteKeyWidth * (counter + i +0.7);
            if(i != 2 && i != 6)
            {
                ctx!.fillText(pianoNotes[(i + 2) % 7] + "#", topLeft + (blackKeyWidth * 0.01), blackKeyHeight * 1/3, blackKeyWidth);
                ctx!.fillText(pianoNotes[(i + 3) % 7] + "♭", topLeft + (blackKeyWidth * 0.03), blackKeyHeight * 2/3, blackKeyWidth);
            }
        }
}

function draw()
{
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
        if(ctx)
        {
            //Draws the keys for a 49-key Keyboard
            ctx.moveTo(0, 0);
            ctx.strokeStyle = "grey";
            drawWhiteKeys();
            ctx.fillStyle = "black";
            ctx.font = `${whiteKeyWidth * 0.8}px sans-serif`;
            drawBlackKeys();
            drawWhiteKeysNotes();
            ctx.fillStyle = "white";
            ctx.font = `${blackKeyWidth * 0.8}px sans-serif`;
            drawBlackKeysNotes();
        }
    }
    else{
        alert("This browser does not support the Javascript Canvas element which is necessary to run this application.");
        console.error("Error: Canvas not supported.")
    }
}

function reDraw(){
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    resizeSpans();
    draw();
}