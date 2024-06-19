const travelForm = document.getElementById('travelForm');
const entriesContainer = document.getElementById('entriesContainer');

let entries = JSON.parse(localStorage.getItem('travelEntries')) || [];
let editingIndex = -1;

const countrySelect = document.getElementById('countrySelect');

const request = new XMLHttpRequest();
request.open('GET', 'https://restcountries.com/v3.1/all', true);
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        const countries = JSON.parse(request.responseText);
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.text = country.name.common;
            countrySelect.add(option);
        });
    } else {
        console.error('Ошибка при загрузке списка стран');
    }
};
request.onerror = function () {
    console.error('Ошибка сети при загрузке списка стран');
};
request.send();

function showEntries() {
    entriesContainer.innerHTML = '';
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry'); 
        entryDiv.innerHTML = `
            <h3>Запись #${i + 1} - ${entry.country} (${entry.date})</h3>
            <p>${entry.message}</p>
            <button onclick="editEntry(${i})">Редактировать</button>
            <button onclick="removeEntry(${i})">Удалить</button> 
        `;
        entriesContainer.appendChild(entryDiv);
    }
}

function saveEntry(event) {
    event.preventDefault();

    const country = countrySelect.value;
    const date = document.getElementById('travelDate').value;
    const message = document.getElementById('travelText').value;

    if (editingIndex === -1) {
        entries.push({ country, date, message });
    } else {
        entries[editingIndex] = { country, date, message };
        editingIndex = -1; 
    }

    localStorage.setItem('travelEntries', JSON.stringify(entries));
    showEntries();
    travelForm.reset();
}

function editEntry(index) {
    const entry = entries[index];
    countrySelect.value = entry.country;
    document.getElementById('travelDate').value = entry.date;
    document.getElementById('travelText').value = entry.message;
    editingIndex = index;
}

function removeEntry(index) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        const newEntries = [];
        for (let i = 0; i < entries.length; i++) {
            if (i !== index) {
                newEntries.push(entries[i]);
            }
        }
        entries = newEntries; 

        localStorage.setItem('travelEntries', JSON.stringify(entries));
        showEntries();
    }
}

travelForm.addEventListener('submit', saveEntry);
showEntries(); 
