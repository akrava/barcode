import React from "react";
import EAN13 from "./ean13";
// const { ipcRenderer } = require('electron');

type DecodeState = { is_image_input: boolean, text_barcode_digits: string, png_data: string | null };


class Decode extends React.Component {
    state: DecodeState = {
        is_image_input: false,
        text_barcode_digits: "",
        png_data: null
    }

    change_page = (is_image_input: boolean) => {
        if (is_image_input === this.state.is_image_input) {
            return;
        }
        this.setState({is_image_input});
        this.reset_text_input();
    }

    upload_image_file = () => {
        const reader = new FileReader();
        const blob = (document.getElementById('file_image') as HTMLInputElement).files[0];
        reader.readAsArrayBuffer(blob);
        reader.onload = () => this.parse_image_file(reader.result);
        const urlReader = new FileReader();
        urlReader.readAsDataURL(blob);
        urlReader.onload = () => this.setState({png_data: urlReader.result});
    }

    parse_image_file = (payload: string | ArrayBuffer) => {
        window.require('electron').ipcRenderer.on('png_parse_reply', (_, arg) => {
            this.setState({text_barcode_digits: arg})
        });
        window.require('electron').ipcRenderer.send('png_parse', payload);
    }

    get_image_input = () => {
        return (
            <>
                <button type="button" onClick={() => document.getElementById('file_image').click()} style={{marginRight: "auto"}} className="btn btn-outline-success mx-auto"><i className="bi bi-upload"></i> Load barcode image from file (.png)</button>
                <input id='file_image' accept=".png" onChange={() => this.upload_image_file()} type='file' hidden/>
                <p>hmm image</p>
                {this.state.png_data !== null &&
                    <img src={this.state.png_data}/>
                }
                {this.state.text_barcode_digits !== null &&
                    <>
                        <p>{this.state.text_barcode_digits}</p>
                        <p>{this.decodeBarcode()}</p>
                    </>
                }
            </>
        );
    }

    decodeBarcode = () => {
        const result = EAN13.decode(this.state.text_barcode_digits);
        return result;
    }

    upload_text_file = () => {
        const reader = new FileReader();
        const blob = (document.getElementById('file_text') as HTMLInputElement).files[0];
        reader.readAsText(blob);
        reader.onload = () => this.setState({text_barcode_digits: reader.result.toString()});
    }

    reset_text_input = () => {
        this.setState({text_barcode_digits: "", png_data: null, text_barcode_digits_from_png: null});
        document.getElementById("textInput").focus();
        (document.getElementById('file_text') as HTMLInputElement).value = "";
    }

    get_text_input = () => {
        return (
            <>
                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "20px"}}>
                    Enter barcodes digits <i>(binary representation)</i> in input below:
                </p>
                <div style={{display: "flex"}}>
                    <textarea id="textInput" value={this.state.text_barcode_digits} maxLength={95} minLength={95} onChange={(e) => this.setState({text_barcode_digits: e.currentTarget.value})} style={{ fontFamily: "monospace", width: "920px", height: "30px", resize: "none", display: "block", marginLeft: "auto", marginRight: "5px" }}></textarea>
                    <button type="button" onClick={() => document.getElementById('file_text').click()} style={{marginRight: "auto"}} className="btn btn-outline-success btn-sm mr-auto"><i className="bi bi-upload"></i> Load binary digits from file (.txt)</button>
                    <input id='file_text' accept=".txt" onChange={() => this.upload_text_file()} type='file' hidden/>
                </div>
                <p className="source-barcode-actions" style={{marginTop: "20px"}}>
                    <button className="btn btn-secondary" onClick={this.reset_text_input}>Reset barcode input</button>
                </p>
            </>
        );
    }

    results_block = () => {
        const res = this.decodeBarcode();
        if (this.state.text_barcode_digits.length === 95 && res !== null && res.length === 12) {
            return (
                <div>
                    <hr style={{ margin: "0 30px" }}/>
                    <p style={{ textAlign: "center", marginTop: "10px", marginBottom: "3px", fontSize: "20px", fontWeight: 500 }}>
                        Results:
                    </p>
                    <p style={{ textAlign: "center", marginTop: "1rem", marginBottom: "0"}}><b>Barcode is:</b></p>
                    <pre className="source-barcode" style={{fontSize: "50px"}}>
                        <span><b>{res}</b></span>
                    </pre>
                </div>
            );
        } else if (this.state.text_barcode_digits.length === 0) {
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                    <p style={{ textAlign: "center", fontSize: "20px" }}>No results...</p>
                    <p style={{ textAlign: "center", marginTop: "0px", fontStyle: "italic", color: "GrayText" }}>
                        Please, enter digits in the input for the purpose of getting here results – source of barcode
                    </p>
                </div>
            );
        } else if (this.state.text_barcode_digits.length === 95 && res === null) {
            return (
                <div className="callout callout-error mx-auto" style={{width: "400px"}}>
                    <h5>Couldn't validate barcodes digits</h5>
                    <p style={{marginBottom: "0"}}>There is an error in your input, check it please</p>
                </div>
            );
        } else {
            return (
                <div className="callout callout-warning mx-auto" style={{width: "400px"}}>
                    <h5>Your input is not complete</h5>
                    <p style={{marginBottom: "0"}}>You need to paste {95 - this.state.text_barcode_digits.length} digits more</p>
                </div>
            );
        }
    }

    componentDidMount() {
        if (!this.state.is_image_input) {
            document.getElementById("textInput").focus();
        }
    }

    render() {
        return (
            <div style={{ height: "calc(100% - 20px)", marginTop: "20px" }}>
                <p style={{ marginTop: "0", textAlign: "center", fontSize: "20px"}}>
                   You can decode <b>EAN-13</b> barcode from:
                </p>
                <ul className="nav nav-tabs justify-content-center">
                    <li className="nav-item">
                        <a className={this.state.is_image_input ? "nav-link" : "nav-link active"} href="#" onClick={() => this.change_page(false)}>Text</a>
                    </li>
                    <li className="nav-item">
                        <a className={!this.state.is_image_input ? "nav-link" : "nav-link active"} href="#" onClick={() => this.change_page(true)}>Image</a>
                    </li>
                </ul>
                {this.state.is_image_input ? this.get_image_input() : this.get_text_input()}
                {this.results_block()}
            </div>
        );
    }
}

export default Decode;