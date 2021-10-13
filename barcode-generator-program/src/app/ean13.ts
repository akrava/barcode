// EAN13

class EAN13 {
    private static H1 = [1, 0, 1];

    private static H4 = [0, 1, 0, 1, 0];

    private static A = [
        [0, 0, 0, 1, 1, 0, 1],
        [0, 0, 1, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1, 1],
        [0, 1, 1, 1, 1, 0, 1],
        [0, 1, 0, 0, 0, 1, 1],
        [0, 1, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 0, 1, 1],
        [0, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 1]
    ];

    private static B = [
        [0, 1, 0, 0, 1, 1, 1],
        [0, 1, 1, 0, 0, 1, 1],
        [0, 0, 1, 1, 0, 1, 1],
        [0, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 0, 1],
        [0, 1, 1, 1, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 1],
        [0, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 1, 0, 0, 1],
        [0, 0, 1, 0, 1, 1, 1]
    ];

    private static C = [
        [1, 1, 1, 0, 0, 1, 0],
        [1, 1, 0, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 1, 1, 1, 0],
        [1, 0, 1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 1, 0, 0, 0],
        [1, 1, 1, 0, 1, 0, 0]
    ];

    private static first_half = [
        [EAN13.A, EAN13.A, EAN13.A, EAN13.A, EAN13.A, EAN13.A],
        [EAN13.A, EAN13.A, EAN13.B, EAN13.A, EAN13.B, EAN13.B],
        [EAN13.A, EAN13.A, EAN13.B, EAN13.B, EAN13.A, EAN13.B],
        [EAN13.A, EAN13.A, EAN13.B, EAN13.B, EAN13.B, EAN13.A],
        [EAN13.A, EAN13.B, EAN13.A, EAN13.A, EAN13.B, EAN13.B],
        [EAN13.A, EAN13.B, EAN13.B, EAN13.A, EAN13.A, EAN13.B],
        [EAN13.A, EAN13.B, EAN13.B, EAN13.B, EAN13.A, EAN13.A],
        [EAN13.A, EAN13.B, EAN13.A, EAN13.B, EAN13.A, EAN13.B],
        [EAN13.A, EAN13.B, EAN13.A, EAN13.B, EAN13.B, EAN13.A],
        [EAN13.A, EAN13.B, EAN13.B, EAN13.A, EAN13.B, EAN13.A],
    ];

    private source_number: string;
    private source_number_arr: number[];
    private check_digit: number;
    private barcode_arr: number[];

    public constructor(source_number: string) {
        this.source_number = source_number;
        this.source_number_arr = [];
        for (let i = 0; i < source_number.length; i++) {
            this.source_number_arr.push(parseInt(source_number[i]));
        }
        this.check_digit = this.calculateCheckDigit();
        this.barcode_arr = this.calculatBarcode();
    }

    private calculatBarcode() {
        const res: number[] = [];

        const check_digit = this.check_digit;

        const cur_first_half = EAN13.first_half[check_digit];

        for (let i = 0; i < EAN13.H1.length; i++) {
            res.push(EAN13.H1[i]);
        }

        for (let i = 12; i > 6; i--) {
            const cur_digit_arr = cur_first_half[12 - i];
            
            const cur_digit = this.source_number_arr[12 - i];

            const vals_for_digit = cur_digit_arr[cur_digit];

            for (let j = 0; j < vals_for_digit.length; j++) {
                res.push(vals_for_digit[j]);
            }
        }

        for (let i = 0; i < EAN13.H4.length; i++) {
            res.push(EAN13.H4[i]);
        }

        for (let i = 6; i < 12; i++) {
            const cur_digit = this.source_number_arr[i];

            const vals_for_digit = EAN13.C[cur_digit];

            for (let j = 0; j < vals_for_digit.length; j++) {
                res.push(vals_for_digit[j]);
            }
        }

        for (let i = 0; i < EAN13.H1.length; i++) {
            res.push(EAN13.H1[i]);
        }

        return res;
    }

    private calculateCheckDigit() {
        let odd_sum = 0;
        let even_sum = 0;
        for (let i = 0; i < this.source_number_arr.length; i++) {
            if (i % 2 == 0) { 
                even_sum += this.source_number_arr[i];
            } else {
                odd_sum += this.source_number_arr[i];
            }
        }
        const sum = (even_sum * 33) + odd_sum;
        return (10 - (sum % 10)) % 10;
    }

    public getSourceNumber() {
        return this.source_number;
    }

    public getBarcodeArr() {
        return this.barcode_arr;
    }

    public getCountryCode() {
        return this.source_number.substr(0, 3);
    }

    public getManufacturerCode() {
        return this.source_number.substr(3, 4);
    }

    public getProdcutCode() {
        return this.source_number.substr(7, 5);
    }

    public getCheckDigit() {
        return this.check_digit;
    }


}

export default EAN13;
