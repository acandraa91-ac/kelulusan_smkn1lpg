document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. COUNTDOWN LOGIC
    // ==========================================
    const countdownSection = document.getElementById('countdownSection');
    const formSection = document.getElementById('formSection');
    
    if (countdownSection) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        let timerInterval;

        function updateCountdown() {
            // Ambil target waktu dari config.js
            const targetTime = new Date(CONFIG.TARGET_WAKTU).getTime();
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance <= 0) {
                clearInterval(timerInterval);
                countdownSection.classList.add('hidden');
                formSection.classList.remove('hidden');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
    }

    // ==========================================
    // 2. NISN CHECKING LOGIC
    // ==========================================
    const checkForm = document.getElementById('checkForm');
    const resultSection = document.getElementById('resultSection');
    const btnBack = document.getElementById('btnBack');

    if (checkForm) {
        checkForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nisnInput = document.getElementById('nisn').value.trim();
            const errorAlert = document.getElementById('errorAlert');
            errorAlert.classList.add('hidden');

            const btnSubmit = checkForm.querySelector('button[type="submit"]');
            const originalBtnText = btnSubmit.textContent;
            btnSubmit.textContent = "Mencari data...";
            btnSubmit.disabled = true;

            try {
                // Fetch data dari file data.json langsung (untuk GitHub Pages)
                const response = await fetch('data.json');
                
                if (!response.ok) {
                    throw new Error("Gagal mengambil data dari server.");
                }
                
                const studentsData = await response.json();
                
                // Cari data berdasarkan NISN
                const student = studentsData.find(s => s.nisn === nisnInput || s.NISN === nisnInput);

                if (!student) {
                    errorAlert.textContent = "NISN tidak ditemukan. Silakan periksa kembali.";
                    errorAlert.classList.remove('hidden');
                } else {
                    // Tampilkan hasil
                    formSection.classList.add('hidden');
                    resultSection.classList.remove('hidden');

                    document.getElementById('resName').textContent = student.nama || student.Nama || student.name || "Nama Tidak Diketahui";
                    document.getElementById('resNisn').textContent = student.nisn || student.NISN || nisnInput;

                    const statusEl = document.getElementById('resStatus');
                    const rawStatus = (student.status || student.Status || "LULUS").toUpperCase();
                    
                    statusEl.textContent = rawStatus;
                    statusEl.className = "status-badge"; 
                    if (rawStatus === "LULUS") {
                        statusEl.classList.add("status-lulus");
                    } else {
                        statusEl.classList.add("status-gagal");
                    }
                }
            } catch (err) {
                errorAlert.textContent = "Error: " + err.message + " (Jika Anda membuka file ini secara lokal (file:///), fitur pencarian tidak akan berjalan karena aturan CORS browser. Jalankan di localhost atau GitHub Pages!)";
                errorAlert.classList.remove('hidden');
            } finally {
                btnSubmit.textContent = originalBtnText;
                btnSubmit.disabled = false;
            }
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            resultSection.classList.add('hidden');
            formSection.classList.remove('hidden');
            document.getElementById('nisn').value = '';
            document.getElementById('nisn').focus();
        });
    }
});
