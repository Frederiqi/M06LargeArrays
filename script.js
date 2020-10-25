const toevoegenAanResultatenlijst = li =>
    document.getElementById("resultatenLijst").appendChild(li);

const wisResultatenlijst = () =>
    (document.getElementById("resultatenLijst").innerHTML = "");

const wisButtonlijst = () =>
    (document.querySelector(".landen_buttons").innerHTML = "");

const toevoegenAanButtonlijst = button =>
    document.querySelector(".landen_buttons").appendChild(button);

//Hiermee verdwijnt bij klik op elke btn de vorige resultatenlijst en (landen)buttonlijst:

document.querySelectorAll("nav input").forEach(input =>
    input.addEventListener("click", () => {
        wisResultatenlijst();
        wisButtonlijst();
    })
);

const uniekeWaarden = (items, item) => {
    if (!Array.isArray(items)) items = [];
    if (!items.includes(item)) items.push(item);
    return items;
};

// deel A: Landenlijst
const alleLanden = personData =>
    personData
        .map(person => person.region)
        .reduce(uniekeWaarden)
        .sort();

const genereerLandenHTML = land => {
    const li = document.createElement("li");
    li.innerHTML = land;
    return li;
};

const toonLanden = () =>
    alleLanden(randomPersonData)
        .map(genereerLandenHTML)
        .forEach(toevoegenAanResultatenlijst);

const landenLijstButton = document.getElementById("buttonLandenLijst");

landenLijstButton.addEventListener("click", toonLanden);

// deel B: steenbokvrouwen
const isVrouw = person => person.gender === "female";

const isOuderdan30 = person => person.age > 30;

//alfabetische volgorde lukt niet voor namen in chinees schrift en zo...
const alfabetischVoornaam = randomPersonData.sort((a, b) => {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
});

const bepaalSteenbokvrouwen = personData =>
    personData
        .filter(isVrouw)
        .filter(isOuderdan30)
        .sort();

const genereerSteenbokvrouwenHTML = ({
    name,
    surname,
    photo,
    age,
    birthday,
}) => {
    const naamSpan = document.createElement("span");
    naamSpan.innerHTML = `${name} ${surname} `;

    const fotoSpan = document.createElement("span");
    fotoSpan.innerHTML = `<img src="${photo}"></img>`;

    const leeftijdSpan = document.createElement("span");
    leeftijdSpan.innerHTML = `, leeftijd: ${age}, `;

    const geboortedatumSpan = document.createElement("span");
    geboortedatumSpan.innerHTML = `geboortedatum: ${birthday.dmy}`;

    const li = document.createElement("li");
    li.appendChild(naamSpan);
    li.appendChild(fotoSpan);
    li.appendChild(leeftijdSpan);
    li.appendChild(geboortedatumSpan);

    return li;
};

const toonSteenbokvrouwen = () => {
    bepaalSteenbokvrouwen(randomPersonData)
        .map(genereerSteenbokvrouwenHTML)
        .forEach(toevoegenAanResultatenlijst);
};

const SteenbokvrouwenButton = document.getElementById("buttonSteenbokVrouwen");

SteenbokvrouwenButton.addEventListener("click", toonSteenbokvrouwen);

// deel C: oude creditcards
const isVolwassen = person => person.age > 18;

const selecteerJaarVerloopdatum = person => person.credit_card.expiration.includes("21");

//het onderstaande sorteert wel, maar voor correcte volgorde maanden is nog een extra bewerking nodig...
const sorteerVerloopdatum = randomPersonData.sort((a, b) => {
    var datumA = a.credit_card.expiration;
    var datumB = b.credit_card.expiration;
    if (datumA < datumB) {
        return -1;
    }
    if (datumA > datumB) {
        return 1;
    }
});

const bepaalOudeCreditcards = personData =>
    personData
        .filter(isVolwassen)
        .filter(selecteerJaarVerloopdatum)
        .sort();

const genereerOudeCreditcardsHTML = ({
    name,
    surname,
    phone,
    credit_card,
}) => {
    const naamSpan = document.createElement("span");
    naamSpan.innerHTML = `${name} ${surname}, `;

    const telefoonSpan = document.createElement("span");
    telefoonSpan.innerHTML = `${phone}, `;

    const creditcardnrSpan = document.createElement("span");
    creditcardnrSpan.innerHTML = `${credit_card.number}, `;

    const verloopdatumSpan = document.createElement("span");
    verloopdatumSpan.innerHTML = `${credit_card.expiration}`;

    const li = document.createElement("li");
    li.appendChild(naamSpan);
    li.appendChild(telefoonSpan);
    li.appendChild(creditcardnrSpan);
    li.appendChild(verloopdatumSpan);

    return li;
};

const toonOudeCreditcards = () => {
    bepaalOudeCreditcards(randomPersonData)
        .map(genereerOudeCreditcardsHTML)
        .forEach(toevoegenAanResultatenlijst);
};

const oudeCreditcardsButton = document.getElementById("buttonOudeCreditcards");

oudeCreditcardsButton.addEventListener("click", toonOudeCreditcards);

