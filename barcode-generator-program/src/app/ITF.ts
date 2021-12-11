import { START_BIN, END_BIN, BINARIES } from './constants';

class ITF {
	private data: string;

	public constructor(data: string) {
        this.data = data;
    }

	public validate(): boolean {
		return this.data.search(/^([0-9]{2})+$/) !== -1;
	}
	
	public sourceNumber() : string {
		return this.data;
	}

	public getEncodedData(): string {
		// Calculate all the digit pairs
		const encoded = this.data
			.match(/.{2}/g)
			.map(pair => this.encodePair(pair))
			.join('');

		const result =  START_BIN + encoded + END_BIN;
		return result;
	}

	public getEncodedDataArr(): Array<number> {
		// Calculate all the digit pairs
		const encoded = this.data
			.match(/.{2}/g)
			.map(pair => this.encodePair(pair))
			.join('');

		return (START_BIN + encoded + END_BIN).split('').map(i => parseInt(i));
	}

	// Calculate the data of a number pair
	public encodePair(pair: string) : string {
		const second = BINARIES[Number(pair.charAt(1))];
		

		const res = BINARIES[Number(pair.charAt(0))]
			.split('')
			.map((first: string, idx : number) => (
				(first === '1' ? '111' : '1') +
				(second[idx] === '1' ? '000' : '0')
			))
			.join('');
			return res;
	}

	public static decode(result: string) : string {
		if (result.length < 10) { 
			return null;
	}
		const data = result.substring(4, result.length - 5).match(/.{18}/g)
		.map(pair => ITF.decodePair(pair))
		.join('');;
		console.log('decodeDataa', data)
		return data;
	}

	public static decodePair(pair: string) : string {
		let arr = pair.match(/(.)\1*/g)
		let arr2 = arr.map(t => t.length > 1 ? '1' : '0');
		let res = arr2.reduce((res, num, ind) => ind %2 === 0 ? {
				...res,
				first: `${res.first}${num}`
			}: {
				...res,
				second: `${res.second}${num}`
			}
			, { first: '', second: ''});
		const num1 = BINARIES.findIndex(b => b === res.first)
		const num2 = BINARIES.findIndex(b => b === res.second)
		return `${num1}${num2}`;
	}
}

export default ITF;