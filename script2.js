const subSystems = [];

document.getElementById('openSubsystem').addEventListener('click', openSubsystem);

class SubSystem {
    constructor(name) {
        this.subsystemName = name;
    }
}

function openSubsystem() {
    fetch("DSAC_Static.xml")
        .then(response => response.text())
        .then(xmlContent => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

            const sub = new SubSystem('Test');

            const subsystemName = xmlDoc.querySelector("ASSET > SUBSYSTEM").getAttribute("subsystemName");
            sub.subsystemName = subsystemName;

            subSystems.push(sub);

            const subSystemList = document.getElementById("subSystemList");
            subSystemList.innerHTML += `<button type="button" class="list-group-item list-group-action" id="${sub.subsystemName}">${sub.subsystemName}</button>`;

            document.querySelectorAll('.list-group-item').forEach(item => {
                item.addEventListener('click', () => displaySubsystemDetails(sub.subsystemName));
            });
        })
        .catch(error => {
            console.error("Error fetching XML:", error);
        });
}

function displaySubsystemDetails(subsystemName) {
    const detailsElement = document.getElementById("subsystemDetails");
    const sub = subSystems.find(sub => sub.subsystemName === subsystemName);

    detailsElement.textContent = JSON.stringify(sub, null, 2);
}