import React from "react";
import { ICountry } from "./../countries";
import { IManufacture } from "./../manufacturers";


type ProductsState = { 
    current_page: "countries" | "manufacturers" | "prodcuts",
    countries: ICountry[] | null,
    manufacturers: (IManufacture)[] | null,

    country_name_input: string,
    country_name_input_is_valid: boolean,
    country_code_input: string,
    manufacturer_code_input: string,
    manufacturer_name_input: string,
};



class Products extends React.Component {
    state: ProductsState = {
        current_page: "countries",
        countries: null,
        manufacturers: null,

        country_name_input: "",
        country_name_input_is_valid: false,
        country_code_input: "",
        manufacturer_code_input: "",
        manufacturer_name_input: ""
    }

    componentDidMount() {
        this.change_page("countries", true);
    }

    change_page = (page: ProductsState["current_page"], onLoad: boolean = false) => {
        if (page != this.state.current_page || onLoad) {
            this.setState({
                current_page: page,
            });

            if (page === "countries" || page === "manufacturers") {
                window.require('electron').ipcRenderer.on('get_all_countries_reply', (_, arg: ICountry[]) => {
                    this.setState({
                        countries: arg
                    });
                });
                window.require('electron').ipcRenderer.send('get_all_countries');
            }
            if (page === "manufacturers") {
                window.require('electron').ipcRenderer.on('get_all_manufacturers_reply', (_, arg: ProductsState["manufacturers"]) => {
                    this.setState({
                        manufacturers: arg
                    });
                });
                window.require('electron').ipcRenderer.send('get_all_manufacturers');
            }

        }
    }

    render_products_page = () => {
        return (
            <div>
                <p>Products</p>
            </div>
        );
    }

    country_name_input_handler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cur_value = e.currentTarget.value;
        const find_val = this.state.countries.find(x => x.name === cur_value);
        if (find_val) {
            this.setState({
                country_name_input: cur_value,
                country_name_input_is_valid: true,
            });
            (document.getElementById('exampleInputPassword1') as HTMLInputElement).setAttribute("min", find_val.code_start.toString());
            const is_end = !!find_val.code_end;
            if (is_end) {
                (document.getElementById('exampleInputPassword1') as HTMLInputElement).setAttribute("max", find_val.code_end.toString());
                this.setState({
                    country_code_input: find_val.code_start.toString(),
                });
            } else {
                (document.getElementById('exampleInputPassword1') as HTMLInputElement).setAttribute("max", find_val.code_start.toString());
                this.setState({
                    country_code_input: find_val.code_start.toString(),
                });
            }
        } else {
            this.setState({
                country_name_input: cur_value,
                country_name_input_is_valid: false,
            });
            this.setState({
                country_code_input: "",
            });
        }
       
    }

    add_manufacturer_to_db = () => {
        
    }

    render_manufacturers_page = () => {
        const is_add_manufacturer_button_active = !!this.state.countries.find(x => x.name === this.state.country_name_input) && 
            this.state.country_name_input_is_valid && this.state.manufacturer_code_input.length === 4 && 
            this.state.manufacturer_name_input.length > 2 && Number.isInteger(+this.state.manufacturer_code_input);

        return (
            <div>
                <p style={{textAlign: "center", fontSize: "25px", marginTop: "10px", marginBottom: "0"}}>List of manufacturers</p>
                <div style={{width: "600px", height: "300px", maxWidth: "618px"}} className="table-responsive mx-auto">
                    <table style={{width: "600px"}} className="table table-striped table-hover">
                        <thead className="sticky-border" style={{position: "sticky", top: "0", backgroundColor: "#fff" }}>
                            <tr>
                                <th>Country code</th>
                                <th>Manufacture code</th>
                                <th>Manufacture name</th>
                                <th>Country name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.manufacturers && this.state.manufacturers.sort((x, y) => x.code - y.code).map(x => (
                                <tr key={x.id}>
                                    <td>{x.country_code}</td>
                                    <td>{x.code}</td>
                                    <td>{x.name}</td>
                                    <td>todo</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mx-auto" style={{ marginTop: "15px", width: "700px" }}>
                    <p style={{textAlign: "center", fontSize: "25px",}}>Add new manufacture:</p>
                    <form>
                        <div className="row g-2 mb-3">
                            <div className="col-md">
                                <label htmlFor="exampleDataList" className="form-label">Country name</label>
                                <input value={this.state.country_name_input} onChange={this.country_name_input_handler} className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..."/>
                                <datalist id="datalistOptions">
                                    {this.state.countries && this.state.countries.sort((x, y) => x.code_start - y.code_start).map(x =>(
                                        <option key={x.id} value={x.name} itemID={x.id} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="col-md">
                                <label htmlFor="exampleInputPassword1" className="form-label">Country code</label>
                                <input type="number" value={this.state.country_code_input} onChange={(e) => this.setState({country_code_input: e.currentTarget.value})} className="form-control" id="exampleInputPassword1"/>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Manafacture code</label>
                            <input type="text" pattern="\d*" value={this.state.manufacturer_code_input} maxLength={4} onChange={(e) => this.setState({manufacturer_code_input: e.currentTarget.value})} className="form-control" id="exampleInputEmail1"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Manafacture name</label>
                            <input type="text" value={this.state.manufacturer_name_input} onChange={(e) => this.setState({manufacturer_name_input: e.currentTarget.value})} className="form-control" id="exampleInputEmail1"/>
                        </div>

                        <button disabled={!is_add_manufacturer_button_active} type="button" className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>
        );
    }

    render_countries_page = () => {
        return (
            <div>
                <p style={{textAlign: "center", fontSize: "25px", marginTop: "10px", marginBottom: "0"}}>List of countries</p>
                <div style={{width: "600px", maxHeight: "618px", maxWidth: "618px"}} className="table-responsive mx-auto">
                    <table style={{width: "600px"}} className="table table-striped table-hover">
                        <thead className="sticky-border" style={{position: "sticky", top: "0", backgroundColor: "#fff" }}>
                            <tr>
                                <th>Codes</th>
                                <th>Country name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.countries && this.state.countries.sort((x, y) => x.code_start - y.code_start).map(x => (
                                <tr key={x.id}>
                                    <td>{x.code_end ? `${x.code_start.toString().padStart(3, "0")} — ${x.code_end}` : x.code_start}</td>
                                    <td>{x.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div style={{ marginTop: "20px" }}>
                <ul className="nav nav-tabs justify-content-center">
                    <li className="nav-item">
                        <a className={this.state.current_page !== "countries" ? "nav-link" : "nav-link active"} href="#" onClick={() => this.change_page("countries")}>Countries</a>
                    </li>
                    <li className="nav-item">
                        <a className={this.state.current_page !== "manufacturers" ? "nav-link" : "nav-link active"} href="#" onClick={() => this.change_page("manufacturers")}>Manufacturers</a>
                    </li>
                    <li className="nav-item">
                        <a className={this.state.current_page !== "prodcuts" ? "nav-link" : "nav-link active"} href="#" onClick={() => this.change_page("prodcuts")}>Prodcuts</a>
                    </li>
                </ul>
                {this.state.current_page === "countries" ?
                    this.render_countries_page() : this.state.current_page === "manufacturers" ?
                        this.render_manufacturers_page() : this.render_products_page()
                }
            </div>
        );
    }
}

export default Products;
