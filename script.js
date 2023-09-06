// For subsystems
const fs = require("fs");
const xml2js = require("xml2js");
const parseString = require('xml2js').parseString;

const subSystems = [];

document.getElementById('openSubsystem').addEventListener('click', openSubsystem);

class SubSystem {
    constructor(name) {
        this.subsystemName = name;
    }
}

function openSubsystem() {
    const xmlFile = fs.readFileSync("DSAC_Static.xml", 'utf8');
    const sub = new SubSystem('Test');

    parseString(xmlFile, function (err, result) {
        console.dir(result.MODEL.ASSET[0].SUBSYSTEM[1]);
        sub.subsystemName = result.MODEL.ASSET[0].SUBSYSTEM[1].$.subsystemName;
    });

    subSystems.push(sub);

    const subSystemList = document.getElementById("subSystemList");
    subSystemList.innerHTML += `<button type="button" class="list-group-item list-group-action" id="${sub.subsystemName}">${sub.subsystemName}</button>`;

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', () => displaySubsystemDetails(sub.subsystemName));
    });
}

function displaySubsystemDetails(subsystemName) {
    const detailsElement = document.getElementById("subsystemDetails");
    const sub = subSystems.find(sub => sub.subsystemName === subsystemName);

    detailsElement.textContent = JSON.stringify(sub, null, 2);
}