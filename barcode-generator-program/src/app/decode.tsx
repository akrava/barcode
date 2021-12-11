import React from "react";
import ITF14 from "./ITF14";
// const { ipcRenderer } = require('electron');
import { IProduct } from "./../products";
import { IManufacture } from "./../manufacturers";
import { ICountry } from "./../countries";

type DecodeState = {
    is_image_input: boolean,
    text_barcode_digits: string,
    png_data: string | null,
    products: IProduct[],
    manufactures: IManufacture[],
    countries: ICountry[],
    product_idx: number
};


class Decode extends React.Component {
    state: DecodeState = {
        is_image_input: false,
        text_barcode_digits: "",
        png_data: null,
        products: [],
        manufactures: [],
        countries: [],
        product_idx: -1
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
            this.setState({
                text_barcode_digits: arg,
                product_idx: -1
            });
            this.getIdxOfProduct(arg);
        });
        window.require('electron').ipcRenderer.send('png_parse', payload);
    }

    show_loaded_image = () => {
        if (this.state.png_data !== null) {
            return (
                <>
                    <p style={{ marginTop: "20px", fontSize: "18px", marginBottom: "3px"}}>Image loaded from file:</p>
                    <img src={this.state.png_data}/>
                </>
            );
        }
        return (<></>);
    }

    get_image_input = () => {
        return (
            <>
                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "20px"}}>
                    Upload the image of barcode (.png) by clicking the button below:
                </p>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{display: "flex"}}>
                        <button className="btn btn-secondary" style={{display: this.state.png_data === null ? "none" : "block", marginRight: "10px"}} onClick={this.reset_text_input}>Reset uploaded image</button>
                        <button type="button" onClick={() => document.getElementById('file_image').click()} style={{marginRight: "auto"}} className="btn btn-primary mx-auto"><i className="bi bi-upload"></i> Load barcode image from file (.png)</button>
                    </div>
                    <input id='file_image' accept=".png" onChange={() => this.upload_image_file()} type='file' hidden/>
                    {this.show_loaded_image()}
                </div>
            </>
        );
    }

    decodeBarcode = () => {
        const result = ITF14.decode(this.state.text_barcode_digits);
        return result;
    }

    getIdxOfProduct = (text_barcode_digits: string) => {
        const barcode = ITF14.decode(text_barcode_digits);
        if (text_barcode_digits.length === 95 && barcode !== null && barcode.length === 12) {
            window.require('electron').ipcRenderer.on('get_product_by_code_reply', (_, arg: string) => {
                const product_idx = this.state.products.findIndex(x => x.id === arg);
                this.setState({
                    product_idx
                });
            });
            window.require('electron').ipcRenderer.send('get_product_by_code', barcode);
        }
    }

    upload_text_file = () => {
        const reader = new FileReader();
        const blob = (document.getElementById('file_text') as HTMLInputElement).files[0];
        reader.readAsText(blob);
        reader.onload = () => {
            this.setState({
                text_barcode_digits: reader.result.toString(),
                product_idx: -1
            });
            this.getIdxOfProduct(reader.result.toString());
        };
        
    }

    reset_text_input = () => {
        this.setState({
            text_barcode_digits: "",
            png_data: null,
            text_barcode_digits_from_png: null,
            product_idx: -1
        });
        this.getIdxOfProduct("");
        document.getElementById("textInput")?.focus();
        if (!document.getElementById("textInput")) {
            return;
        }
        (document.getElementById('file_text') as HTMLInputElement).value = "";
    }

    tmp = (value: string) => {
        this.setState({
            text_barcode_digits: value,
            product_idx: -1
        });
        this.getIdxOfProduct(value);
    }

    get_text_input = () => {
        return (
            <>
                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "20px"}}>
                    Enter barcodes digits <i>(binary representation)</i> in input below:
                </p>
                <div style={{display: "flex"}}>
                    <textarea id="textInput" value={this.state.text_barcode_digits} maxLength={95} minLength={95} onChange={(e) => this.tmp(e.currentTarget.value)} style={{ fontFamily: "monospace", width: "920px", height: "30px", resize: "none", display: "block", marginLeft: "auto", marginRight: "5px" }}></textarea>
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
        if (this.state.text_barcode_digits.length > 10 && res !== null && res.length > 1) {
            return (
                <div>
                    <hr style={{ margin: "0 30px" }}/>
                    <p style={{ textAlign: "center", marginTop: "10px", marginBottom: "3px", fontSize: "20px", fontWeight: 500 }}>
                        Results:
                    </p>

                    {this.state.text_barcode_digits !== null && this.state.is_image_input === true &&
                        <>
                            <p style={{textAlign: "center", marginBottom: "1px", fontSize: "17px", fontStyle: "italic"}}> Parsed binary digits from image:</p>
                            <p style={{fontFamily: "monospace", color: "black", textAlign: "center"}}>{this.state.text_barcode_digits}</p>
                        </>
                    }

                    <p style={{ textAlign: "center", marginTop: "0.8rem", marginBottom: "0"}}><b>Source barcode you can see below</b></p>
                    <pre className="source-barcode" style={{fontSize: "50px", marginTop: "8px", lineHeight: "40px", overflow: "hidden"}}>
                        <span><b>{res}</b></span>
                    </pre>

                    {this.state.product_idx > 0 &&
                        <>
                            <p style={{ marginTop: "8px", marginBottom: "4px", textAlign: "center", fontSize: "16px"}}>Info about product:</p>
                            <div className="mx-auto" style={{width: "400px"}}>
                                <p style={{marginBottom: "3px", fontSize: "15px"}}><b>Product name</b>: {this.state.products[this.state.product_idx].name}</p>
                                <p style={{marginBottom: "3px", fontSize: "15px"}}><b>Product type</b>: {this.state.products[this.state.product_idx].type}</p>
                                <p style={{marginBottom: "3px", fontSize: "15px"}}><b>Country</b>: {this.state.countries.find(y => y.id === this.state.manufactures.find(x => x. id === this.state.products[this.state.product_idx].manufacture_id).country_id).name}</p>
                                <p style={{marginBottom: "3px", fontSize: "15px"}}><b>Manufacture name</b>: {this.state.manufactures && this.state.manufactures.find(y => y.id === this.state.products[this.state.product_idx].manufacture_id)?.name}</p>
                                <p style={{marginBottom: "3px", fontSize: "15px"}}><b>Product code</b>: {this.state.products[this.state.product_idx].code.toString().padStart(5, "0")}</p>
                                <p style={{marginBottom: "3px", fontSize: "15px"}}><b>Product price</b>: {this.state.products[this.state.product_idx].price}</p>
                                <p style={{marginBottom: "0px", fontSize: "15px"}}><b>Product color</b>: <span style={{ color: this.state.products[this.state.product_idx].color, backgroundColor: this.state.products[this.state.product_idx].color}}>______</span></p>
                            </div>
                        </>
                    }

                </div>
            );
        } else if (this.state.text_barcode_digits.length === 0) {
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                    <p style={{ textAlign: "center", fontSize: "20px" }}>No results...</p>
                    <p style={{ textAlign: "center", marginTop: "0px", fontStyle: "italic", color: "GrayText" }}>
                        Please, {this.state.is_image_input ? " upload image of barcode " : " enter digits in the input "} for the purpose of getting here results – source of barcode
                    </p>
                </div>
            );
        } else if (this.state.text_barcode_digits.length > 10 && res === null) {
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
            document.getElementById("textInput")?.focus();
        }
        window.require('electron').ipcRenderer.on('get_all_products_reply', (_, arg: DecodeState["products"]) => {
            this.setState({
                products: arg
            });
        });
        window.require('electron').ipcRenderer.send('get_all_products');
        window.require('electron').ipcRenderer.on('get_all_manufacturers_reply', (_, arg: DecodeState["manufactures"]) => {
            this.setState({
                manufactures: arg
            });
        });
        window.require('electron').ipcRenderer.send('get_all_manufacturers');
        window.require('electron').ipcRenderer.on('get_all_countries_reply', (_, arg: ICountry[]) => {
            this.setState({
                countries: arg
            });
        });
        window.require('electron').ipcRenderer.send('get_all_countries');
    }

    render() {
        return (
            <div style={{ marginTop: "20px" }}> {/*height: "calc(100% - 20px)", */}
                <p style={{ marginTop: "0", textAlign: "center", fontSize: "20px"}}>
                   You can decode <b>ITF-14</b> barcode from:
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