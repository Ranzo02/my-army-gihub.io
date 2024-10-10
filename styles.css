// script.js
function processFile() {
    const fileInput = document.getElementById('dutyFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Выберите файл');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Выбираем первый лист из файла
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Вызываем функцию распределения дежурных
        assignDuty(jsonData);
    };

    reader.readAsArrayBuffer(file);
}

function assignDuty(data) {
    const today = new Date().toLocaleDateString("ru-RU", { day: 'numeric', month: 'long' });
    const availableDuties = data.filter(person => person["Статус"] === "Доступен");

    let output = `<h2>Дежурные на ${today}</h2>`;
    availableDuties.forEach((person, index) => {
        output += `<p>${index + 1}. ${person["Военное звание"]} ${person["Имя и фамилия"]} — ${person["Должность"]}</p>`;
    });

    document.getElementById('output').innerHTML = output;
}