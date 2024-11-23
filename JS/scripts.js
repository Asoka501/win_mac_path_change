const windowsPathTextarea = document.getElementById("windowsPath");
const macPathTextarea = document.getElementById("macPath");
const errorMessageContainer = document.getElementById("errorMessage");
const historyContainer = document.getElementById("historyContainer");
let pathHistory = [];

function displayError(message) {
    errorMessageContainer.innerHTML = `
        <div class="alert">
            ${message}
            <span class="close-button" onclick="clearError()">×</span>
        </div>`;
}

function clearError() {
    errorMessageContainer.textContent = "";
}

function copyToClipboard(elementId) {
    const textarea = document.getElementById(elementId);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function addToHistory(inputPath, convertedPath) {
    pathHistory.push({ input: inputPath, converted: convertedPath });
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyContainer.innerHTML = "";
    pathHistory.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.input} -> ${item.converted}`;
        listItem.addEventListener("click", function () {
            setInputValue(item.input);
        });
        historyContainer.appendChild(listItem);
    });
}

function setInputValue(value) {
    const activePanel = document.querySelector(".panel.active");
    const inputField = activePanel.querySelector("textarea");
    inputField.value = value;
}

const panels = document.querySelectorAll(".panel");
panels.forEach(function (panel) {
    panel.addEventListener("click", function () {
        panels.forEach(function (p) {
            p.classList.remove("active");
        });
        panel.classList.add("active");
    });
});

function convertToMac() {
    const windowsPath = windowsPathTextarea.value;
    if (!windowsPath) {
        displayError("Please enter a Windows path!");
        return;
    }
    clearError();
    const macPath = windowsPath.replace(/\\\\cpfs10\\/g, "/Volumes/").replace(/\\/g, "/");
    macPathTextarea.value = macPath;
    addToHistory(windowsPath, macPath);
}

function convertToWindows() {
    const macPath = macPathTextarea.value;
    if (!macPath) {
        displayError("Please enter a Mac path!");
        return;
    }
    clearError();
    const windowsPath = macPath.replace(/\/Volumes/g, "\\\\cpfs10").replace(/\//g, "\\");
    windowsPathTextarea.value = windowsPath;
    addToHistory(macPath, windowsPath);
}

function clearInput(windowsPathId, macPathId) {
    windowsPathTextarea.value = "";
    macPathTextarea.value = "";
}

function convertToSMB() {
    const smbPathTextarea = document.getElementById("smbPath");
    const smbPath = smbPathTextarea.value;
    if (!smbPath) {
        displayError("Please enter an SMB path!");
        return;
    }
    clearError();
    const convertedPath = smbPath.replace(/\\\\cpfs10\\/g, "smb://cpfs10.path/").replace(/\\/g, "/");
    smbPathTextarea.value = convertedPath;
    addToHistory(smbPath, convertedPath);
}

function copyCustomPath() {
    const customPathTextarea = document.getElementById("tsudaPath");
    if (!customPathTextarea.value) {
        displayError("Please enter a custom path!");
        return;
    }
    copyToClipboard("tsudaPath");
    displayError("Copied!");
}
