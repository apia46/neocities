function keyboardSetup() {
    document.querySelector("#keyboard").innerHTML = `
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-Q" onclick="keyboardInput('Q')">Q</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-W" onclick="keyboardInput('W')">W</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-E" onclick="keyboardInput('E')">E</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-R" onclick="keyboardInput('R')">R</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-T" onclick="keyboardInput('T')">T</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-Y" onclick="keyboardInput('Y')">Y</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-U" onclick="keyboardInput('U')">U</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-I" onclick="keyboardInput('I')">I</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-O" onclick="keyboardInput('O')">O</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-P" onclick="keyboardInput('P')">P</button><br>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-A" onclick="keyboardInput('A')">A</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-S" onclick="keyboardInput('S')">S</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-D" onclick="keyboardInput('D')">D</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-F" onclick="keyboardInput('F')">F</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-G" onclick="keyboardInput('G')">G</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-H" onclick="keyboardInput('H')">H</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-J" onclick="keyboardInput('J')">J</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-K" onclick="keyboardInput('K')">K</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-L" onclick="keyboardInput('L')">L</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-Enter" onclick="keyboardInput('Enter')">↵</button><br>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-Z" onclick="keyboardInput('Z')">Z</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-X" onclick="keyboardInput('X')">X</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-C" onclick="keyboardInput('C')">C</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-V" onclick="keyboardInput('V')">V</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-B" onclick="keyboardInput('B')">B</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-N" onclick="keyboardInput('N')">N</button>
        <button onfocus="window?.keyboardFocus()" onfocusout="window?.keyboardUnfocus()" id="keyboard-M" onclick="keyboardInput('M')">M</button>
    `;
}
