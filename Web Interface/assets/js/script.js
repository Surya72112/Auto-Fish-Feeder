import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database';

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQxPkeFuOuCqipfgG4rZEhKZ0RdvWaHcs",
  authDomain: "fish-feeder-77527.firebaseapp.com",
  databaseURL: "https://fish-feeder-77527-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fish-feeder-77527",
  storageBucket: "fish-feeder-77527.firebasestorage.app",
  messagingSenderId: "1055626248750",
  appId: "1:1055626248750:web:093b042fa2c29b8c7c55bf",
  measurementId: "G-318GBZWXFL"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function feedNow() {
    const feedRef = ref(database, 'feedCommand');
    
    set(feedRef, 'FEED_NOW')
        .then(() => {
            console.log('Feed command sent');
            setTimeout(() => set(feedRef, 'IDLE'), 1000);
        })
        .catch(error => console.error('Error:', error));
}

// Listener untuk jadwal
onValue(ref(database, 'schedules'), (snapshot) => {
    const schedules = snapshot.val();
    const scheduleContainer = document.getElementById('schedules');
    scheduleContainer.innerHTML = '';
    
    for(const key in schedules) {
        if(schedules.hasOwnProperty(key)) {
            const schedule = schedules[key];
            const scheduleElement = document.createElement('div');
            scheduleElement.className = 'schedule-item';
            scheduleElement.innerHTML = `
                <p>${schedule.time} - ${schedule.status}</p>
                <button onclick="deleteSchedule('${key}')">Delete</button>
            `;
            scheduleContainer.appendChild(scheduleElement);
        }
    }
});

function deleteSchedule(key) {
    remove(ref(database, `schedules/${key}`));
}

// Clock functionality (tetap sama)
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

function updateClock() {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    
    hours.style.transform = `rotate(${(h * 30) + (m / 2)}deg)`;
    minutes.style.transform = `rotate(${m * 6}deg)`;
    seconds.style.transform = `rotate(${s * 6}deg)`;
}

setInterval(updateClock, 1000);
updateClock();