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
        // 🔴 GEÇERSİZ DURUM
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

// Kişi sayısına göre kişi başı tutarı güncelleyen yardımcı fonksiyon
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

export function initReservation() {
    const reservationForm = document.querySelector(".reservation-form");
    const feedBack = document.getElementById("reservation-feedback");

    if (!reservationForm) return;

    reservationForm.addEventListener("input", (event) => {
        validateField(event.target);
    });

    reservationForm.addEventListener("change", (event) => {
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