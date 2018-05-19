export const hexToBinary = (s: string): string => {
    let ret: string = '';
    const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
    };
    for (let i: number = 0; i < s.length; i = i + 1) {
        if (lookupTable[s[i]]) {
            ret += lookupTable[s[i]];

            if (i % 2 !== 0) {
                ret += ' ';
            }
        } else {
            return null;
        }
    }
    return ret;
};

export const byte2BinaryString = (n): string => {
    return (('000000000' + n.toString(2)).substr(-8));
}

export const getCurrentTimestamp = (): number => {
    return ((new Date()).getTime() / 1000);
}