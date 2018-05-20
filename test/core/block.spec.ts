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

import { expect } from 'chai';

import { Block } from '../../src/core/Block';


describe('Block', () => {
    it("Should create New Block with data 'Test Block'", () => {
        const now = new Date();
        now.setDate(20);
        now.setMonth(5);
        now.setFullYear(2017);
        now.setHours(10);
        now.setMinutes(9);
        now.setSeconds(0);
        console.log(now.toString());
        let block = new Block(0, now.getTime(), null, 'Test Block', 5, 0);
        expect(block.data).to.equal('Test Block');
    });

    it("Should create valid Hash", () => {
        const now = new Date();
        now.setDate(20);
        now.setMonth(5);
        now.setFullYear(2017);
        now.setHours(10);
        now.setMinutes(9);
        now.setSeconds(0);
        console.log(now.toString());
        let block: Block = new Block(1, now.getTime(), null, 'Test Block', 5, 0);

        let hash = block.getHash();
        let str1 = Buffer.from(hash).toString('hex');
        console.log(str1);

        let hexToBinary = (s: string): string => {
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

        let byte2String = (n): string => {
            return (('000000000' + n.toString(2)).substr(-8));
        }

        let str = '';
        for (let i = 0; i < hash.length; i++) {
            str += byte2String(hash[i]) + ' ';
        }

        let str2 = '';
        // let buffer = Buffer.from(hash)
        console.log(str);
        console.log(hexToBinary(str1));

        let hashString = block.getHashAsString();
        expect(hashString).to.equal(str1);

        // block.getHash()
        //     .then(data => {
        //         let hash = data;
        //         let str1 = Buffer.from(hash).toString('hex');
        //         console.log(str1);

        //         let hexToBinary = (s: string): string => {
        //             let ret: string = '';
        //             const lookupTable = {
        //                 '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        //                 '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        //                 'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        //                 'e': '1110', 'f': '1111'
        //             };
        //             for (let i: number = 0; i < s.length; i = i + 1) {
        //                 if (lookupTable[s[i]]) {
        //                     ret += lookupTable[s[i]];

        //                     if (i % 2 !== 0) {
        //                         ret += ' ';
        //                     }
        //                 } else {
        //                     return null;
        //                 }
        //             }
        //             return ret;
        //         };

        //         let byte2String = (n): string => {
        //             return (('000000000' + n.toString(2)).substr(-8));
        //         }

        //         // let a = 0x207fFFFF;
        //         // let b = hash[0];
        //         // console.log(a.toString(2));
        //         // console.log(str1);
        //         let str = '';
        //         for (let i = 0; i < hash.length; i++) {
        //             str += byte2String(hash[i]) + ' ';
        //         }

        //         let str2 = '';
        //         let buffer = Buffer.from(hash)
        //         // buffer << 2
        //         // console.log(byte2String(hash[0]));
        //         // console.log(byte2String(hash[1]));

        //         // console.log((parseInt(str1, 16)).toString(2));
        //         console.log(str);
        //         console.log(hexToBinary(str1));

        //         block.getHashAsString()
        //             .then(hashString => {
        //                 expect(hashString).to.equal(str1);
        //             });
        //     });
    });
});