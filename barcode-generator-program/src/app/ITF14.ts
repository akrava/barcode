import ITF from './ITF';

// Calculate the checksum digit
const checksum = (data: string) => {
	const res = data
		.substr(0, 13)
		.split('')
		.map(num => parseInt(num, 10))
		.reduce((sum, n, idx) => sum + (n * (3 - (idx % 2) * 2)), 0);

	return Math.ceil(res / 10) * 10 - res;
};

class ITF14 extends ITF {
	private check_digit: number;

	constructor(data: string) {
		// Add checksum if it does not exist
		if (data.search(/^[0-9]{13}$/) !== -1) {
			const check_digit = checksum(data);
			data += check_digit;
			super(data);
			this.check_digit = check_digit;
		} else {
			console.log('ryfg', data);
			
			super(data);
		}
	}

	public getCheckDigit() : number {
		return this.check_digit;
	}

	public validate() : boolean {
		const data = this.sourceNumber();
		return (
			data.search(/^[0-9]{14}$/) !== -1 &&
			+data[13] === checksum(data)
		);
	}

}

export default ITF14;