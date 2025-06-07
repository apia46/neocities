const MODULE_ID = "WhosOnFirst";
const LOOKS = {
    "YES": 2,   "FIRST": 1,     "DISPLAY": 5,   "OKAY": 1,      "SAYS": 5,      "NOTHING": 2,
    "empty": 4, "BLANK": 3,     "NO": 5,        "LED": 2,       "LEAD": 5,      "READ": 3,
    "RED": 3,   "REED": 4,      "LEED": 4,      "HOLD ON": 5,   "YOU": 3,       "YOU ARE": 5,
    "YOUR": 3,  "YOU’RE": 3,    "UR": 0,        "THERE": 5,     "THEY’RE": 4,   "THEIR": 3,
                "THEY ARE": 2,  "SEE": 5,       "C": 1,         "CEE": 5
}
const WORDS = {
    "READY":      ["YES", "OKAY", "WHAT", "MIDDLE", "LEFT", "PRESS", "RIGHT", "BLANK", 'READY', "NO", "FIRST", "UHHH", "NOTHING", "WAIT"],
    "FIRST":      ["LEFT", "OKAY", "YES", "MIDDLE", "NO", "RIGHT", "NOTHING", "UHHH", 'WAIT', "READY", "BLANK", "WHAT", "PRESS", "FIRST"],
    "NO":         ["BLANK", "UHHH", "WAIT", "FIRST", "WHAT", "READY", "RIGHT", "YES", 'NOTHING', "LEFT", "PRESS", "OKAY", "NO", "MIDDLE"],
    "BLANK":      ["WAIT", "RIGHT", "OKAY", "MIDDLE", 'BLANK', "PRESS", "READY", "NOTHING", "NO", "WHAT", "LEFT", "UHHH", "YES", "FIRST"],
    "NOTHING":    ["UHHH", "RIGHT", "OKAY", "MIDDLE", "YES", "BLANK", "NO", "PRESS", 'LEFT', "WHAT", "WAIT", "FIRST", "NOTHING", "READY"],
    "YES":        ["OKAY", "RIGHT", "UHHH", "MIDDLE", "FIRST", "WHAT", "PRESS", "READY", 'NOTHING', "YES", "LEFT", "BLANK", "NO", "WAIT"],
    "WHAT":       ["UHHH", 'WHAT', "LEFT", "NOTHING", "READY", "BLANK", "MIDDLE", "NO", "OKAY", "FIRST", "WAIT", "YES", "PRESS", "RIGHT"],
    "UHHH":       ["READY", "NOTHING", "LEFT", "WHAT", "OKAY", "YES", "RIGHT", "NO", 'PRESS', "BLANK", "UHHH", "MIDDLE", "WAIT", "FIRST"],
    "LEFT":       ["RIGHT", 'LEFT', "FIRST", "NO", "MIDDLE", "YES", "BLANK", "WHAT", "UHHH", "WAIT", "PRESS", "READY", "OKAY", "NOTHING"],
    "RIGHT":      ["YES", "NOTHING", "READY", "PRESS", "NO", "WAIT", "WHAT", 'RIGHT', "MIDDLE", "LEFT", "UHHH", "BLANK", "OKAY", "FIRST"],
    "MIDDLE":     ["BLANK", "READY", "OKAY", "WHAT", "NOTHING", "PRESS", "NO", "WAIT", 'LEFT', "MIDDLE", "RIGHT", "FIRST", "UHHH", "YES"],
    "OKAY":       ["MIDDLE", "NO", "FIRST", "YES", "UHHH", "NOTHING", "WAIT", 'OKAY', "LEFT", "READY", "BLANK", "PRESS", "WHAT", "RIGHT"],
    "WAIT":       ["UHHH", "NO", "BLANK", "OKAY", "YES", "LEFT", "FIRST", "PRESS", 'WHAT', "WAIT", "NOTHING", "READY", "RIGHT", "MIDDLE"],
    "PRESS":      ["RIGHT", "MIDDLE", "YES", "READY", 'PRESS', "OKAY", "NOTHING", "UHHH", "BLANK", "LEFT", "FIRST", "WHAT", "NO", "WAIT"],

    "YOU":        ["SURE", "YOU ARE", "YOUR", "YOU’RE", "NEXT", "UH HUH", "UR", "HOLD", 'WHATQ', "YOU", "UH UH", "LIKE", "DONE", "U"],
    "YOU ARE":    ["YOUR", "NEXT", "LIKE", "UH HUH", "WHATQ", "DONE", "UH UH", "HOLD", 'YOU', "U", "YOU’RE", "SURE", "UR", "YOU ARE"],
    "YOUR":       ["UH UH", "YOU ARE", "UH HUH", 'YOUR', "NEXT", "UR", "SURE", "U", "YOU’RE", "YOU", "WHATQ", "HOLD", "LIKE", "DONE"],
    "YOU’RE":     ["YOU", 'YOU’RE', "UR", "NEXT", "UH UH", "YOU ARE", "U", "YOUR", "WHATQ", "UH HUH", "SURE", "DONE", "LIKE", "HOLD"],
    "UR":         ["DONE", "U", 'UR', "UH HUH", "WHATQ", "SURE", "YOUR", "HOLD", "YOU’RE", "LIKE", "NEXT", "UH UH", "YOU ARE", "YOU"],
    "U":          ["UH HUH", "SURE", "NEXT", "WHATQ", "YOU’RE", "UR", "UH UH", "DONE", 'U', "YOU", "LIKE", "HOLD", "YOU ARE", "YOUR"],
    "UH HUH":     ['UH HUH', "YOUR", "YOU ARE", "YOU", "DONE", "HOLD", "UH UH", "NEXT", "SURE", "LIKE", "YOU’RE", "UR", "U", "WHATQ"],
    "UH UH":      ["UR", "U", "YOU ARE", "YOU’RE", "NEXT", 'UH UH', "DONE", "YOU", "UH HUH", "LIKE", "YOUR", "SURE", "HOLD", "WHATQ"],
    "WHATQ":      ["YOU", "HOLD", "YOU’RE", "YOUR", "U", "DONE", "UH UH", "LIKE", 'YOU ARE', "UH HUH", "UR", "NEXT", "WHATQ", "SURE"],
    "DONE":       ["SURE", "UH HUH", "NEXT", "WHATQ", "YOUR", "UR", "YOU’RE", "HOLD", 'LIKE', "YOU", "U", "YOU ARE", "UH UH", "DONE"],
    "NEXT":       ["WHATQ", "UH HUH", "UH UH", "YOUR", "HOLD", "SURE", 'NEXT', "LIKE", "DONE", "YOU ARE", "UR", "YOU’RE", "U", "YOU"],
    "HOLD":       ["YOU ARE", "U", "DONE", "UH UH", "YOU", "UR", "SURE", "WHATQ", 'YOU’RE', "NEXT", "HOLD", "UH HUH", "YOUR", "LIKE"],
    "SURE":       ["YOU ARE", "DONE", "LIKE", "YOU’RE", "YOU", "HOLD", "UH HUH", "UR", 'SURE', "U", "WHATQ", "NEXT", "YOUR", "UH UH"],
    "LIKE":       ["YOU’RE", "NEXT", "U", "UR", "HOLD", "DONE", "UH UH", "WHATQ", 'UH HUH', "YOU", "LIKE", "SURE", "YOU ARE", "YOUR"],
}
const DIRECTORY = "Who's on First";
