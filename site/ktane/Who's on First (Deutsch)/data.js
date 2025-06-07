const MODULE_ID = "WhosOnFirstDeutsch";
const LOOKS = {
    "JA": 2,        "OBEN": 1,      "DRÜCK": 5,     "OKAY": 1,  "DA STEHT": 5,  "NEIN": 2,
    "NICHTS": 4,    "LEER": 3,      "empty": 5,     "KUH": 2,   "Q": 5,         "COUP": 3,
    "FERTIG": 3,    "NOCHMAL": 4,   "MOMENT": 4,    "WARTE": 5, "SO EIN": 3,    "SO’N": 5,
    "SOHN": 3,      "OH GOTT": 3,   "ZEHN": 0,      "10": 5,    "ZEHEN": 4,     "CN": 3,
                    "ZÄH": 2,       "ZEH": 5,       "C": 1,     "CEE": 5
}
const WORDS = {
    "OKAY":     ["NEIN", "NICHTS", "empty", "COUP", "OBEN", "NOCHMAL", "Q", "KUH", 'OKAY', "FERTIG", "JA", "DA STEHT", "DRÜCK", "LEER"],
    "JA":       ["OBEN", "NICHTS", "NEIN", "COUP", "FERTIG", "Q", "DRÜCK", "DA STEHT", 'LEER', "OKAY", "KUH", "empty", "NOCHMAL", "JA"],
    "FERTIG":   ["KUH", "DA STEHT", "LEER", "JA", "empty", "OKAY", "Q", "NEIN", 'DRÜCK', "OBEN", "NOCHMAL", "NICHTS", "FERTIG", "COUP"],
    "KUH":      ["LEER", "Q", "NICHTS", "COUP", 'KUH', "NOCHMAL", "OKAY", "DRÜCK", "FERTIG", "empty", "OBEN", "DA STEHT", "NEIN", "JA"],
    "DRÜCK":    ["DA STEHT", "Q", "NICHTS", "COUP", "NEIN", "KUH", "FERTIG", "NOCHMAL", 'OBEN', "empty", "LEER", "JA", "DRÜCK", "OKAY"],
    "NEIN":     ["NICHTS", "Q", "DA STEHT", "COUP", "JA", "empty", "NOCHMAL", "OKAY", 'DRÜCK', "NEIN", "OBEN", "KUH", "FERTIG", "LEER"],
    "empty":    ["DA STEHT", 'empty', "OBEN", "DRÜCK", "OKAY", "KUH", "COUP", "FERTIG", "NICHTS", "JA", "LEER", "NEIN", "NOCHMAL", "Q"],
    "DA STEHT": ["OKAY", "DRÜCK", "OBEN", "empty", "NICHTS", "NEIN", "Q", "FERTIG", 'NOCHMAL', "KUH", "DA STEHT", "COUP", "LEER", "JA"],
    "OBEN":     ["Q", 'OBEN', "JA", "FERTIG", "COUP", "NEIN", "KUH", "empty", "DA STEHT", "LEER", "NOCHMAL", "OKAY", "NICHTS", "DRÜCK"],
    "Q":        ["NEIN", "DRÜCK", "OKAY", "NOCHMAL", "FERTIG", "LEER", "empty", 'Q', "COUP", "OBEN", "DA STEHT", "KUH", "NICHTS", "JA"],
    "COUP":     ["KUH", "OKAY", "NICHTS", "empty", "DRÜCK", "NOCHMAL", "FERTIG", "LEER", 'OBEN', "COUP", "Q", "JA", "DA STEHT", "NEIN"],
    "NICHTS":   ["COUP", "FERTIG", "JA", "NEIN", "DA STEHT", "DRÜCK", "LEER", 'NICHTS', "OBEN", "OKAY", "KUH", "NOCHMAL", "empty", "Q"],
    "LEER":     ["DA STEHT", "FERTIG", "KUH", "NICHTS", "NEIN", "OBEN", "JA", "NOCHMAL", 'empty', "LEER", "DRÜCK", "OKAY", "Q", "COUP"],
    "NOCHMAL":  ["Q", "COUP", "NEIN", "OKAY", 'NOCHMAL', "NICHTS", "DRÜCK", "DA STEHT", "KUH", "OBEN", "JA", "empty", "FERTIG", "LEER"],

    "SOHN":     ["SO’N", "ZÄH", "ZEHN", "CN", "MOMENT", "SO EIN", "CEE", "10", 'OH GOTT', "SOHN", "C", "ZEHEN", "WARTE", "ZEH"],
    "ZÄH":      ["ZEHN", "MOMENT", "ZEHEN", "SO EIN", "OH GOTT", "WARTE", "C", "10", 'YOU', "ZEH", "CN", "SO’N", "CEE", "ZÄH"],
    "ZEHN":     ["C", "ZÄH", "SO EIN", 'ZEHN', "MOMENT", "CEE", "SO’N", "ZEH", "CN", "SOHN", "OH GOTT", "10", "ZEHEN", "WARTE"],
    "CN":       ["SOHN", 'CN', "CEE", "MOMENT", "C", "ZÄH", "ZEH", "ZEHN", "OH GOTT", "SO EIN", "SO’N", "WARTE", "ZEHEN", "10"],
    "CEE":      ["WARTE", "ZEH", 'CEE', "SO EIN", "OH GOTT", "SO’N", "ZEHN", "10", "CN", "ZEHEN", "MOMENT", "C", "ZÄH", "SOHN"],
    "ZEH":      ["SO EIN", "SO’N", "MOMENT", "OH GOTT", "CN", "CEE", "C", "WARTE", 'ZEH', "SOHN", "ZEHEN", "10", "ZÄH", "ZEHN"],
    "SO EIN":   ['SO EIN', "ZEHN", "ZÄH", "SOHN", "WARTE", "10", "C", "MOMENT", "SO’N", "ZEHEN", "CN", "CEE", "ZEH", "OH GOTT"],
    "C":        ["CEE", "ZEH", "ZÄH", "CN", "MOMENT", 'C', "WARTE", "SOHN", "SO EIN", "ZEHEN", "ZEHN", "SO’N", "10", "OH GOTT"],
    "OH GOTT":  ["SOHN", "10", "CN", "ZEHN", "ZEH", "WARTE", "C", "ZEHEN", 'ZÄH', "SO EIN", "CEE", "MOMENT", "OH GOTT", "SO’N"],
    "WARTE":    ["SO’N", "SO EIN", "MOMENT", "OH GOTT", "ZEHN", "CEE", "CN", "10", 'ZEHEN', "SOHN", "ZEH", "ZÄH", "C", "WARTE"],
    "MOMENT":   ["OH GOTT", "SO EIN", "C", "ZEHN", "10", "SO’N", 'MOMENT', "ZEHEN", "WARTE", "ZÄH", "CEE", "CN", "ZEH", "SOHN"],
    "10":       ["ZÄH", "ZEH", "WARTE", "C", "SOHN", "CEE", "SO’N", "OH GOTT", 'CN', "MOMENT", "10", "SO EIN", "ZEHN", "ZEHEN"],
    "SO’N":     ["ZÄH", "WARTE", "ZEHEN", "CN", "SOHN", "10", "SO EIN", "CEE", 'SO’N', "ZEH", "OH GOTT", "MOMENT", "ZEHN", "C"],
    "ZEHEN":    ["CN", "MOMENT", "ZEH", "CEE", "10", "WARTE", "C", "OH GOTT", 'SO EIN', "SOHN", "ZEHEN", "SO’N", "ZÄH", "ZEHN"],
}
const DIRECTORY = "Who's on First (Deutsch)";
