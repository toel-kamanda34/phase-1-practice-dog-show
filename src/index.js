
document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
    let currentDogId = null;

    // Fetching and displaying initial dog list
    fetchDogs();

    // Handling form submission
    dogForm.addEventListener('submit', handleFormSubmit);

    function fetchDogs() {
        fetch('http://localhost:3000/dogs')
            .then(response => response.json())
            .then(dogs => {
                tableBody.innerHTML = '';
                dogs.forEach(dog => {
                    const row = createDogRow(dog);
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching dogs:', error));
    }

    function createDogRow(dog) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="padding center">${dog.name}</td>
            <td class="padding center">${dog.breed}</td>
            <td class="padding center">${dog.sex}</td>
            <td class="padding center">
                <button class="edit-btn" data-id="${dog.id}">Edit</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => editDog(dog));
        return row;
    }

    function editDog(dog) {
        currentDogId = dog.id;
        dogForm.name.value = dog.name;
        dogForm.breed.value = dog.breed;
        dogForm.sex.value = dog.sex;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const name = dogForm.name.value;
        const breed = dogForm.breed.value;
        const sex = dogForm.sex.value;

        const method = currentDogId ? 'PATCH' : 'POST';
        const url = currentDogId 
            ? `http://localhost:3000/dogs/${currentDogId}` 
            : 'http://localhost:3000/dogs';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, breed, sex }),
        })
            .then(response => response.json())
            .then(() => {
                fetchDogs();
                dogForm.reset();
                currentDogId = null;
            })
            .catch(error => console.error('Error updating dog:', error));
    }
});