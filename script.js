// Parse test
const fs = require('fs');

// Read the XML file content
fs.readFile('DSAC_Static.xml', 'utf8', (err, xmlContent) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return;
    }
  
    const assets = parseXML(xmlContent);
    console.log(JSON.stringify(assets, null, 2));
  });

function parseXML(xml) {
  const assets = [];

  const assetRegex = /<ASSET assetName="(.*?)">(.*?)<\/ASSET>/gs;
  const subsystemRegex = /<SUBSYSTEM(?:.*?)subsystemName="(.*?)">(.*?)<\/SUBSYSTEM>/gs;
  const icRegex = /<IC type="(.*?)" key="(.*?)" value="(.*?)"><\/IC>/g;

  let assetMatch;
  while ((assetMatch = assetRegex.exec(xml))) {
    const assetName = assetMatch[1];
    const assetContent = assetMatch[2];

    const subsystems = [];
    let subsystemMatch;
    while ((subsystemMatch = subsystemRegex.exec(assetContent))) {
      const subsystemType = subsystemMatch[1];
      const subsystemContent = subsystemMatch[2];

      const ics = [];
      let icMatch;
      while ((icMatch = icRegex.exec(subsystemContent))) {
        const icType = icMatch[1];
        const icKey = icMatch[2];
        const icValue = icMatch[3];
        ics.push({ type: icType, key: icKey, value: icValue });
      }

      subsystems.push({ type: subsystemType, ics });
    }

    assets.push({ assetName, subsystems });
  }

  return assets;
}

const parsedData = parseXML(xmlString);
console.log(JSON.stringify(parsedData, null, 2)); // Print the parsed data as a JSON



// Second tester
async function fetchAndDisplayXMLTable() {
    document.body.innerHTML.concat("Hello there")
    try {

        const response = await fetch('DSAC_Static.xml'); 
        const xmlText = await response.text();
        const parser = new DOMParser(); // change parser
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const xmlTable = document.getElementById('xml-table');
        const tableBody = document.createElement('tbody');

        const rows = xmlDoc.querySelectorAll('Row');
        rows.forEach(rowElement => {
            const row = document.createElement('tr');
            const cells = rowElement.querySelectorAll('Cell');

            cells.forEach(cellElement => {
                const cell = document.createElement('td');
                const cellType = cellElement.querySelector('Data').getAttribute('ss:Type');
                const cellValue = cellElement.querySelector('Data').textContent;

                if (cellType === 'Number') {
                    cell.textContent = parseFloat(cellValue).toFixed(2); // Formatting numeric value
                } else {
                    cell.textContent = cellValue;
                }

                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });

        xmlTable.appendChild(tableBody);
    } catch (error) {
        console.error('Error fetching or parsing XML:', error);
    }
}

window.onload = fetchAndDisplayXMLTable();

fetchAndDisplayXMLTable();


// For subsystems
const subsystems = [];

function displaySubsystems() {
    const subsystemGrid = document.getElementById("subsystemGrid");
    subsystemGrid.innerHTML = "";

    subsystems.forEach(subsystem => {
        const subsystemElement = document.createElement("div");
        subsystemElement.textContent = subsystem.name;
        subsystemElement.classList.add("subsystem");
        subsystemElement.addEventListener("click", () => displayProperties(subsystem));
        subsystemGrid.appendChild(subsystemElement);
    });
}

function displayProperties(subsystem) {
    const propertyGrid = document.getElementById("propertyGrid");
    propertyGrid.innerHTML = "";

    const attributesLabel = document.createElement("h3");
    attributesLabel.textContent = "Attributes:";
    propertyGrid.appendChild(attributesLabel);

    subsystem.attributes.forEach(attribute => {
        const attributeLabel = document.createElement("label");
        attributeLabel.textContent = `${attribute.name}: `;
        const attributeInput = document.createElement("input");
        attributeInput.value = attribute.value;
        attributeInput.addEventListener("input", () => attribute.value = attributeInput.value);
        propertyGrid.appendChild(attributeLabel);
        propertyGrid.appendChild(attributeInput);
        propertyGrid.appendChild(document.createElement("br"));
    });

    const statesLabel = document.createElement("h3");
    statesLabel.textContent = "States:";
    propertyGrid.appendChild(statesLabel);

    subsystem.states.forEach(state => {
        const stateLabel = document.createElement("label");
        stateLabel.textContent = `${state.name}: `;
        const stateInput = document.createElement("input");
        stateInput.value = state.value;
        stateInput.addEventListener("input", () => state.value = stateInput.value);
        propertyGrid.appendChild(stateLabel);
        propertyGrid.appendChild(stateInput);
        propertyGrid.appendChild(document.createElement("br"));
    });
}

function saveChanges() {
    // Save the changes to a backend server or file
    console.log("Changes saved:", subsystems);
}

function addSubsystem() {
    const newSubsystem = {
        name: "New Subsystem",
        attributes: [],
        states: []
    };
    subsystems.push(newSubsystem);
    displaySubsystems();
}

// Mock data for demonstration purposes
subsystems.push({
    name: "Subsystem 1",
    attributes: [
        { name: "Attribute 1", value: "Value 1" },
        { name: "Attribute 2", value: "Value 2" }
    ],
    states: [
        { name: "State 1", value: "Active" },
        { name: "State 2", value: "Inactive" }
    ]
});

subsystems.push({
    name: "Subsystem 2",
    attributes: [
        { name: "Attribute A", value: "Value A" },
        { name: "Attribute B", value: "Value B" }
    ],
    states: [
        { name: "State X", value: "On" },
        { name: "State Y", value: "Off" }
    ]
});

displaySubsystems();

document.getElementById("saveButton").addEventListener("click", saveChanges);
document.getElementById("addSubsystemButton").addEventListener("click", addSubsystem);