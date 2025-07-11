async function loadDinoData() {
    try {
        const response = await fetch('./dino.json');
        if (!response.ok) {
            throw new Error(response.status);
        }
        const data = await response.json();
        return data.Dinos;
    } catch (error) {
        console.error(error);
    }
}

function createTile(name, imagePath, fact) {
    const tile = document.createElement('div');
    tile.classList.add('grid-item');
    
    const title = document.createElement('h3');
    title.textContent = name;

    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = name;
    
    const description = document.createElement('p');
    description.textContent = fact;
    
    tile.appendChild(title);
    tile.appendChild(img);
    tile.appendChild(description);
    
    return tile;
}

async function init() {
    const dinoData = await loadDinoData();
    // Create Dino Constructor
    function Dino(species, weight, height, diet, where, when, fact) {
        this.species = species;
        this.weight = weight;
        this.height = height;
        this.diet = diet;
        this.where = where;
        this.when = when;
        this.fact = fact;
    }

    // Create Dino Objects
    const dinoObjects = [];
    dinoData.forEach(dino => {
        const {species, weight, height, diet, where, when, fact} = dino;
        const dinoObj = new Dino(species, weight, height, diet, where, when, fact);
        dinoObjects.push(dinoObj);
    })


    // Create Human Object
    const human = {};

    // Use IIFE to get human data from form
    (function getHumanData() {
        const form = document.getElementById('dino-compare');
        const formData = new FormData(form);
        human.name = formData.get('name');
        human.height = parseInt(formData.get('feet')) * 12 + parseInt(formData.get('inches'));
        human.weight = parseInt(formData.get('weight'));
        human.diet = formData.get('diet');
    })();


    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
    Dino.prototype.compareWeight = function() {
        const diff = this.weight - human.weight;
        if (diff > 0) {
            return `${this.species} weighs ${diff} lbs more than ${human.name}.`;
        } else if (diff < 0) {
            return `${this.species} weighs ${Math.abs(diff)} lbs less than ${human.name}.`;
        } else {
        return `${this.species} weighs the same as ${human.name}.`;
        }
    }
    
    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
    Dino.prototype.compareHeight = function() {
        const diff = this.height - human.height;
        if (diff > 0) {
            return `${this.species} is ${diff} inches taller than ${human.name}.`;
        } else if (diff < 0) {
            return `${this.species} is ${Math.abs(diff)} inches shorter than ${human.name}.`;
        } else {
            return `${this.species} is the same height as ${human.name}.`;
        }
    }

    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
    Dino.prototype.compareDiet = function() {
        if (this.diet.toLowerCase() === human.diet.toLowerCase()) {
            return `${this.species} has the same diet as ${human.name}.`;
        } else {
            return `${this.species} has a different diet than ${human.name}.`;
        }
    }


    // Generate Tiles for each Dino in Array
    const fragment = document.createDocumentFragment();
    
    // Get three random numbers
    const randomIndices = [];
    while (randomIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * dinoObjects.length );
        if (!randomIndices.includes(randomIndex) || !dinoObjects[randomIndex].species.toLowerCase() === 'pigeon') {
            randomIndices.push(randomIndex);
        }
    }
    // Assign three random dino different facts
    const randomFacts = {
        [randomIndices[0]]: dinoObjects[randomIndices[0]].compareWeight(),
        [randomIndices[1]]: dinoObjects[randomIndices[1]].compareHeight(),
        [randomIndices[2]]: dinoObjects[randomIndices[2]].compareDiet()
    };
    
    // Create tiles elements for each dino
    const tiles = dinoObjects.map((dino, index) => {
        return createTile(
            dino.species,
            `./images/${dino.species.toLowerCase()}.png`,
            randomFacts[index] ?? dino.fact
        );
    });

    // Add human tile
    tiles.splice(4, 0, createTile(human.name, './images/human.png', ''));
        
    // Add tiles to DOM
    tiles.forEach(tile => fragment.appendChild(tile));
    document.getElementById('grid').appendChild(fragment);

    // Remove form from screen
    document.getElementById('dino-compare').style.display = 'none';
}

// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', async () => {
    await init();
});