import React from "react";
import DigitsPanel from "./digits";

const BARCODE_DIGITS_COUNT = 12;
const BARCODE_NAME = "EAN-13";

class App extends React.Component {
    hmm(x: string) {
        console.log(x);
    }

    render() {
        return (
            <>
                <p style={{textAlign: "center", fontSize: "20px"}}>
                    In order to generate <b>{BARCODE_NAME}</b> barcode, enter <i>{BARCODE_DIGITS_COUNT}</i>-digit number in input below:
                </p>
                <DigitsPanel count_digits={BARCODE_DIGITS_COUNT} value="123456789012" on_value_change={this.hmm} />
            </>
        );
    }
}

export default App;
