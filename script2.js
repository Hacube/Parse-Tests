const electron = require('electron');
const fs = require('fs');

const { app, BrowserWindow } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Load and parse JSON
  fs.readFile('model.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const subsystems = jsonData.MODEL.ASSET[0].SUBSYSTEM;

      // Display subsystems in the sidebar
      const subsystemList = document.getElementById('subsystemList');
      subsystems.forEach((subsystem) => {
        const subsystemName = subsystem.subsystemName;
        const subsystemItem = document.createElement('li');
        subsystemItem.textContent = subsystemName;
        subsystemList.appendChild(subsystemItem);

        // Handle subsystem click to display properties
        subsystemItem.addEventListener('click', () => {
          displayProperties(subsystem);
        });
      });
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
    }
  });
});

function displayProperties(subsystem) {
  const propertyGrid = document.getElementById('propertyGrid');
  propertyGrid.innerHTML = ''; // Clear existing properties

  const properties = subsystem.IC || [];
  properties.forEach((property) => {
    const key = property.key;
    const value = property.value;
    const input = createInputField(property.type, value);
    const label = document.createElement('label');
    label.textContent = key;

    const propertyDiv = document.createElement('div');
    propertyDiv.className = 'property';
    propertyDiv.appendChild(label);
    propertyDiv.appendChild(input);
    propertyGrid.appendChild(propertyDiv);
  });
}

function createInputField(type, value) {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  return input;
}