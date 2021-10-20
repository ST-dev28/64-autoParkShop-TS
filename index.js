"use strict";
var _a;
var FuelType;
(function (FuelType) {
    FuelType[FuelType["Benzinas"] = 0] = "Benzinas";
    FuelType[FuelType["Dyzelinas"] = 1] = "Dyzelinas";
    FuelType[FuelType["Hibridas"] = 2] = "Hibridas";
})(FuelType || (FuelType = {}));
class Car {
    constructor(model, date, color, fuel, id) {
        this.model = model;
        this.date = new Date(date);
        this.color = color;
        this.fuel = +fuel;
        this.cars = [];
        this.id = id || Math.round(Math.random() * 1000);
    }
    printData(element) {
        const dateFull = this.date.toISOString().slice(0, 10);
        if (element) {
            element.innerHTML += `
                <div id="params">
                    <div>${this.model}</div>
                            <div>${dateFull}</div>
                            <div>${this.color}</div>
                            <div>${FuelType[this.fuel]}</div>
                    <div class="controls">
                        <img onclick="onUpdateCar(${this.id})" class="icon edit" src="https://cdn-icons-png.flaticon.com/512/4277/4277132.png">
                        <img onclick="onDeleteCar(${this.id})" class="icon delete" src="https://cdn-icons-png.flaticon.com/512/1617/1617543.png">
                    </div>
                </div>`;
        }
    }
}
const UI = {
    modelInput: document.getElementById("model"),
    dateInput: document.getElementById("date"),
    colorInput: document.getElementById("color"),
    fuelSelect: document.getElementById("fuel"),
    fuelOption: document.getElementById("kuras"),
    saveButton: document.getElementById("save"),
    modelInputUpd: document.getElementById("model-upd"),
    dateInputUpd: document.getElementById("date-upd"),
    colorInputUpd: document.getElementById("color-upd"),
    fuelSelectUpd: document.getElementById("fuel-upd"),
    updateButton: document.getElementById("update"),
    addCarForm: document.getElementById("add_car"),
    updateCarForm: document.getElementById("update_car"),
    allCars: document.querySelector(".list"),
};
let cars = [];
let updatedCar;
let deletedCar;
(_a = UI.saveButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const model = UI.modelInput.value;
    const date = UI.dateInput.value;
    const color = UI.colorInput.value;
    const fuel = UI.fuelSelect.value;
    if (model === '' ||
        date === '' ||
        color === '' ||
        fuel === '') {
        alert("ERROR: Details entry is required!");
        return;
    }
    ;
    const newCar = new Car(model, date, color, fuel);
    cars.push(newCar);
    display();
    saveCarsinStorage();
    UI.modelInput.value = '';
    UI.dateInput.value = '';
    UI.colorInput.value = '';
    UI.fuelSelect.value = UI.fuelOption.value;
});
function display(filter) {
    UI.allCars.innerHTML = "";
    for (const car of cars) {
        if (filter === undefined ||
            filter === car.fuel) {
            car.printData(UI.allCars);
        }
    }
}
function populateUpadateForm() {
    UI.modelInputUpd.value = updatedCar.model;
    UI.dateInputUpd.value = updatedCar.date.toISOString().slice(0, 10);
    UI.colorInputUpd.value = updatedCar.color;
    UI.fuelSelectUpd.value = updatedCar.fuel.toString();
}
function onSave() {
    updatedCar.model = UI.modelInputUpd.value;
    updatedCar.date = new Date(UI.dateInputUpd.value);
    updatedCar.color = UI.colorInputUpd.value;
    updatedCar.fuel = +UI.fuelSelectUpd.value;
    UI.addCarForm.classList.remove("hide");
    UI.updateCarForm.classList.add("hide");
    display();
    saveCarsinStorage();
}
function onUpdateCar(id) {
    for (const car of cars) {
        if (id === car.id) {
            updatedCar = car;
        }
    }
    display();
    saveCarsinStorage();
    populateUpadateForm();
    UI.addCarForm.classList.add("hide");
    UI.updateCarForm.classList.remove("hide");
}
function onDeleteCar(id) {
    for (const car of cars) {
        if (id === car.id) {
            deletedCar = car;
        }
    }
    cars.splice(cars.indexOf(deletedCar), 1);
    display();
    saveCarsinStorage();
}
function allCars() {
    display();
}
function gasCars() {
    display(FuelType.Benzinas);
}
function dieselCars() {
    display(FuelType.Dyzelinas);
}
function hybridCars() {
    display(FuelType.Hibridas);
}
const CARS_LOCAL_STORAGE_KEY = "cars";
function saveCarsinStorage() {
    const carString = JSON.stringify(cars);
    window.localStorage.setItem('CARS_LOCAL_STORAGE_KEY', carString);
    console.log("CAR");
}
function loadCars() {
    const p = window.localStorage.getItem(CARS_LOCAL_STORAGE_KEY);
    if (!p)
        return;
    const carsNoMethods = JSON.parse(p);
    for (const car of carsNoMethods) {
        const newCar = new Car(car.model, car.date, car.color, car.fuel, car.id);
        cars.push(newCar);
        console.log("NAUJAS AUTO", newCar);
    }
    display();
}
loadCars();
