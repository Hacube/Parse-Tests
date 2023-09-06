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
    // save the changes to a backend server or file
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

// Load XML data and populate subsystems array
fetch("DSAC_Static.xml")
    .then(response => response.text())
    .then(xmlContent => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

        const assetElements = xmlDoc.getElementsByTagName("ASSET");

        for (const assetElement of assetElements) {
            const subsystem = {
                name: assetElement.getAttribute("assetName"),
                attributes: [],
                states: []
            };

            const subsystemElements = assetElement.getElementsByTagName("SUBSYSTEM");
            for (const subsystemElement of subsystemElements) {
                const subsystemType = subsystemElement.getAttribute("Type");
                const subsystemName = subsystemElement.getAttribute("subsystemName");
                
                // extract other attributes here
                
                subsystem.attributes.push({ name: "Type", value: subsystemType });
                subsystem.attributes.push({ name: "subsystemName", value: subsystemName });
            }

            subsystems.push(subsystem);
        }

        displaySubsystems();
    })
    .catch(error => {
        console.error("Error fetching XML:", error);
    });

document.getElementById("saveButton").addEventListener("click", saveChanges);
document.getElementById("addSubsystemButton").addEventListener("click", addSubsystem);