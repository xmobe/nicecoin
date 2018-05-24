<<<<<<< HEAD
/*
 * The MIT License (MIT)
 * Copyright (c) 2018 xMobe https://www.xmobe.com
 * Author: Arkay Lee <quanganh@aiti.com.vn>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * hexToBinary
 * Convert hex string to binary string, using for visually testing purpose
=======
/**
 * Copyright 2018 xMobe https://www.xmobe.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/**
 * hexToBinary 
 * Convert hex string to binary string, using for visually testing purpose 
>>>>>>> 853e405... update license
 * @param s
 */
export const hexToBinary = (s: string): string => {
    let ret: string = '';
    const lookupTable = {
        /* tslint:disable */
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
        /* tslint:enable */
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

/**
<<<<<<< HEAD
 * byte2BinaryString
 * Convert byte to binary string, using for visually testing purpose
 *
 * @param n
 */
export const byte2BinaryString = (n): string => ((`000000000${n.toString(2)}`).substr(-8));

/**
 * getCurrentTimestamp
 * Return the Local Current Time in second
 */
export const getCurrentTimestamp = (): number => ((new Date()).getTime() / 1000);

export const toHexString = (byteArray): string =>
    Array.from(byteArray, (byte: any) =>
        (`0${(byte & 0xFF).toString(16)}`).slice(-2)).join('');
=======
 * byte2BinaryString 
 * Convert byte to binary string, using for visually testing purpose
 * 
 * @param n 
 */
export const byte2BinaryString = (n): string => {
    return (('000000000' + n.toString(2)).substr(-8));
}

/**
 * getCurrentTimestamp 
 * Return the Local Current Time in second
 */
export const getCurrentTimestamp = (): number => {
    return ((new Date()).getTime() / 1000);
}
>>>>>>> 853e405... update license