// deel E: meeste mensen per land
const bepaalMeesteMensen = personData => {
    let alleLanden = {};
    personData.forEach(({ region }) => {
        if (region in alleLanden) {
            alleLanden[region]++
        } else {
            alleLanden[region] = 1
        }
    });
    alleLanden = Object.entries(alleLanden);
    alleLanden = alleLanden.map(land => ({
        land: land[0],
        inwoners: land[1],
    }));
    return alleLanden
};

const genereerMeesteMensenHTML = ({ land, inwoners }) => {
    const li = document.createElement("li");
    li.innerHTML = `${land}: ${inwoners}`;
    return li;
};

const toonMeesteMensen = () => {
    bepaalMeesteMensen(randomPersonData)
        .map(genereerMeesteMensenHTML)
        .forEach(toevoegenAanResultatenlijst);
};

const meesteMensenButton = document.getElementById("buttonMeesteMensen");

meesteMensenButton.addEventListener("click", toonMeesteMensen);

// Deel E: gemiddelde leeftijd per land via landenbuttons

const emptyButtonList = () =>
    (document.querySelector(".sub_buttons").innerHTML = "");

const addToButtonList = button =>
    document.querySelector(".sub_buttons").appendChild(button);

const bepaalGemLeeftijd = land => {
    const inwonersPerLand = randomPersonData.filter(
        person => person.region === land
    );

    const aantalPersonen = inwonersPerLand.length;

    if (aantalPersonen === 0) {
        return 0;
    }

    const totaalLeeftijd = inwonersPerLand.reduce(
        (sum, current) => sum + current.age,
        0
    );

    return Math.round(totaalLeeftijd / aantalPersonen);
};

const toonGemLeeftijdLand = () => {
    wisResultatenlijst();
    const land = event.target.value;
    const gemiddeldeLeeftijd = bepaalGemLeeftijd(land);
    const li = document.createElement("li");
    li.innerHTML = `De gemiddelde leeftijd in ${land} is ${gemiddeldeLeeftijd}.`;
    toevoegenAanResultatenlijst(li);
};

const maakLandenButtonsHTML = land => {
    const button = document.createElement("input");
    button.type = "button";
    button.value = land;
    button.addEventListener("click", toonGemLeeftijdLand);
    return button;
};

const toonGemLeeftijdButtons = () =>
    alleLanden(randomPersonData)
        .map(maakLandenButtonsHTML)
        .forEach(toevoegenAanButtonlijst);

const gemLeeftijdButton = document.getElementById("buttonGemLeeftijd");

gemLeeftijdButton.addEventListener("click", toonGemLeeftijdButtons);

// deel F: matchmaking....

const isMan = person => person.gender === "male";

const bepaalLeukeMannen = personData =>
    personData
        .filter(isMan)
        .sort();

const genereerLeukeMannenHTML = ({
    name,
    surname,
    photo,
    age,
    birthday,
}) => {
    const naamSpan = document.createElement("span");
    naamSpan.innerHTML = `${name} ${surname} `;

    const fotoSpan = document.createElement("span");
    fotoSpan.innerHTML = `<img src="${photo}"></img>`;

    const leeftijdSpan = document.createElement("span");
    leeftijdSpan.innerHTML = `, leeftijd: ${age}, `;

    const geboortedatumSpan = document.createElement("span");
    geboortedatumSpan.innerHTML = `geboortedatum: ${birthday.dmy}`;

    const li = document.createElement("li");
    li.appendChild(naamSpan);
    li.appendChild(fotoSpan);
    li.appendChild(leeftijdSpan);
    li.appendChild(geboortedatumSpan);

    return li;
};

const toonLeukeMannen = () => {
    bepaalLeukeMannen(randomPersonData)
        .map(genereerLeukeMannenHTML)
        .forEach(toevoegenAanResultatenlijst);
};

const leukeMannenButton = document.getElementById("buttonMatchMaking");

leukeMannenButton.addEventListener("click", toonLeukeMannen);


/* het onderstaande geeft wel een Array, maar daar kon ik eerst niks mee...:
const landenNamen = randomPersonData.reduce((alleLanden, persoon) => {
    if (persoon.region in alleLanden) {
        alleLanden[persoon.region]++
    } else {
        alleLanden[persoon.region] = 1
    }
    return alleLanden
}, {});
console.log(landenNamen);
document.getElementById("resultatenlijst").innerHTML = landenNamen;



/* Het onderstaande geeft een lijst van alle landen per persoon (inclusief dubbele):
landenLijstButton.addEventListener("click", function () {
    let resultatenLijst = document.getElementById("resultatenLijst");
    while (resultatenLijst.firstChild) {
        resultatenLijst.removeChild(resultatenLijst.firstChild);
    };
    const landenNamen = randomPersonData.map((persoon) => {
        return persoon.region
    });
    landenNamen.forEach(persoon => {
        const li = document.createElement("li");
        const liContent = document.createTextNode(
            `${persoon.region}`
        );
        li.appendChild(liContent);
        resultatenLijst.append(li);
    });
});
*/


