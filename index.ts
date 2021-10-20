// apsirasom kuro tipus
enum FuelType {
    Benzinas,
    Dyzelinas,
    Hibridas,
}

interface CarI {
    model: string,
    date: string,
    color: string,
    fuel: string,
    id: number
}

// kuriam automobilio duomenu sablona
class Car {

    public model: string;
    public date: Date;
    public color: string;
    public fuel: FuelType;
    public cars: Car[];
    public id: number;

    constructor(model: string, date: string, color: string, fuel: string, id?: number) {
        this.model = model;
        this.date = new Date(date);
        this.color = color;
        this.fuel = +fuel;
        this.cars = [];

        this.id = id || Math.round(Math.random() * 1000);
    }

    public printData(element?: HTMLElement): void {
        const dateFull = this.date.toISOString().slice(0, 10);
        //console.log(dateFull);

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
    modelInput: document.getElementById("model") as HTMLInputElement,
    dateInput: document.getElementById("date") as HTMLInputElement,
    colorInput: document.getElementById("color") as HTMLInputElement,
    fuelSelect: document.getElementById("fuel") as HTMLSelectElement,
    fuelOption: document.getElementById("kuras") as HTMLOptionElement,
    saveButton: document.getElementById("save") as HTMLButtonElement,

    modelInputUpd: document.getElementById("model-upd") as HTMLInputElement,
    dateInputUpd: document.getElementById("date-upd") as HTMLInputElement,
    colorInputUpd: document.getElementById("color-upd") as HTMLInputElement,
    fuelSelectUpd: document.getElementById("fuel-upd") as HTMLSelectElement,
    updateButton: document.getElementById("update") as HTMLButtonElement,

    addCarForm: document.getElementById("add_car") as HTMLDivElement,
    updateCarForm: document.getElementById("update_car") as HTMLDivElement,

    allCars: document.querySelector<HTMLDivElement>(".list") as HTMLDivElement,
}

// apsirasom visus kitamuosius automobilio objekto kurimui
let cars: Car[] = [];
let updatedCar: Car;
let deletedCar: Car;

UI.saveButton?.addEventListener("click", () => {
    const model = UI.modelInput.value;
    const date = UI.dateInput.value;
    const color = UI.colorInput.value;
    const fuel = UI.fuelSelect.value;

    //console.log("Mygtukas paspaustas!");

    // VALIDATIONS and ALERTS
    //For adding a car to the list
    if (model === '' ||
        date === '' ||
        color === '' ||
        fuel === '') {
        alert("ERROR: Details entry is required!")
        return
    };

    const newCar = new Car(model, date, color, fuel)

    //console.log(cars);
    cars.push(newCar)
    display();
    saveCarsinStorage();

    // refreshinam laukus, kad istrintu juose pries tai suvestas reiksmes
    UI.modelInput.value = '';
    UI.dateInput.value = '';
    UI.colorInput.value = '';
    UI.fuelSelect.value = UI.fuelOption.value;
});

// datos formatavimo funkcija
/*function formatDate(date: string) {
    const df = new Date(date);
    const newDateFormat = [df.getFullYear(), df.getMonth() + 1, df.getDate()].join(' ');
    return newDateFormat.toLocaleString();   // arba .toISOString().slice(0,10)   
}*/

// spausdina auto info HTML lenteleje
function display(filter?: FuelType): void {
    UI.allCars.innerHTML = "";
    for (const car of cars) {
        if (filter === undefined ||
            filter === car.fuel) {
            car.printData(UI.allCars);
            //console.log("***show data***");
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

function onUpdateCar(id: number): void {
    for (const car of cars) {
        if (id === car.id) {
            updatedCar = car;
        }
    }

    //console.log("Atnaujinti auto...", updatedCar);
    display();
    saveCarsinStorage();
    populateUpadateForm();

    UI.addCarForm.classList.add("hide");
    UI.updateCarForm.classList.remove("hide");
}

function onDeleteCar(id: number) {
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

// funkcija objektu saugojimui lokalioje atmintyje (local storage)
function saveCarsinStorage(): void {
    const carString = JSON.stringify(cars);
    window.localStorage.setItem('CARS_LOCAL_STORAGE_KEY', carString)
    console.log("CAR");
    
}

//uzkrauna objektu sarasa is Local Storage
function loadCars(): void {
    const p = window.localStorage.getItem(CARS_LOCAL_STORAGE_KEY);

    if (!p)   // grazina arba null arba true
        return;  // jei null ar tuscias, toliau neina

    const carsNoMethods: CarI[] = JSON.parse(p);
    for (const car of carsNoMethods) {
        const newCar = new Car(car.model, car.date, car.color, car.fuel, car.id);

        cars.push(newCar);
        console.log("NAUJAS AUTO", newCar);
    }
    display();
}

loadCars();