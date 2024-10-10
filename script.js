function assignDuties() {
    let files = [
        document.getElementById('uploadExcel1').files[0],
        document.getElementById('uploadExcel2').files[0],
        document.getElementById('uploadExcel3').files[0],
        document.getElementById('uploadExcel4').files[0],
        document.getElementById('uploadExcel5').files[0],
    ];

    let assignments = {}; // Здесь будут храниться данные о распределении дежурств

    // Функция для обработки каждого Excel-файла
    files.forEach((file, index) => {
        let reader = new FileReader();

        reader.onload = function(e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, {type: 'array'});
            let firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            let sheetData = XLSX.utils.sheet_to_json(firstSheet);

            // Добавляем дежурных из этого файла в соответствующую роль
            if (index === 0) {
                assignments["Дежурный по части"] = sheetData;
            } else if (index === 1) {
                assignments["Помощник дежурного по части"] = sheetData;
            } else if (index === 2) {
                assignments["Наряд в столовую"] = sheetData;
            } else if (index === 3) {
                assignments["Наряд по КПП"] = sheetData;
            }
        };

        reader.readAsArrayBuffer(file);
    });

    // После загрузки всех файлов запускаем распределение
    setTimeout(() => {
        distributeDuties(assignments);
    }, 1000);
}

// Функция для распределения дежурств
function distributeDuties(assignments) {
    let dutySchedule = [];
    let days = 7; // Количество дней для распределения

    for (let day = 1; day <= days; day++) {
        let dailyAssignment = {
            day: "День " + day,
            "Дежурный по части": getRandomPerson(assignments["Дежурный по части"]),
            "Помощник дежурного по части": getRandomPerson(assignments["Помощник дежурного по части"]),
            "Наряд в столовую": getRandomPerson(assignments["Наряд в столовую"]),
            "Наряд по КПП": getRandomPerson(assignments["Наряд по КПП"])
        };
        dutySchedule.push(dailyAssignment);
    }

    displaySchedule(dutySchedule);
}

// Случайный выбор дежурного из списка
function getRandomPerson(people) {
    return people[Math.floor(Math.random() * people.length)].Имя;
}

// Отображение расписания дежурств в таблице
function displaySchedule(schedule) {
    let tableBody = document.querySelector("#dutyTable tbody");
    tableBody.innerHTML = ""; // Очищаем таблицу перед отображением

    schedule.forEach(dayAssignment => {
        let row = document.createElement("tr");

        for (let key in dayAssignment) {
            let cell = document.createElement("td");
            cell.textContent = dayAssignment[key];
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    });
}
