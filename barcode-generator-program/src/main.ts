import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as dotenv from 'dotenv';
import mongoose from "mongoose";
import { PNG } from 'pngjs';
import CountryModel, { ICountry } from "./countries";
import ManufactureModel, { IManufacture } from "./manufacturers";
import ProductModel, { IProduct } from "./products";


dotenv.config();

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 1000,
        width: 1500,
        minHeight: 1000,
        minWidth: 1500,
        autoHideMenuBar: true, // set to true
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
        },
    });

    mainWindow.menuBarVisible = false;


    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL(`http://localhost:4000`);
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, "../index.html"))
    }

    // and load the index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../index.html"));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {

    mongoose.connect(process.env.DB_URL)
        .catch(err => err ? console.error(err) : console.log("Opened connection with db"))
        .then(() => createWindow())
        .catch(err => console.error(err));

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//


ipcMain.on('get_all_countries', function (event) {
    CountryModel.find({}).then((data) => {
        event.reply('get_all_countries_reply', data.map(x => {
            return {
                name: x.name,
                code_start: x.code_start,
                code_end: x.code_end,
                id: x.id
            }
        }));
    }).catch((e) => {
        console.log(e);
    });
});


ipcMain.on('get_all_manufacturers', function (event) {
    ManufactureModel.find({}).then((data) => {
        event.reply('get_all_manufacturers_reply', data.map(x => {
            return {
                name: x.name,
                code: x.code,
                country_id: x.country_id.toString(),
                country_code: x.country_code,
                id: x.id,
            }
        }));
    }).catch((e) => {
        console.log(e);
    });
});

ipcMain.on('add_manufacture', function (_, arg: IManufacture) {
    new ManufactureModel({
        country_id: arg.country_id,
        country_code: arg.country_code,
        code: arg.code,
        name: arg.name,
        description: arg.description
    }).save().then((data => {
        // console.log(data);
    }));
});

ipcMain.on('update_manufacture', function (_, arg: IManufacture) {
    ManufactureModel.findByIdAndUpdate(arg.id, {
        $set: {
            country_id: arg.country_id,
            country_code: arg.country_code,
            code: arg.code,
            name: arg.name
        }
    }).then(data => {

    }).catch(e => {
        console.log(e);
    });
});

ipcMain.on('delete_manufacture', function (_, arg: string) {
    ManufactureModel.findByIdAndRemove(arg).then(data => {

    });
});



ipcMain.on('get_all_products', function (event) {
    ProductModel.find({}).then((data) => {
        event.reply('get_all_products_reply', data.map(x => {
            return {
                manufacture_id: x.manufacture_id.toString(),
                code: x.code,
                name: x.name,
                type: x.type,
                color: x.color,
                price: x.price,
                id: x.id,
            }
        }));
    }).catch((e) => {
        console.log(e);
    });
});

ipcMain.on('add_product', function (_, arg: IProduct) {
    new ProductModel({
        manufacture_id: arg.manufacture_id,
        code: arg.code,
        name: arg.name,
        type: arg.type,
        color: arg.color,
        price: arg.price,
    }).save().then((data => {
        // console.log(data);
    }));
});

ipcMain.on('update_product', function (_, arg: IProduct) {
    ProductModel.findByIdAndUpdate(arg.id, {
        $set: {
            manufacture_id: arg.manufacture_id,
            code: arg.code,
            name: arg.name,
            type: arg.type,
            color: arg.color,
            price: arg.price,
        }
    }).then(data => {

    }).catch(e => {
        console.log(e);
    });
});

ipcMain.on('delete_product', function (_, arg: string) {
    ProductModel.findByIdAndRemove(arg).then(data => {

    });
});

ipcMain.on('get_product_by_code', function (event, arg: string) {
    if (arg && arg.length == 12) {
        const c_code = arg.substr(0, 3);
        const m_code = arg.substr(3, 4);
        const p_code = arg.substr(7);
        ManufactureModel.findOne({
            country_code: +c_code,
            code: +m_code
        }).then(data => {
            if (data === null) {
                return;
            }
            console.log(data);
            ProductModel.findOne({
                manufacture_id: data.id,
                code: +p_code
            }).then(res => {
                event.reply('get_product_by_code_reply', res.id);
            });
        })
    }
});


ipcMain.on('get_product_code', function (event, arg: string) {
    let p_code: string;
    let m_code: string;
    let c_code: string;
    ProductModel.findById(arg).then(data => {
        if (data === null) {
            return;
        }
        p_code = data.code.toString().padStart(5, "0");
        ManufactureModel.findById(data.manufacture_id).then(man => {
            m_code = man.code.toString().padStart(4, "0")
            c_code = man.country_code.toString().padStart(3, "0");
            event.reply('get_product_code_reply', c_code + m_code + p_code);
        });
    });
});

//
ipcMain.on('png_parse', (event, arg) => {
    const data = arg as ArrayBuffer;
    new PNG({ filterType: 4 }).parse(Buffer.from(data)).on("parsed", function () {
        const arr_data_raw: number[] = [];
        for (let y = 50; y == 50; y++) {
            for (let x = 0; x < this.width; x++) {
                const idx = (this.width * y + x) << 2;
                const red = this.data[idx];
                arr_data_raw.push(red === 255 ? 0 : 1);
            }
        }
        arr_data_raw.splice(0, 14);
        const shrinked_arr_data_raw: number[] = [];
        for (let i = 0; i < arr_data_raw.length; i += 2) {
            shrinked_arr_data_raw.push(arr_data_raw[i]);
        }
        shrinked_arr_data_raw.splice(95);

        event.reply('png_parse_reply', shrinked_arr_data_raw.join(""));
    });
});
