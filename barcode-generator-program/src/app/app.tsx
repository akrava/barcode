import React from "react";
import DigitsPanel from "./digits";
import EAN13 from "./ean13";


const BARCODE_DIGITS_COUNT = 12;
const BARCODE_NAME = "EAN-13";

type AppState = { barcode_source_number_val: string, barcode_source_number_is_valid: boolean, barcode_obj: EAN13 | null };

class App extends React.Component {
    state: AppState = {
        barcode_source_number_val: "",
        barcode_source_number_is_valid: false,
        barcode_obj: null,
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
            this.setState({
                barcode_obj: new EAN13(val)
            });
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

    append_results_block_if_needed = () => {
        if (this.state.barcode_source_number_is_valid) {
            return (
                <div>
                    <hr style={{ margin: "0 30px" }}/>
                    <p style={{ textAlign: "center", marginTop: "10px", fontSize: "20px", fontWeight: 500 }}>
                        Results:
                    </p>
                    <canvas width="190px" height="95px" id="barcode-canva" style={{ display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "20px" }}></canvas>
                    <textarea readOnly={true} value={this.state.barcode_obj.getBarcodeArr().join("")} style={{ fontFamily: "monospace", width: 760, display: "block", marginLeft: "auto", marginRight: "auto" }}>
                    </textarea>
                    <pre style={{ textAlign: "center" }}>Check digit: {this.state.barcode_obj.getCheckDigit()}</pre>
                </div>
            );
        } else {
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                    <p style={{ textAlign: "center", fontSize: "20px" }}>No results...</p>
                    <p style={{ textAlign: "center", marginTop: "0px", fontStyle: "italic", color: "GrayText" }}>
                        Please, enter the source number in the input for the purpose of getting here results – the image of barcode
                    </p>
                </div>
            );
        }
    }

    componentDidUpdate() {
        if (this.state.barcode_source_number_is_valid) {
            const canvas = document.getElementById('barcode-canva') as HTMLCanvasElement;
            if (canvas && canvas.getContext) {

                const barcode_arr = this.state.barcode_obj.getBarcodeArr();

                const ctx = canvas.getContext('2d');

                const i_width = 2;
                const height = 70;
                
                ctx.clearRect(0, 0, i_width * 95, height + 15);

                for (let i = 0; i < barcode_arr.length; i++) {
                    if (barcode_arr[i] == 1) {
                        let tmp_height = height;
                        if ((i >= 0 && i <= 2) || (i >= 45 && i <= 49) || (i >= 92 && i <= 94)) {
                            tmp_height += 15;
                        }
                        ctx.fillRect(i*i_width, 0, i_width, tmp_height);
                    }
                }
            }
        }
    }

    render() {
        return (
            <div style={{ height: "calc(100% - 20px)", marginTop: "20px" }}>
                <p style={{ marginTop: "0", textAlign: "center", fontSize: "20px"}}>
                    In order to generate <b>{BARCODE_NAME}</b> barcode, enter <i>{BARCODE_DIGITS_COUNT}</i>-digit number in input below:
                </p>
                <DigitsPanel count_digits={BARCODE_DIGITS_COUNT} value={this.state.barcode_source_number_val} on_value_change={this.handleChange_barcode_source_number_val} />
                <pre className="source-barcode">
                   Entered barcode: "<span><b>{this.state.barcode_source_number_val}</b></span>"
                </pre>
                <p className="source-barcode-actions">
                   <button onClick={this.reset_barcode_source_number_val}>Reset barcode input</button>
                </p>
                {this.append_results_block_if_needed()}
            </div>
        );
    }
}

export default App;
