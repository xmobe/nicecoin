/**
 * Copyright 2018 xMobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as Crypto from 'crypto';
import { TxIn } from './TransactionIn';
import { TxOut } from './TransactionOut';

export class Transaction {
    public id: string;
    public txIns: TxIn[];
    public txOuts: TxOut[];

    public getTransactionId(): string {
        const txInContent: string = this.txIns
            .map((txIn: TxIn) => {
                return txIn.txId + txIn.txOutIndex;
            })
            .reduce((a, b) => {
                return (a + b).toString();
            });

        const txOutContent: string = this.txOuts
            .map((txOut: TxOut) => {
                return txOut.publicKey + txOut.publicKey;
            })
            .reduce((a, b) => {
                return (a + b);
            });

        this.id = Crypto.createHash('SHA256')
            .update(txInContent + txOutContent)
            .digest('hex');
            
        return this.id;
    }
}