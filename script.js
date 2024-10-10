document.getElementById('processFiles').addEventListener('click', function () {
    const files = [
        document.getElementById('fileInput1').files[0],
        document.getElementById('fileInput2').files[0],
        document.getElementById('fileInput3').files[0],
        document.getElementById('fileInput4').files[0],
    ];

    Promise.all(files.map(file => readExcelFile(file)))
        .then(dataArrays => {
            const results = processDuties(dataArrays);
            displayResults(results);
        })
        .catch(error => {
            console.error('Error reading files:', error);
        });
});

function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null); // если файл не выбран

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            resolve(json);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function processDuties(dataArrays) {
    const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    const duties = {
        'Дежурный по части': null,
        'Помощник дежурного по части': null,
        'Дежурный по КПП': null,
        'Дежурный по столовой': null,
    };

    dataArrays.forEach((data, index) => {
        if (data) {
            data.forEach(row => {
                const name = row[0]; // Имя
                const position = row[1]; // Должность
                const status = row[3]; // Статус
                const dutyDays = row[4]; // Дни дежурства
                
                if (status === 'Доступен' && dutyDays.includes(today)) {
                    switch (index) {
                        case 0:
                            duties['Дежурный по части'] = name;
                            break;
                        case 1:
                            duties['Помощник дежурного по части'] = name;
                            break;
                        case 2:
                            duties['Дежурный по КПП'] = name;
                            break;
                        case 3:
                            duties['Дежурный по столовой'] = name;
                            break;
                    }
                }
            });
        }
    });

    return duties;
}

function displayResults(duties) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<h2>Дежурные на сегодня:</h2>';
    for (const [key, value] of Object.entries(duties)) {
        outputDiv.innerHTML += `<p>${key}: ${value || 'Нет дежурного'}</p>`;
    }
}
