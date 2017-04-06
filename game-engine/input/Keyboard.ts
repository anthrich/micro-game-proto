
export default class Keyboard {
    KEY_NAMES_BY_CODE : Object;
    KEY_CODES_BY_NAME : Object;
    MODIFIERS : Array<string>;
    WILDCARD_TYPES : Array<string>;
    WILDCARDS : Object;

    lastKeyCode : number;
    keysDown : any;
    keysUp : any;
    registerKeysDown : any;
    registerKeysUp : any;
    lastModifiers : any;

    constructor() {
        this.KEY_NAMES_BY_CODE  = {
            8: 'backspace', 9: 'tab', 13: 'enter',
                16: 'shift', 17: 'ctrl', 18: 'alt',
                20: 'caps_lock',
                27: 'esc',
                32: 'space',
                33: 'page_up', 34: 'page_down',
                35: 'end', 36: 'home',
                37: 'left', 38: 'up', 39: 'right', 40: 'down',
                45: 'insert', 46: 'delete',
                48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
                65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
                112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12',
                144: 'num_lock'
        };

        this.KEY_CODES_BY_NAME = {};

        this.MODIFIERS = ['shift', 'ctrl', 'alt'];

        this.WILDCARD_TYPES = ['arrow', 'number', 'letter', 'f'];

        this.WILDCARDS = {
            arrow: [37, 38, 39, 40],
                number: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
                letter: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
                f: [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
        };

        for(let key in this.KEY_NAMES_BY_CODE) {
            this.KEY_CODES_BY_NAME[this.KEY_NAMES_BY_CODE[key]] = +key;
        }

        this.initialize();
    }

    initialize() {
        let i;

        this.lastKeyCode = -1;
        this.lastModifiers = {};

        for(i = 0; i < this.MODIFIERS.length; i++)
            this.lastModifiers[this.MODIFIERS[i]] = false;

        this.keysDown = { any: [] };
        this.keysUp = { any: [] };
        for(i = 0; i < this.WILDCARD_TYPES.length; i++) {
            this.keysDown['any ' + this.WILDCARD_TYPES[i]] = [];
            this.keysUp['any ' + this.WILDCARD_TYPES[i]] = [];
        }

        this.registerKeysDown = this.handler('down');
        this.registerKeysUp = this.handler('up');
    };

    registerEvent(element, eventName, func) {
        element.addEventListener(eventName, func, false);
    };

    unregisterEvent(element, eventName, func) {
        element.removeEventListener(eventName, func, false);
    };

    stringContains(string, substring) {
        return string.indexOf(substring) !== -1;
    };

    neatString(string) {
        return string.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    };

    capitalize(string) {
        return string.toLowerCase().replace(/^./, function(match) { return match.toUpperCase(); });
    };

    isString(what) {
        return this.stringContains(Object.prototype.toString.call(what), 'String');
    };

    arrayIncludes(haystack, needle) {
        return haystack.indexOf(needle) !== -1;
    };

    extractModifiers(keyCombination) {
        let modifiers, i;

        modifiers = [];

        for(i = 0; i < this.MODIFIERS.length; i++)
            if(this.stringContains(keyCombination, this.MODIFIERS[i]))
                modifiers.push(this.MODIFIERS[i]);
        return modifiers;
    }

    extractKey(keyCombination) {
        let keys, i;
        keys = this.neatString(keyCombination).split(' ');
        for(i = 0; i < keys.length; i++)
            if(!this.arrayIncludes(this.MODIFIERS, keys[i]))
                return keys[i];
    };

    modifiersAndKey(keyCombination) {
        let result, key;

        if(this.stringContains(keyCombination, 'any')) {
            return this.neatString(keyCombination).split(' ').slice(0, 2).join(' ');
        }

        result = this.extractModifiers(keyCombination);

        key = this.extractKey(keyCombination);
        if(key && !this.arrayIncludes(this.MODIFIERS, key))
            result.push(key);

        return result.join(' ');
    }

    keyName(keyCode) {
        return this.KEY_NAMES_BY_CODE[keyCode + ''];
    };

    keyCode(keyName) {
        return +this.KEY_CODES_BY_NAME[keyName];
    };

    handler(upOrDown) {
        return (e) => {
            let i, j, registeredKeys, lastModifiersAndKey;

            e = e || window.event;

            this.lastKeyCode = e.keyCode;
            for(i = 0; i < this.MODIFIERS.length; i++)
                this.lastModifiers[this.MODIFIERS[i]] = e[this.MODIFIERS[i] + 'Key'];
            if(this.arrayIncludes(this.MODIFIERS, this.keyName(this.lastKeyCode)))
                this.lastModifiers[this.keyName(this.lastKeyCode)] = true;

            registeredKeys = this['keys' + this.capitalize(upOrDown)];

            for(i = 0; i < registeredKeys.any.length; i++)
                if((registeredKeys.any[i](e) === false) && e.preventDefault)
                    e.preventDefault();

            for(i = 0; i < this.WILDCARD_TYPES.length; i++)
                if(this.arrayIncludes(this.WILDCARDS[this.WILDCARD_TYPES[i]], this.lastKeyCode))
                    for(j = 0; j < registeredKeys['any ' + this.WILDCARD_TYPES[i]].length; j++)
                        if((registeredKeys['any ' + this.WILDCARD_TYPES[i]][j](e) === false) && e.preventDefault)
                            e.preventDefault();

            lastModifiersAndKey = this.lastModifiersAndKey();
            if(registeredKeys[lastModifiersAndKey])
                for(i = 0; i < registeredKeys[lastModifiersAndKey].length; i++)
                    if((registeredKeys[lastModifiersAndKey][i](e) === false) && e.preventDefault)
                        e.preventDefault();
        };
    };

    registerKeys(upOrDown, newKeys, func) {
        var i, keys, registeredKeys = this['keys' + this.capitalize(upOrDown)];

        if(this.isString(newKeys))
            newKeys = [newKeys];

        for(i = 0; i < newKeys.length; i++) {
            keys = newKeys[i];
            keys = this.modifiersAndKey(keys + '');

            if(registeredKeys[keys])
                registeredKeys[keys].push(func);
            else
                registeredKeys[keys] = [func];
        }

        return this;
    };

    unregisterKeys(upOrDown, newKeys, func) {
        var i, j, keys, registeredKeys = this['keys' + this.capitalize(upOrDown)];

        if(this.isString(newKeys))
            newKeys = [newKeys];

        for(i = 0; i < newKeys.length; i++) {
            keys = newKeys[i];
            keys = this.modifiersAndKey(keys + '');

            if(func === null)
                delete registeredKeys[keys];
            else {
                if(registeredKeys[keys]) {
                    for(j = 0; j < registeredKeys[keys].length; j++) {
                        if(String(registeredKeys[keys][j]) === String(func)) {
                            registeredKeys[keys].splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }

        return this;
    };

    delegate(upOrDown, keys, func) {
        return func !== null ? this.registerKeys(upOrDown, keys, func) : this.unregisterKeys(upOrDown, keys, func);
    };

    down(keys, func) {
        return this.delegate('down', keys, func);
    };

    up(keys, func) {
        return this.delegate('up', keys, func);
    };

    lastKey(modifier?) {
        if(!modifier)
            return this.keyName(this.lastKeyCode);

        return this.lastModifiers[modifier];
    };

    lastModifiersAndKey() {
        var result, i;

        result = [];
        for(i = 0; i < this.MODIFIERS.length; i++)
            if(this.lastKey(this.MODIFIERS[i]))
                result.push(this.MODIFIERS[i]);

        if(!this.arrayIncludes(result, this.lastKey(false)))
            result.push(this.lastKey(false));

        return result.join(' ');
    };
}