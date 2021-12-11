import React from "react";
import { ICountry } from "./../countries";
import { IManufacture } from "./../manufacturers";
import { IProduct } from "./../products";


type ProductsState = { 
    current_page: "countries" | "manufacturers" | "products",
    countries: ICountry[] | null,
    manufacturers: (IManufacture)[] | null,
    products: (IProduct)[] | null,

    country_name_input: string,
    country_name_input_is_valid: boolean,
    country_code_input: string,
    manufacturer_code_input: string,
    manufacturer_name_input: string,
    manufacturer_id_edit: string | null;

    manufacture_name_input: string,
    product_name_input: string,
    product_type_input: string,
    product_color_input: string,
    product_price_input: string,
    product_code_input: string,
    product_id_edit: string | null;
};



class Products extends React.Component {
    state: ProductsState = {
        current_page: "countries",
        countries: [],
        manufacturers: [],
        products: [],

        country_name_input: "",
        country_name_input_is_valid: false,
        country_code_input: "",
        manufacturer_code_input: "",
        manufacturer_name_input: "",
        manufacturer_id_edit: null,

        manufacture_name_input: "",
        product_name_input: "",
        product_type_input: "",
        product_color_input: "#000000",
        product_price_input: "",
        product_code_input: "",
        product_id_edit: null,
    }

    componentDidMount() {
        this.load_products();
    }

    load_mabufactures = () => {
        window.require('electron').ipcRenderer.on('get_all_manufacturers_reply', (_, arg: ProductsState["manufacturers"]) => {
            this.setState({
                manufacturers: arg
            });
        });
        window.require('electron').ipcRenderer.send('get_all_manufacturers');
    }

    load_products = () => {
        window.require('electron').ipcRenderer.on('get_all_products_reply', (_, arg: ProductsState["products"]) => {
            this.setState({
                products: arg
            });
        });
        window.require('electron').ipcRenderer.send('get_all_products');
    }

    change_page = (page: ProductsState["current_page"], onLoad: boolean = false) => {
        if (page != this.state.current_page || onLoad) {
            this.setState({
                current_page: page,
                manufacturer_id_edit: null
            });

            this.load_products();

        }
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
        if (this.state.manufacturer_id_edit === null) {
            window.require('electron').ipcRenderer.send('add_manufacture', {
                country_id: this.state.countries.find(x => x.name === this.state.country_name_input).id,
                country_code: this.state.country_code_input,
                code: this.state.manufacturer_code_input,
                name: this.state.manufacturer_name_input,
                description: ""
            });
        } else {
            window.require('electron').ipcRenderer.send('update_manufacture', {
                id: this.state.manufacturer_id_edit,
                country_id: this.state.countries.find(x => x.name === this.state.country_name_input).id,
                country_code: this.state.country_code_input,
                code: this.state.manufacturer_code_input,
                name: this.state.manufacturer_name_input,
                description: ""
            });
        }
    }

    add_manufacturer_click_handler = () => {
        this.add_manufacturer_to_db();
        this.setState({
            country_name_input: "",
            country_name_input_is_valid: false,
            country_code_input: "",
            manufacturer_code_input: "",
            manufacturer_name_input: "",
            manufacturer_id_edit: null
        });
        setTimeout(() => this.load_mabufactures(), 400);
    }

    add_product_to_db = () => {
        if (this.state.product_id_edit === null) {
            window.require('electron').ipcRenderer.send('add_product', {
                manufacture_id: this.state.manufacturers.find(x => x.name === this.state.manufacture_name_input).id,
                code: this.state.product_code_input,
                name: this.state.product_name_input,
                type: this.state.product_type_input,
                color: this.state.product_color_input,
                price: this.state.product_price_input,
            });
        } else {
            window.require('electron').ipcRenderer.send('update_product', {
                id: this.state.product_id_edit,
                manufacture_id: this.state.manufacturers.find(x => x.name === this.state.manufacture_name_input).id,
                code: this.state.product_code_input,
                name: this.state.product_name_input,
                type: this.state.product_type_input,
                color: this.state.product_color_input,
                price: this.state.product_price_input
            });
        }
    }

    add_product_click_handler = () => {
        this.add_product_to_db();
        this.setState({
            manufacture_name_input: "",
            product_name_input: "",
            product_type_input: "",
            product_color_input:"#000000",
            product_price_input: "",
            product_code_input: "",
            product_id_edit: null,
        });
        setTimeout(() => this.load_products(), 400);
    }

    delete_manufacturer = (id: string) => {
        window.require('electron').ipcRenderer.send('delete_manufacture', id);
        setTimeout(() => this.load_mabufactures(), 400);
    }

    delete_product = (id: string) => {
        window.require('electron').ipcRenderer.send('delete_product', id);
        setTimeout(() => this.load_products(), 400);
    }

    set_manufacturer_to_edit = (id: string) => {
        const cur_m = this.state.manufacturers.find(x => x.id === id);
        const countr = this.state.countries.find(x => x.id === cur_m.country_id);
        this.setState({
            manufacturer_id_edit: id,
            country_name_input: countr.name,
            country_name_input_is_valid: true,
            country_code_input: cur_m.country_code.toString(),
            manufacturer_code_input: cur_m.code.toString(),
            manufacturer_name_input: cur_m.name,
        });
    }

