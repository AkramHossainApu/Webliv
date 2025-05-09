const wrapper = document.querySelector(".wrapper"),
  qrInput = wrapper.querySelector(".form input"),
  generateBtn = wrapper.querySelector(".form button"),
  qrImg = wrapper.querySelector(".qr-code img"),
  downloadDiv = wrapper.querySelector(".download-button"),
  downloadLink = document.getElementById("downloadLink");

let preValue, qrURL;

generateBtn.addEventListener("click", () => {
  let qrValue = qrInput.value.trim();
  if (!qrValue || preValue === qrValue) return;
  preValue = qrValue;
  generateBtn.innerText = "Generating QR Code...";
  qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;
  qrImg.src = qrURL;
  qrImg.addEventListener("load", () => {
    wrapper.classList.add("active");
    generateBtn.innerText = "Generate QR Code";
    downloadDiv.style.display = "block";

    // Attach download click handler
    downloadLink.onclick = async function (e) {
      e.preventDefault();
      try {
        const response = await fetch(qrURL);
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = objectURL;
        const filename = `${qrValue.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectURL);
      } catch (err) {
        alert("Failed to download QR code.");
      }
    };
  });
});

qrInput.addEventListener("keyup", () => {
  if (!qrInput.value.trim()) {
    wrapper.classList.remove("active");
    preValue = "";
    downloadDiv.style.display = "none";
  }
});
