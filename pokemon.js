let pokemonTypes = [];

let typeBackground = {
    insecte: "#A7B723",
    tenebres: "#75574C",
    dragon: "#7037FF",
    electrik: "#F9CF30",
    fee: "#E69EAC",
    combat: "#C12239",
    feu: "#F57D31",
    vol: "#A891EC",
    spectre: "#70559B",
    normal: "#AAA67F",
    plante: "#74CB48",
    sol: "#DEC16B",
    glace: "#9AD6DF",
    poison: "#A43E9E",
    psy: "#FB5584",
    roche: "#B69E31",
    acier: "#B7B9D0",
    eau: "#6493EB"
}

async function recupererTypesPokemon() {
    let reponse = await fetch("https://tyradex.vercel.app/api/v1/types");
    pokemonTypes = await reponse.json();
}

async function rechercher(){
    let detailContainer = document.querySelector("#detailContainer");
    let searchContainer = document.querySelector("#searchContainer");
    
    let reponse = await fetch("https://pokebuildapi.fr/api/v1/pokemon/"+document.rechercherFormulaire.nomPokemon.value);
    const pokemon = await reponse.json();

    reponse = await fetch("https://tyradex.vercel.app/api/v1/pokemon/"+pokemon.pokedexId);
    const pokemonComplement = await reponse.json();
    
    afficheImagesPokemon(pokemon,pokemonComplement);

    await afficheImageEvolutionPrecedente(pokemonComplement);

    afficheStatistiques(pokemonComplement);

    afficheResistances(pokemonComplement);

    changeCouleurFond(pokemonComplement);

    searchContainer.style.display = "none";
    detailContainer.style.display = "block";
    
}

function afficheImagesPokemon(pokemon, pokemonComplement) {
    let regularImage = document.querySelector("#regularImage");
    regularImage.src = pokemonComplement.sprites.regular;

    let shinyImage = document.querySelector("#shinyImage");
    shinyImage.src = pokemonComplement.sprites.shiny;

    let nomPokemon = document.querySelectorAll(".nomPokemon");

    for (numeroLigne = 0; numeroLigne<nomPokemon.length; numeroLigne++) {
        nomPokemon[numeroLigne].textContent = pokemon.name;
    }
}

async function afficheImageEvolutionPrecedente(pokemonComplement) {
    let evolutionImage = document.querySelector("#pre-evolution");
    let noevolution = document.querySelector("#noevolution");

    if (pokemonComplement.evolution.pre !== null) {
        let idEvolutionPrecedente=pokemonComplement.evolution.pre[0].pokedex_id;
        const reponse = await fetch("https://tyradex.vercel.app/api/v1/pokemon/"+idEvolutionPrecedente);
        const pokemonEvolution = await reponse.json();
        evolutionImage.src = pokemonEvolution.sprites.regular;
        evolutionImage.style.display = "block";
        noevolution.style.display = "none";
    } else {
        evolutionImage.style.display = "none";
        noevolution.style.display = "block";

    }
}

function afficheStatistiques(pokemonComplement) {
    let weight = document.querySelector("#weight");
    weight.textContent = pokemonComplement.weight;
    
    let height = document.querySelector("#height");
    height.textContent = pokemonComplement.height;

    let man = document.querySelector("#man");
    man.textContent = pokemonComplement.sexe.male;

    let women = document.querySelector("#women");
    women.textContent = pokemonComplement.sexe.female;
    
    

    let atk = document.querySelector("#atk");
    atk.value = pokemonComplement.stats.atk;

    let hp = document.querySelector("#hp");
    hp.value = pokemonComplement.stats.hp;
    
    let def = document.querySelector("#def");
    def.value = pokemonComplement.stats.def;
    
    let spe_atk = document.querySelector("#spe_atk");
    spe_atk.value = pokemonComplement.stats.spe_atk;
     
    let spe_def = document.querySelector("#spe_def");
    spe_def.value = pokemonComplement.stats.spe_def;
     
    let vit = document.querySelector("#vit");
    vit.value = pokemonComplement.stats.vit;
}

function afficheResistances(pokemonComplement) {
    let resistances=pokemonComplement.resistances;
    for (numeroLigne = 0; numeroLigne<resistances.length; numeroLigne++) {
        let resistance = resistances[numeroLigne];
        createPokemonType(resistance);
    }
}

function createPokemonType(resistance) {

    if (resistance.multiplier!==1){
        let typeResistance;
        if (resistance.multiplier<1) {
            typeResistance = "#pointsForts";
        } else if (resistance.multiplier>1) {
            typeResistance = "#pointsFaibles";
        }

        let image = document.createElement("img");
        image.src=getImageType(resistance.name);
        image.alt=resistance.name;
        image.title=resistance.name;
           
        let resistanceBloc = document.querySelector(typeResistance);
        resistanceBloc.append(image);
    }
}

function getImageType(typeName) {
    let type = pokemonTypes.find((element) => {
        return element.name.fr === typeName
    });
    return type.sprites;
}

function changeCouleurFond(pokemonComplement) {
    let type = pokemonComplement.types[0].name.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase();
    let color = typeBackground[type];
    document.body.style.backgroundColor = color;
}