    set_product_to_edit = (id: string) => {
        const cur_p = this.state.products.find(x => x.id === id);
        const manuf = this.state.manufacturers.find(x => x.id === cur_p.manufacture_id);
        this.setState({
            manufacture_name_input: manuf.name,
            product_name_input: cur_p.name,
            product_type_input: cur_p.type,
            product_color_input: cur_p.color,
            product_price_input: cur_p.price.toString(),
            product_code_input: cur_p.code.toString(),
            product_id_edit: id,
        });
    }

    cancel_product_to_edit = () => {
        this.setState({
            manufacture_name_input: "",
            product_name_input: "",
            product_type_input: "",
            product_color_input: "#000000",
            product_price_input: "",
            product_code_input: "",
            product_id_edit: null,
        });
    }

    cancel_manufacturer_to_edit = () => {
        this.setState({
            manufacturer_id_edit: null,
            country_name_input: "",
            country_name_input_is_valid: false,
            country_code_input: "",
            manufacturer_code_input: "",
            manufacturer_name_input: "",
        });
    }

    render_products_page = () => {
        console.log('this.state.product', this.state.products);
        

        return (
            <div>
                <p style={{textAlign: "center", fontSize: "25px", marginTop: "10px", marginBottom: "0"}}>List of products</p>
                <div style={{width: "1417px", maxWidth: "1417px"}} className="table-responsive mx-auto">
                    <table style={{width: "1400px"}} className="table table-striped table-hover">
                        <thead className="sticky-border manuf" style={{position: "sticky", top: "0", backgroundColor: "#fff" }}>
                            <tr>
                                <th>Code</th>
                                <th>Product name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.products.map(x => (
                                <tr key={x.id}>
                                    <td>{x.code.toString()}</td>
                                    <td>{x.name}</td>
                                    <td>{x.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    render_manufacturers_page = () => {
        const is_add_manufacturer_button_active = !!this.state.countries.find(x => x.name === this.state.country_name_input) && 
            this.state.country_name_input_is_valid && this.state.manufacturer_code_input.length === 4 && 
            this.state.manufacturer_name_input.length > 2 && Number.isInteger(+this.state.manufacturer_code_input);

        return (
            <div>
                <p style={{textAlign: "center", fontSize: "25px", marginTop: "10px", marginBottom: "0"}}>List of manufacturers</p>
                <div style={{width: "1417px", height: "300px", maxWidth: "1417px"}} className="table-responsive mx-auto">
                    <table style={{width: "1400px"}} className="table table-striped table-hover">
                        <thead className="sticky-border manuf" style={{position: "sticky", top: "0", backgroundColor: "#fff" }}>
                            <tr>
                                <th style={{width: "120px"}}>Country code</th>
                                <th style={{width: "160px"}}>Manufacture code</th>
                                <th style={{width: "360px"}}>Country name</th>
                                <th>Manufacture name</th>
                                <th  style={{width: "85px"}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.manufacturers && this.state.manufacturers.sort((x, y) => x.code - y.code).map(x => (
                                <tr key={x.id}>
                                    <td>{x.country_code.toString().padStart(3, "0")}</td>
                                    <td>{x.code.toString().padStart(4, "0")}</td>
                                    <td>{this.state.countries.find(y => y.id === x.country_id)?.name}</td>
                                    <td>{x.name}</td>
                                    <td><i style={{marginRight: "15px", cursor: "pointer"}} id={"e_m" + x.id} onClick={(e) => this.set_manufacturer_to_edit(e.currentTarget.id.substr(3))} className="bi bi-pencil"></i><i style={{cursor: "pointer"}} id={"d_m" + x.id} onClick={(e) => this.delete_manufacturer(e.currentTarget.id.substr(3))} className="bi bi-trash"></i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mx-auto" style={{ marginTop: "15px", width: "700px" }}>
                    <p style={{textAlign: "center", fontSize: "25px",}}>{!this.state.manufacturer_id_edit ? "Add new manufacture:" : "Edit manufacture:"}</p>
                    <form id="add_manufacturer">
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

                        <button disabled={!is_add_manufacturer_button_active} onClick={() => this.add_manufacturer_click_handler()} type="button" className="btn btn-primary">{!this.state.manufacturer_id_edit ? "Add" : "Update"}</button>
                        <button style={{ marginLeft: "20px", display: !this.state.manufacturer_id_edit ? "none" : ""}} onClick={() => this.cancel_manufacturer_to_edit()} type="button" className="btn btn-secondary">Cancel</button>
                    </form>
                </div>
            </div>
        );
    }

    render_countries_page = () => {
        return (
            <div>
                <p style={{textAlign: "center", fontSize: "25px", marginTop: "10px", marginBottom: "0"}}>List of countries</p>
                <div style={{width: "618px", maxHeight: "618px", maxWidth: "618px"}} className="table-responsive mx-auto">
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
                {
                    this.render_products_page()
                }
            </div>
        );
    }
}

export default Products;
