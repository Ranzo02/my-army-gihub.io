let dutyData = {
    partDuty: [],
    assistantPartDuty: [],
    kppDuty: [],
    messHallDuty: []
};

function readExcel(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        callback(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

function loadFiles() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];
    const file3 = document.getElementById('file3').files[0];
    const file4 = document.getElementById('file4').files[0];

    if (file1 && file2 && file3 && file4) {
        readExcel(file1, (data) => {
            dutyData.partDuty = data;
            readExcel(file2, (data) => {
                dutyData.assistantPartDuty = data;
                readExcel(file3, (data) => {
                    dutyData.kppDuty = data;
                    readExcel(file4, (data) => {
                        dutyData.messHallDuty = data;
                        displayTodayDuty();
                    });
                });
            });
        });
    } else {
        alert('Please upload all four files.');
    }
}

function displayTodayDuty() {
    const output = document.getElementById('output');
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    let html = '<table><tr><th>Duty Type</th><th>Name</th><th>Status</th></tr>';

    // Function to find today's duty
    function findTodayDuty(dutyList) {
        return dutyList.find(person => {
            const dutyDates = person['Дни дежурства'].split(',').map(date => new Date(date.trim()).toISOString().slice(0, 10));
            return dutyDates.includes(today);
        });
    }

    // Retrieve today's duty for each type
    const partDuty = findTodayDuty(dutyData.partDuty);
    const assistantPartDuty = findTodayDuty(dutyData.assistantPartDuty);
    const kppDuty = findTodayDuty(dutyData.kppDuty);
    const messHallDuty = findTodayDuty(dutyData.messHallDuty);

    // Display in a table
    html += `<tr><td>Дежурный по части</td><td>${partDuty?.['Имя и фамилия'] || 'Not assigned'}</td><td>${partDuty?.['Статус'] || 'N/A'}</td></tr>`;
    html += `<tr><td>Помощник дежурного по части</td><td>${assistantPartDuty?.['Имя и фамилия'] || 'Not assigned'}</td><td>${assistantPartDuty?.['Статус'] || 'N/A'}</td></tr>`;
    html += `<tr><td>Дежурный по КПП</td><td>${kppDuty?.['Имя и фамилия'] || 'Not assigned'}</td><td>${kppDuty?.['Статус'] || 'N/A'}</td></tr>`;
    html += `<tr><td>Дежурный по столовой</td><td>${messHallDuty?.['Имя и фамилия'] || 'Not assigned'}</td><td>${messHallDuty?.['Статус'] || 'N/A'}</td></tr>`;

    html += '</table>';
    output.innerHTML = html;
}