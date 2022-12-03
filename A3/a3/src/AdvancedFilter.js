import React from "react";

const AdvancedFilter = ({
    pokemons,
    pokemonTypes,
    selectedTypes,
    setSelectedTypes,
    setCurrentPage,
    setFilteredPokemon
}) => {
    const handleCheckBox = (e) => {
        var localSelectedTypes = selectedTypes;
        if (selectedTypes.includes(e.target.value)) {
            localSelectedTypes.splice(localSelectedTypes.indexOf(e.target.value), 1)
            setSelectedTypes(localSelectedTypes)
        } else {
            localSelectedTypes = [...selectedTypes, e.target.value]
            setSelectedTypes(localSelectedTypes)
        }
        setFilteredPokemon(pokemons.filter((pokemon) => localSelectedTypes.every((type) => pokemon.type.includes(type))))
        setCurrentPage(1)
    };

    const handleNameSearch = (e) => {
        if (document.getElementById("english").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.english.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        else if (document.getElementById("japanese").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.japanese.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        else if (document.getElementById("chinese").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.chinese.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        else if (document.getElementById("french").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.french.toLowerCase().includes(e.target.value.toLowerCase())))
        } else {
            // default english search   
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.english.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        setCurrentPage(1)

    }

    const filterHP = (e) => {
        setFilteredPokemon(pokemons.filter((pokemon) => pokemon.base.HP >= e.target.value))
        setCurrentPage(1)
    }

    const filterAttack = (e) => {
        setFilteredPokemon(pokemons.filter((pokemon) => pokemon.base.Attack >= e.target.value))
        setCurrentPage(1)
    }

    const filterDefense = (e) => {
        setFilteredPokemon(pokemons.filter((pokemon) => pokemon.base.Defense >= e.target.value))
        setCurrentPage(1)
    }




    return (
        <div className="advancedFilter">

            <div>
                <h3>Filter by Name</h3>
                <input type="text" placeholder="Search by name" onChange={handleNameSearch} />
                <input type="radio" id="english" name="fav_language" value="english"></input>
                <label for="English">English</label>
                <input type="radio" id="french" name="fav_language" value="french"></input>
                <label for="French">French</label>
                <input type="radio" id="japanese" name="fav_language" value="japanese"></input>
                <label for="Japanese">Japanese</label>
                <input type="radio" id="chinese" name="fav_language" value="chinese"></input>
                <label for="Japanese">Chinese</label>
            </div>
            <hr></hr>

            <div className="pokemon-types">
                <h3>Filter by Type</h3>

                {pokemonTypes.map((pokemonType, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={"pokemon-" + pokemonType}
                            onChange={handleCheckBox}
                            value={pokemonType}
                        />
                        <label htmlFor={"pokemon-" + pokemonType}>{pokemonType}</label>
                    </div>
                ))}
            </div>
            <hr></hr>
            <div>
                <div>
                    <h3>Filter by Stat</h3>
                    <h5>HP</h5>
                    <input type="range" onChange={filterHP} />
                    <h5>Attack</h5 >
                    <input type="range" onChange={filterAttack} />
                    <h5>Defense</h5>
                    <input type="range" onChange={filterDefense} />

                </div>
            </div>
            <hr></hr>

        </div>
    );
}

export default AdvancedFilter;