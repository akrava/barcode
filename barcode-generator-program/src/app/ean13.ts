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

    private static first_half_is_A = [
        [true, true,  true,  true,  true,  true ],
        [true, true,  false, true,  false, false],
        [true, true,  false, false, true,  false],
        [true, true,  false, false, false, true ],
        [true, false, true,  true,  false, false],
        [true, false, false, true,  true,  false],
        [true, false, false, false, true,  true ],
        [true, false, true,  false, true,  false],
        [true, false, true,  false, false, true ],
        [true, false, false, true,  false, true ],
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

    public static decode(digits: string) {
        if (digits.length != 95) { 
            return null;
        }

        let i = 0;

        for (; i < EAN13.H1.length; i++) {
            if ((+digits[i]) !== EAN13.H1[i]) {
                return null;
            }
        }

        const cur_first_half_check_is_A = [];
        const cur_first_half_postion = [];

        for (let j = 0; j < EAN13.first_half[0].length; j++) {
            const digits_block = digits.substr(i, EAN13.first_half[0][0][0].length);
            i += EAN13.first_half[0][0][0].length;
            let found_in_A = false;
            for (let k = 0; k < EAN13.A.length && !found_in_A; k++) {
                const check_block = EAN13.A[k].join("");
                if (digits_block === check_block) {
                    cur_first_half_check_is_A.push(true);
                    cur_first_half_postion.push(k);
                    found_in_A = true;
                    break;
                }
            }
            let found_in_B = false;
            for (let k = 0; k < EAN13.B.length && !found_in_A && !found_in_B; k++) {
                const check_block = EAN13.B[k].join("");
                if (digits_block === check_block) {
                    cur_first_half_check_is_A.push(false);
                    cur_first_half_postion.push(k);
                    found_in_B = true;
                    break;
                }
            }
            if (!found_in_A && !found_in_B) {
                return null;
            }
        }

        let check_digit = -1;
        for (let j = 0; j < this.first_half_is_A.length; j++) {
            const check_arr = this.first_half_is_A[j];
            if (check_arr.join() == cur_first_half_check_is_A.join()) {
                check_digit = j;
                break;
            }
        }

        if (check_digit < 0) {
            return null;
        }

        const reversed_barcode = [ ...cur_first_half_postion ];

        for (let j = 0; j < EAN13.H4.length; j++) {
            const check_ = +digits[i++];
            if (EAN13.H4[j] !== check_) {
                return null;
            }
        }

        for (let j = 0; j < EAN13.first_half[0].length; j++) {
            const last_digits_block = digits.substr(i, EAN13.C[0].length);
            i += EAN13.C[0].length;
            let found_in_C = false;
            for (let k = 0; k < EAN13.C.length && !found_in_C; k++) {
                const check_block = EAN13.C[k].join("");
                if (last_digits_block === check_block) {
                    reversed_barcode.push(k);
                    found_in_C = true
                    break;
                }
            }
            if (found_in_C != true) {
                return null;
            }
        }

        if (reversed_barcode.length != 12) {
            return null;
        }

        const barcode_normal = [ ...reversed_barcode ];

        const barcode_normal_str = barcode_normal.join("");

        const barcode_obj = new EAN13(barcode_normal_str);

        if (barcode_obj.getCheckDigit() !== check_digit) {
            return null;
        }

        return barcode_normal_str;
    }
}

export default EAN13;
