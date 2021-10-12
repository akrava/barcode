import React from "react";
import useDigitInput, { InputAttributes } from 'react-digit-input';



function getArrayOfDigitInputs(count: number, digits: InputAttributes[]) {
    let result = [
        <input id="first-input-digit" className="input-digit" key={0} inputMode="decimal" autoFocus {...digits[0]} />
    ];
    for (let i = 1; i < count; i++) {
        if (i == count - 1) {
            result.push(<input className="input-digit" key={i} id="last-input-digit" inputMode="decimal" {...digits[i]} />);
        } else {
            result.push(<input className="input-digit" key={i} inputMode="decimal" {...digits[i]} />);
        }
    }
    return result;
}

export default function DigitsPanel(props: { count_digits: number, on_value_change: (value: string) => void, value?: string }) {
    const [value, onChange] = React.useState(props.value ?? '');
    if (props.value !== value) {
        onChange(props.value);
    }
    const digits = useDigitInput({
        acceptedCharacters: /^[0-9]$/,
        length: props.count_digits,
        value,
        onChange: x => {
            onChange(x);
            props.on_value_change(x);
        },
    });

    return (
        <div className="input-group">
            {getArrayOfDigitInputs(props.count_digits, digits)}
        </div>
    );
}
