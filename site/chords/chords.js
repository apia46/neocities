// how many chords are there?
var chords = [];
for (let i = 0; i <= 12; i++) chords.push([]);

function synonyms(chord) {
    let result = [chord];
    for (let i = 0; i < 11; i++) {
        chord <<= 1;
        if (chord >= 4096) {
            chord -= 4095; // -2^12, +2^0
        }
        if (!result.includes(chord)) result.push(chord);
    }
    result.sort((a,b)=>a-b);
    return result;
}

for (let i = 0; i < 4096; i++) {
    let syns = synonyms(i);
    if (i == syns[0]) {
        let notes = 0;
        for (let p = 0; p < 12; p++) {
            if (i & 1 << p) notes++;
        }
        chords[notes].push(syns[0]);
    }
}
console.log(chords);

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const noteSynonyms = ["B#", "Db", "D", "Eb", "Fb", "E#", "Gb", "G", "Ab", "A", "Bb", "Cb"];
function describe(chord, root=0) {
    let result = [];
    for (let p = 0; p < 12; p++) {
        if (chord & 1 << p) {
            result.push(notes[(root+p) % 12]);
        }
    }
    return result.join(", ")
}

function find(noteNames) {
    let result = 0;
    noteNames.forEach(noteName=>{result += 1 << value(noteName)});
    let syns = synonyms(result);
    return [syns[0], syns.findIndex(s=>s==result)];
}

function value(noteName) {
    let result = notes.findIndex(n=>n==noteName);
    if (result == -1) result = noteSynonyms.findIndex(n=>n==noteName);
    return result;
}
