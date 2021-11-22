import React from "react";
import DigitsPanel from "./digits";
import EAN13 from "./ean13";
import { saveAs } from 'file-saver';

const BARCODE_DIGITS_COUNT = 12;
const BARCODE_NAME = "EAN-13";

type EncodeState = { barcode_source_number_val: string, barcode_source_number_is_valid: boolean, barcode_obj: EAN13 | null, current_page: "encode" | "decode" | "products", is_product_input: boolean };

class Encode extends React.Component {
    state: EncodeState = {
        barcode_source_number_val: "",
        barcode_source_number_is_valid: false,
        barcode_obj: null,
        current_page: "encode",
        is_product_input: false
    }

    change_page = (is_product_input: boolean) => {
        if (is_product_input === this.state.is_product_input) {
            return;
        }
        this.setState({is_product_input});
        this.reset_barcode_source_number_val();
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
                    <p style={{ textAlign: "center", marginTop: "10px", marginBottom: "3px", fontSize: "20px", fontWeight: 500 }}>
                        Results:
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "20px" }}>
                        <canvas width="219px" height="100px" id="barcode-canva" style={{width: "219px", height: "100px", marginBottom: "10px"}}></canvas>
                        <button className="btn btn-success" onClick={this.saveToFile}><i className="bi bi-download"></i> Save barcode as image (.png)</button>
                    </div>
                    <p style={{ marginBottom: "3px", textAlign: "center"}}>Also binary output:</p>
                    <textarea readOnly={true} value={this.state.barcode_obj.getBarcodeArr().join("")} style={{ fontFamily: "monospace", width: "920px", height: "30px", resize: "none", display: "block", marginLeft: "auto", marginRight: "auto" }}></textarea>
                    <button type="button" style={{display: "block"}} className="btn btn-outline-success btn-sm mx-auto my-2" onClick={this.saveToFileAsText}><i className="bi bi-download"></i> Save barcode as binary digits (.txt)</button>
                    <p style={{  marginTop: "20px", marginBottom: "3px", textAlign: "center"}}>Structured information from barcode:</p>
                    <pre className="mx-auto" style={{ width: "280px", color: "black", lineHeight: "14px", overflow: 'hidden' }}>
                        <b>Country code:</b> {this.state.barcode_obj.getCountryCode()}<br/>
                        <b>Manufacturer code:</b> {this.state.barcode_obj.getManufacturerCode()}<br/>
                        <b>Prodcut code:</b> {this.state.barcode_obj.getProdcutCode()}<br/>
                        <b>Check digit:</b> {this.state.barcode_obj.getCheckDigit()}
                    </pre>
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
                
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 219, 100);
                ctx.fillStyle = "black";

                for (let i = 0; i < barcode_arr.length; i++) {
                    if (barcode_arr[i] == 1) {
                        let tmp_height = height;
                        if ((i >= 0 && i <= 2) || (i >= 45 && i <= 49) || (i >= 92 && i <= 94)) {
                            tmp_height += 15;
                        }
                        ctx.fillRect(14 + i*i_width, 5+ 0, i_width, tmp_height);
                    }
                }

                const check_digit = this.state.barcode_obj.getCheckDigit();
                const barcode = this.state.barcode_obj.getSourceNumber() + check_digit.toString();
                ctx.font = "20px Arial";

                ctx.fillText(barcode[0], 2+ 0, 5+ 88);

                for (let i = 1; i < 7; i++) {
                    ctx.fillText(barcode[i], 2+ 7 + i * 14, 5+ 88);
                }

                for (let i = 7; i < 13; i++) {
                    ctx.fillText(barcode[i], 2+ 15 + i * 14, 5+ 88);
                }
            }
        }
    }

    saveToFile = () => {
        const canvas = document.getElementById('barcode-canva') as HTMLCanvasElement;
        canvas.toBlob((blob) => {
            saveAs(blob, "barcode_" + this.state.barcode_obj.getSourceNumber() + ".png");
        });
    }

    saveToFileAsText = () => {
        saveAs(new Blob([this.state.barcode_obj.getBarcodeArr().join("")], {type: "text/plain;charset=utf-8"}), "barcode_" + this.state.barcode_obj.getSourceNumber() + ".txt", { autoBom: true });
    }

    get_text_input = () => {
        return (
            <>
                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "20px"}}>
                    Enter <i>{BARCODE_DIGITS_COUNT}</i>-digit number in input below:
                </p>
                <DigitsPanel count_digits={BARCODE_DIGITS_COUNT} value={this.state.barcode_source_number_val} on_value_change={this.handleChange_barcode_source_number_val} />
                <pre className="source-barcode">
                    Entered barcode: "<span><b>{this.state.barcode_source_number_val}</b></span>"
                </pre>
                <p className="source-barcode-actions">
                    <button className="btn btn-secondary" onClick={this.reset_barcode_source_number_val}>Reset barcode input</button>
                </p>
            </>
        );
    }

    get_product_input = () => {
        return (
            <>
                <p style={{ marginTop: "0", textAlign: "center", fontSize: "20px"}}>
                    hmm
                </p>
            </>
        );
    }

    render() {
        return (
            <div style={{ height: "calc(100% - 20px)", marginTop: "20px" }}>
                <p style={{ marginTop: "0", textAlign: "center", fontSize: "20px"}}>
                   You can generate <b>{BARCODE_NAME}</b> barcode from:
                </p>
                <ul className="nav nav-tabs justify-content-center">
                    <li className="nav-item">
                        <a className={this.state.is_product_input ? "nav-link" : "nav-link active"} href="#" onClick={() => this.change_page(false)}>Text</a>
                    </li>
                    <li className="nav-item">
                        <a className={!this.state.is_product_input ? "nav-link" : "nav-link active"} href="#" onClick={() => this.change_page(true)}>Product</a>
                    </li>
                </ul>
                {this.state.is_product_input ? this.get_product_input() : this.get_text_input()}
                {this.append_results_block_if_needed()}
            </div>
        );
    }
}

export default Encode;
