import { Schema, Document } from "mongoose";
import mongoose from "mongoose";


export interface ICountry extends Document {
    code_start: number;
    code_end?: number;
    name:   string;
}

const CountrySchema: Schema = new Schema({
    code_start: { type: Number, required: true, unique: true },
    code_end:   { type: Number, required: false },
    name:       { type: String,  required: true },
});

const CountryModel = mongoose.model<ICountry>("Country", CountrySchema);

export default CountryModel;

const static_data_countris = [
    [["0", "139"],  	"United States and Canada"],
    [["300", "379"],  	"France and Monaco"],
    [["380"],  	 "Bulgaria"],
    [["383"],  	 "Slovenia"],
    [["385"],  	 "Croatia"],
    [["387"],  	 "Bosnia and Herzegovina"],
    [["389"],  	 "Montenegro"],
    [["390"],  	 "Kosovo"],
    [["400", "440"],  	 "Germany"],
    [["450", "459"],  	 "Japan"],
    [["460", "469"],  	 "Russia"],
    [["470"],  	 "Kyrgyzstan"],
    [["471"],  	 "Taiwan"],
    [["474"],  	 "Estonia"],
    [["475"],  	 "Latvia"],
    [["476"],  	 "Azerbaijan"],
    [["477"],  	 "Lithuania"],
    [["478"],  	 "Uzbekistan"],
    [["479"],  	 "Sri Lanka"],
    [["480"],  	 "Philippines"],
    [["481"],  	 "Belarus"],
    [["482"],  	 "Ukraine"],
    [["483"],  	 "Turkmenistan"],
    [["484"],  	 "Moldova"],
    [["485"],  	 "Armenia"],
    [["486"],  	 "Georgia"],
    [["487"],  	 "Kazakhstan"],
    [["488"],  	 "Tajikistan"],
    [["489"],  	 "Hong Kong"],
    [["490", "499"],  	 "Japan"],
    [["500", "509"],  	 "United Kingdom"],
    [["520", "521"],  	 "Greece"],
    [["528"],  	 "Lebanon"],
    [["529"],  	 "Cyprus"],
    [["530"],  	 "Albania"],
    [["531"],  	 "North Macedonia"],
    [["535"],  	 "Malta"],
    [["539"],  	 "Ireland"],
    [["540", "549"],  	 "Belgium and Luxembourg"],
    [["560"],  	 "Portugal"],
    [["569"],  	 "Iceland"],
    [["570", "579"],  	 "Denmark, Faroe Islands and Greenland"],
    [["590"],  	 "Poland"],
    [["594"],  	 "Romania"],
    [["599"],  	 "Hungary"],
    [["600", "601"],  	 "South Africa"],
    [["603"],  	 "Ghana"],
    [["604"],  	 "Senegal"],
    [["608"],  	 "Bahrain"],
    [["609"],  	 "Mauritius"],
    [["611"],  	 "Morocco"],
    [["613"],  	 "Algeria"],
    [["615"],  	 "Nigeria"],
    [["616"],  	 "Kenya"],
    [["617"],  	 "Cameroon"],
    [["618"],  	 "Ivory Coast"],
    [["619"],  	 "Tunisia"],
    [["620"],  	 "Tanzania"],
    [["621"],  	 "Syria"],
    [["622"],  	 "Egypt"],
    [["623"],  	 "Brunei"],
    [["624"],  	 "Libya"],
    [["625"],  	 "Jordan"],
    [["626"],  	 "Iran"],
    [["627"],  	 "Kuwait"],
    [["628"],  	 "Saudi Arabia"],
    [["629"],  	 "United Arab Emirates"],
    [["630"],  	 "Qatar"],
    [["631"],  	 "Namibia"],
    [["640", "649"],  	 "Finland"],
    [["690", "699"],  	 "China"],
    [["700", "709"],  	 "Norway"],
    [["729"],  	 "Israel"],
    [["730", "739"],  	 "Sweden"],
    [["740"],  	 "Guatemala"],
    [["741"],  	 "El Salvador"],
    [["742"],  	 "Honduras"],
    [["743"],  	 "Nicaragua"],
    [["744"],  	 "Costa Rica"],
    [["745"],  	 "Panama"],
    [["746"],  	 "Dominican Republic"],
    [["750"],  	 "Mexico"],
    [["754", "755"],  	 "Canada"],
    [["759"],  	 "Venezuela"],
    [["760", "769"],  	  "Switzerland and Liechtenstein"],
    [["770", "771"],  	 "Colombia"],
    [["773"],  	 "Uruguay"],
    [["775"],  	 "Peru"],
    [["777"],  	 "Bolivia"],
    [["778", "779"],  	 "Argentina"],
    [["780"],  	 "Chile"],
    [["784"],  	 "Paraguay"],
    [["786"],  	 "Ecuador"],
    [["789", "790"],  	 "Brazil"],
    [["800", "839"],  	 "Italy, San Marino and Vatican City"],
    [["840", "849"],  	 "Spain and Andorra"],
    [["850"],  	 "Cuba"],
    [["858"],  	 "Slovakia"],
    [["859"],  	 "Czech Republic"],
    [["860", "506"],  	 "Serbia"],
    [["865"],  	 "Mongolia"],
    [["867"],  	 "North Korea"],
    [["868", "869"],  	 "Turkey"],
    [["870", "879"],  	 "Netherlands"],
    [["880"],  	 "South Korea"],
    [["883"],  	 "Myanmar"],
    [["884"],  	 "Cambodia"],
    [["885"],  	 "Thailand"],
    [["888"],  	 "Singapore"],
    [["890"],  	 "India"],
    [["893"],  	 "Vietnam"],
    [["894"],  	 "Bangladesh"],
    [["896"],  	 "Pakistan"],
    [["899"],  	 "Indonesia"],
    [["900", "919"],  	 "Austria"],
    [["930", "939"],  	 "Australia"],
    [["940", "949"],  	 "New Zealand"],
    [["955"],  	 "Malaysia"],
    [["958"],  	 "Macau"],
    [["977"],  	"Serial publications (ISSN)"],
    [["978", "979"],  	"Bookland (ISBN)"],
    [["980"],  	"Refund receipts"],
];

// for (let i = 0; i < countries_data.length; i++) {
//     const codes = countries_data[i][0];
//     const name = countries_data[i][1];
//     const start_code = +codes[0];
//     let end_code: number | null = null;
//     if (codes.length === 2) {
//         end_code = +codes[1];
//     }
//     // CountryModel.create({ code_start: start_code, name: name, code_end: end_code }).then((data: ICountry) => {
//     //     console.log(data);
//     // }).catch((e: Error) => {
//     //     console.log(e);
//     // });
// }
