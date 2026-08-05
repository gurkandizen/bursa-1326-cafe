// TELEFON MASKESİ — yardımcı fonksiyon
function stripNonDigits(value) {
    // \D = "rakam olmayan her karakter", /g = "hepsini bul"
    return value.replace(/\D/g, "");
}

function formatPhoneNumber(value) {
    const digits = stripNonDigits(value).slice(0, 11); // en fazla 11 hane

    const part1 = digits.slice(0, 4);   // 05XX
    const part2 = digits.slice(4, 7);   // XXX
    const part3 = digits.slice(7, 9);   // XX
    const part4 = digits.slice(9, 11);  // XX

    // Henüz yazılmamış (boş) parçaları at, kalanları boşlukla birleştir
    return [part1, part2, part3, part4]
        .filter(part => part.length > 0)
        .join(" ");
}

// DATE NESNESİ — yardımcı fonksiyon
function padTwo(number) {
    return String(number).padStart(2, "0");
}

function getDateString(date) {
    // "YYYY-MM-DD" biçimi
    const year = date.getFullYear();
    const month = padTwo(date.getMonth() + 1); // getMonth() 0'dan başlar, +1 şart
    const day = padTwo(date.getDate());
    return `${year}-${month}-${day}`;
}

function getTimeString(date) {
    // "HH:MM" biçimi — <input type="time"> min/max için gerekli
    const hours = padTwo(date.getHours());
    const minutes = padTwo(date.getMinutes());
    return `${hours}:${minutes}`;
}

function parseDateInputValue(value) {
    // "YYYY-MM-DD" metnini GÜVENLİ şekilde Date'e çevirir.
    // new Date("2026-08-12") RİSKLİDİR (UTC kayması yapabilir).
    // Bu yüzden parçalayıp yerel saatle (yıl, ay-1, gün) oluşturuyoruz.
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function isWeekend(date) {
    const day = date.getDay(); // 0 = Pazar, 6 = Cumartesi
    return day === 0 || day === 6;
}

// ÇALIŞMA SAATLERİ
const WORKING_HOURS = {
    weekday: { min: "08:00", max: "23:00" },
    weekend: { min: "09:00", max: "23:59" }
};

function updateTimeConstraints() {
    const dateInput = document.getElementById("res-date");
    const timeInput = document.getElementById("res-time");

    if (!dateInput || !timeInput || !dateInput.value) return;

    const selectedDate = parseDateInputValue(dateInput.value);
    const hours = isWeekend(selectedDate) ? WORKING_HOURS.weekend : WORKING_HOURS.weekday;

    let minTime = hours.min;
    const maxTime = hours.max;

    // Seçilen tarih BUGÜN ise, geçmiş saatler seçilemesin
    const now = new Date();
    const isToday = dateInput.value === getDateString(now);

    if (isToday) {
        const nowTimeString = getTimeString(now);
        if (nowTimeString > minTime) {
            minTime = nowTimeString; // ikisinden büyük olanı kullan
        }
    }

    timeInput.min = minTime;
    timeInput.max = maxTime;
}

// validateField
function validateField(input) {
    const fieldContainer = input.closest(".form-field");
    if (!fieldContainer) return input.checkValidity();

    const errorSpan = fieldContainer.querySelector(".field-error");

    const isValid = input.checkValidity();
    const validity = input.validity;

    if (isValid) {
        fieldContainer.classList.remove("is-invalid");
        fieldContainer.classList.add("is-valid");

        if (errorSpan) {
            errorSpan.textContent = "";
        }
    } else {
        fieldContainer.classList.remove("is-valid");
        fieldContainer.classList.add("is-invalid");

        if (errorSpan) {
            let errorMessage = "Geçersiz Değer.";

            if (validity.valueMissing) {
                errorMessage = "Bu alanın doldurulması zorunludur.";
            } else if (validity.typeMismatch) {
                if (input.type === "email") {
                    errorMessage = "Lütfen geçerli bir e-posta adresi giriniz (ör: ad@domain.com).";
                } else if (input.type === "url") {
                    errorMessage = "Lütfen geçerli bir web adresi giriniz.";
                }
            } else if (validity.patternMismatch && input.id === "res-phone") {
                errorMessage = "Telefon numarası 05XX XXX XX XX biçiminde olmalıdır.";
            } else if (validity.tooShort) {
                errorMessage = `Lütfen en az ${input.minLength} karakter giriniz.`;
            } else if (validity.rangeUnderflow) {
                errorMessage = `Lütfen en az ${input.min} değerini seçiniz.`;
            } else if (validity.rangeOverflow) {
                errorMessage = `Lütfen en fazla ${input.max} değerini seçiniz.`;
            }

            errorSpan.textContent = errorMessage;
        }
    }

    return isValid;
}

// updateSummaryAmount
function updateSummaryAmount() {
    const guestsSelect = document.querySelector("#res-guests");
    const totalAmount = document.getElementById("summary-amount");

    if (!guestsSelect || !totalAmount) return;

    const guestsCountText = guestsSelect.value;

    if (!guestsCountText) {
        totalAmount.textContent = "- ₺";
        return;
    }

    const count = Number(guestsCountText);
    const total = count * 50;

    totalAmount.textContent = `${total} ₺`;
}

// initReservation
export function initReservation() {
    const reservationForm = document.querySelector(".reservation-form");
    const feedBack = document.getElementById("reservation-feedback");
    const dateInput = document.getElementById("res-date");

    if (!reservationForm) return;

    // YENİ: sayfa açılır açılmaz, geçmiş tarihlerin seçilmesini engelle
    if (dateInput) {
        dateInput.min = getDateString(new Date());
    }

    reservationForm.addEventListener("input", (event) => {
        // YENİ: telefon alanıysa, önce maskele, SONRA doğrula
        if (event.target.id === "res-phone") {
            event.target.value = formatPhoneNumber(event.target.value);
        }

        validateField(event.target);
    });

    reservationForm.addEventListener("change", (event) => {
        // YENİ: tarih değiştiyse, saat sınırlarını (çalışma saatleri + bugün kontrolü) güncelle
        if (event.target.id === "res-date") {
            updateTimeConstraints();

            const timeInput = document.getElementById("res-time");
            if (timeInput && timeInput.value) {
                validateField(timeInput); // yeni sınırlara göre saati tekrar kontrol et
            }
        }

        validateField(event.target);

        if (event.target.id === "res-guests") {
            updateSummaryAmount();
        }
    });

    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const requiredInputs = reservationForm.querySelectorAll("[required]");

        let isFormValid = true;
        let firstInvalidInput = null;

        requiredInputs.forEach((input) => {
            const isValid = validateField(input);

            if (!isValid) {
                isFormValid = false;

                // Kullanıcıyı odaklamak için SADECE İLK geçersiz alanı hafızada tut
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            }
        });

        // 4. Form Geçerlilik Sonucuna Göre Bildirim Yönetimi
        if (isFormValid) {
            // 🟢 BAŞARILI DURUM:
            feedBack.removeAttribute("hidden");
            feedBack.classList.remove("is-error");
            feedBack.classList.add("is-success");
            feedBack.textContent = "Rezervasyon talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.";

            updateSummaryAmount();
        } else {
            // 🔴 GEÇERSİZ DURUM:
            feedBack.removeAttribute("hidden");
            feedBack.classList.remove("is-success");
            feedBack.classList.add("is-error");
            feedBack.textContent = "Lütfen formdaki kırmızı renkli zorunlu alanları eksiksiz ve doğru şekilde doldurunuz.";

            // UX Odaklaması: İlk hatalı alana ekranı ve imleci kaydır
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }
        }
    });
}