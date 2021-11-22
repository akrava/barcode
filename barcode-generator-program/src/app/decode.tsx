import React from "react";


type DecodeState = { is_image_input: boolean };


class Decode extends React.Component {
    state: DecodeState = {
        is_image_input: false
    }

    change_page = (is_image_input: boolean) => {
        if (is_image_input === this.state.is_image_input) {
            return;
        }
        this.setState({is_image_input});
    }

    get_image_input = () => {
        return (
            <>
                <p>hmm image</p>
            </>
        );
    }

    get_text_input = () => {
        return (
            <>
                <p>hmm text</p>
            </>
        );
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
            </div>
        );
    }
}

export default Decode;