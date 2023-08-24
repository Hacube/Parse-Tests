
// For subsystems
const fs = require('fs');
var xml2js = require("xml2js")
var parseString = require('xml2js').parseString;

// Read the XML file
const xmlContent = fs.readFile('DSAC_STATIC.xml', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading XML file:", err);
        return;
    }
    
    parseXmlFile(xmlContent);
});


// Function to parse the XML file content and extract subsystem data
function parseXmlFile(xmlContent) {
    const subsystems = [];

    parseString(xmlContent, (err, result) => {
        if (err) {
            console.error("Error parsing XML:", err);
            return;
        }

        const assetElements = result.MODEL.ASSET;

        for (const assetElement of assetElements) {
            const subsystemElements = assetElement.SUBSYSTEM;
            const subsystemsData = [];

            for (const subsystemElement of subsystemElements) {
                const subsystem = {
                    type: subsystemElement.$.Type,
                    name: subsystemElement.$.subsystemName,
                    attributes: [],
                    states: []
                };

                // Extract attributes and states here as needed
                // Example: Parsing attributes
                if (subsystemElement.IC) {
                    for (const icElement of subsystemElement.IC) {
                        const key = icElement.$.key;
                        const value = icElement.$.value;
                        subsystem.attributes.push({ key, value });
                    }
                }

                // Example: Parsing states
                if (subsystemElement.STATEVAR) {
                    for (const stateVarElement of subsystemElement.STATEVAR) {
                        const key = stateVarElement.$.key;
                        const type = stateVarElement.$.type;
                        // Extract other attributes and values as needed
                        subsystem.states.push({ key, type });
                    }
                }

                subsystemsData.push(subsystem);
            }

            subsystems.push(subsystemsData);
        }

        displaySubsystems(subsystems); // Display the extracted data in the UI
    });
}

function displaySubsystems(subsystemsData) {
    subsystemList.innerHTML = "";

    subsystemsData.forEach(asset => {
        asset.forEach(subsystem => {
            const subsystemItem = document.createElement("li");
            subsystemItem.textContent = `Asset: ${asset[0].name} | Subsystem: ${subsystem.name}`;
            subsystemItem.classList.add("subsystem-item");
            subsystemItem.addEventListener("click", () => displayProperties(subsystem));
            subsystemList.appendChild(subsystemItem);
        });
    });
}

function displayProperties(subsystem) {
    propertyGrid.innerHTML = "";

    subsystem.attributes.forEach(attribute => {
        const propertyItem = document.createElement("div");
        propertyItem.classList.add("property-item");
        const propertyLabel = document.createElement("label");
        propertyLabel.textContent = attribute.key;
        propertyLabel.classList.add("property-label");
        const propertyInput = document.createElement("input");
        propertyInput.value = attribute.value;
        propertyInput.classList.add("property-input");
        propertyItem.appendChild(propertyLabel);
        propertyItem.appendChild(propertyInput);
        propertyGrid.appendChild(propertyItem);
    });

    subsystem.states.forEach(state => {
        const propertyItem = document.createElement("div");
        propertyItem.classList.add("property-item");
        const propertyLabel = document.createElement("label");
        propertyLabel.textContent = state.key;
        propertyLabel.classList.add("property-label");
        const propertyInput = document.createElement("input");
        propertyInput.value = state.type; // Displaying state type for illustration
        propertyInput.classList.add("property-input");
        propertyItem.appendChild(propertyLabel);
        propertyItem.appendChild(propertyInput);
        propertyGrid.appendChild(propertyItem);
    });
}

// Attach event listener to the file input
fileInput.addEventListener("change", event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const xmlContent = e.target.result;
        parseXmlFile(xmlContent);
    };

    reader.readAsText(file);
});