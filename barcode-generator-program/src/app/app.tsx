import React from "react";
import DigitsPanel from "./digits";

const BARCODE_DIGITS_COUNT = 12;
const BARCODE_NAME = "EAN-13";

class App extends React.Component {
    state = {
        barcode_source_number_val: "",
        barcode_source_number_is_valid: false
    }

    remove_focus_from_last_digit_if_needed() {
        const last_digit = document.getElementById("last-input-digit");
        if (document.activeElement === last_digit) {
            last_digit.blur();
        }
    }

    check_if_barcode_source_number_val_is_valid(val: string) {
        return val.length == BARCODE_DIGITS_COUNT && /^[0-9]{12}$/.test(val);
    }

    handleChange_barcode_source_number_val = (val: string) => {
        const is_valid = this.check_if_barcode_source_number_val_is_valid(val);
        this.setState({
            barcode_source_number_val: val,
            barcode_source_number_is_valid: is_valid
        });
        if (is_valid) {
            this.remove_focus_from_last_digit_if_needed();
        }
    }

    reset_barcode_source_number_val = () => {
        this.setState({
            barcode_source_number_val: "",
            barcode_source_number_is_valid: false
        });
        this.make_focus_on_first_digit_if_needed();
    }

    make_focus_on_first_digit_if_needed() {
        const first_digit = document.getElementById("first-input-digit");
        if (document.activeElement !== first_digit) {
            first_digit.focus();
        }
    }

    render() {
        return (
            <div>
                <p style={{textAlign: "center", fontSize: "20px"}}>
                    In order to generate <b>{BARCODE_NAME}</b> barcode, enter <i>{BARCODE_DIGITS_COUNT}</i>-digit number in input below:
                </p>
                <DigitsPanel count_digits={BARCODE_DIGITS_COUNT} value={this.state.barcode_source_number_val} on_value_change={this.handleChange_barcode_source_number_val} />
                <pre className="source-barcode">
                   Entered barcode: "<span><b>{this.state.barcode_source_number_val}</b></span>"
                </pre>
                <p className="source-barcode-actions">
                   <button onClick={this.reset_barcode_source_number_val}>Reset barcode input</button>
                </p>
            </div>
        );
    }
}

export default App;
