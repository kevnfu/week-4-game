class Character {
    constructor(name, hp, ap, cap, img) {
        this.name = name;
        this.hp = hp;
        this.ap = ap;
        this.cap = cap;
        this.img = img;
    }

    // takes a character class and returns jquery object representation
    constructSheet() {
        return $('<div>')
            .addClass("character")
            .append(`<div>${this.name}</div>`)
            .append(`<img src="${this.img}">`)
            .append(`<div>${this.hp}</div>`);
    }
    
}

let characters, inFight, characterSheets, myCharIndex, defenderIndex, enemies, totalAttacks, gameover;

function restart() {
    inFight = false;
    gameover = false;
    characterSheets = [];
    myCharIndex = -1;
    defenderIndex = -1;
    enemies = [];
    totalAttacks = 1;
    
    characters = [
        new Character("Obi-wan Kenobi", 120, 6, 5, "https://nerdist.com/wp-content/uploads/2017/12/download.jpg"),
        new Character("Luke Skywalker", 100, 7, 7, "https://i2-prod.mirror.co.uk/incoming/article9603913.ece/ALTERNATES/s1200/PROD-Luke-Skywalker-in-Star-Wars-film.jpg"),
        new Character("Darth Sidious", 150, 5, 30, "https://cdn.jwplayer.com/thumbs/iko5Bilc-720.jpg"),
        new Character("Darth Maul", 180, 10, 20, "https://lumiere-a.akamaihd.net/v1/images/Darth-Maul_632eb5af.jpeg?region=75%2C42%2C1525%2C858&width=768")
    ];
}

// render functions
function renderChoices() {
    $("#selection").show();
    characters.forEach(function(c, i) {
    $("#selection").append(c
        .constructSheet()
        .data("i", i));
    });
}

function renderMyCharacter() {
    if(myCharIndex < 0) return;
    $("#my-character").empty()
        .append(characters[myCharIndex].constructSheet());
}

function renderEnemies() {
    $("#enemies").empty();
    enemies.forEach(function(i) {
        $("#enemies").append(characters[i]
            .constructSheet()
            .data("i", i)
            .addClass("enemy"));
    });
}

function renderDefender() {
    $("#defender").empty();
    if(!inFight) return;

    $("#defender").append(characters[defenderIndex]
        .constructSheet()
        .addClass("defender"));
}

restart();

// CHOOSE CHARACTER
// create a character sheet, an html element, for each character
renderChoices();

// click chooses character
$("#selection").on("click", ".character", function() {
    myCharIndex = $(this).data("i");
    $("#selection").hide();
    renderMyCharacter();

    // add enemies
    characters.forEach(function(c, i) {
        if(i === myCharIndex) return; // enemy cannot be own character
        enemies.push(i);
    });
    renderEnemies();
});

// CHOOSE ENEMY
$("#enemies").on("click", ".character", function() {
    if(inFight || gameover) return;
    defenderIndex = $(this).data("i");
    enemies = enemies.filter(x => x !== defenderIndex); // remove from enemy list
    inFight = true;
    renderEnemies();
    renderDefender();
});


// FIGHT
$("#attack-btn").click(function() {
    if(!inFight || gameover) return;
    let me = characters[myCharIndex];
    let defender = characters[defenderIndex];

    // Each time the player attacks, their character's Attack Power increases by its base Attack Power.
    let myDamage = me.ap * totalAttacks;
    totalAttacks++;

    // The enemy character only has Counter Attack Power.
    let defenderDamage = defender.cap;

    defender.hp -= myDamage;
    me.hp -= defenderDamage;

    $("#message").empty().append(`You attacked ${defender.name} for ${myDamage} damage. <br>
        ${defender.name} attacked you back for ${defenderDamage} damage. <br>`)

    renderDefender();
    renderMyCharacter();

    if(me.hp <= 0) {
        $("#message").empty().append("You have been defeated...GAME OVER");
        gameOver();
        return;
    }

    if(defender.hp <= 0) {
        $("#defender").empty();
        if(enemies.length == 0) {
            $("#message").empty().append("You won! GAME OVER!");
            gameOver();
            return;
        }
        $("#message").append(`You have defeated ${defender.name}. you can choose to fight another enemy.`);
        inFight = false;
        return;
    }
});

function gameOver() {
    gameover = true;
    $("#restart-btn").show();
}


$("#restart-btn").click(function() {
    $("#selection, #my-character, #enemies, #defender, #message").empty();
    $("#restart-btn").hide();
    restart();
    renderChoices();
});