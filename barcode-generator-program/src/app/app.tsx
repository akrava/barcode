import React from "react";
import Decode from "./decode";
import Products from "./products";
import Encode from "./encode";

type AppState = { current_page: "encode" | "decode" | "products" };

class App extends React.Component {
    state: AppState = {
        current_page: "encode"
    }

    render() {
        const current_page = this.state.current_page;
        return (
            <div > {/* style={{ height: "calc(100% - 51px)" */}
                <div style={{ paddingTop: "15px", paddingBottom: "15px", backgroundColor: "#fff6e4", borderBottom: "1px solid #111d38" }}>
                    <nav className="nav nav-pills nav-fill justify-content-center mx-auto" style={{ width: "500px" }}>
                        <a className={current_page !== "products" ? "nav-link" : "nav-link active"} href="#" onClick={() => this.setState({current_page: "products"})}>Products</a>
                        <a className={current_page !== "encode" ? "nav-link" : "nav-link active"} href="#" onClick={() => this.setState({current_page: "encode"})}>Encode</a>
                        <a className={current_page !== "decode" ? "nav-link" : "nav-link active"} href="#" onClick={() => this.setState({current_page: "decode"})}>Decode</a>
                    </nav>
                </div>
                {current_page == "encode" ? <Encode/> : current_page == "products" ? <Products/> : <Decode/>}
            </div>
        );
    }
}

export default App;
