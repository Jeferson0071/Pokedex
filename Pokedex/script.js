let offset = 0;
const limit = 4;                  // altera a quantidade pokemons.
const maxRecords = 150;  
const urlBase = `https://pokeapi.co/api/v2/pokemon`;

const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

// Função que converte os detalhes do Pokémon em um HTML li
function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemons ${pokemon.mainType}">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map(typeInfo => `<li class="type ${typeInfo}">${typeInfo}</li>`).join('')}
        </ol>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.number}.svg" alt="${pokemon.name}" />
      </div>
    </li>
  `;
}

// Função que converte os dados da PokeAPI para um objeto de Pokémon personalizado
function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = {
    name: pokeDetail.name,
    number: pokeDetail.id,
    types: pokeDetail.types.map((typeSlot) => typeSlot.type.name), 
    mainType: pokeDetail.types[0].type.name
  };

  return pokemon;
}

// Função para carregar Pokémons da API
function loadPokemons(offset, limit, clearList = false) {
  const url = `${urlBase}?offset=${offset}&limit=${limit}`;

  fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => {
      const pokemonDetailsPromises = pokemons.map((pokemon) =>
        fetch(pokemon.url)
          .then((response) => response.json())
          .then((pokeDetail) => convertPokeApiDetailToPokemon(pokeDetail))
      );

      return Promise.all(pokemonDetailsPromises);
    })
    .then((pokemonDetails) => {
      if (clearList) {
        pokemonList.innerHTML = '';  // Não faz o Pokemon duplicar do HTML (OL)
      }
      pokemonDetails.forEach((pokemon) => {
        const pokemonHTML = convertPokemonToLi(pokemon);
        pokemonList.innerHTML += pokemonHTML; 
      });
    })
    .catch((error) => console.error(error));
}

// Função para gerenciar o botão "Ler Mais"
loadMoreButton.addEventListener('click', () => {
  if (offset + limit < maxRecords) {
    offset += limit;  
    loadPokemons(offset, limit);
  }
  if (offset + limit >= maxRecords) {
    loadMoreButton.style.display = 'none';
  }
});

// Carrega os primeiros Pokémons ao carregar a página
loadPokemons(offset, limit, true);  
