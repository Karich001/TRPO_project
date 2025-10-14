const characters = [
    { id: 1, name: "Спринтер", color: "#FF6B6B", speed: 8 },
    { id: 2, name: "Марафонец", color: "#4ECDC4", speed: 6 },
    { id: 3, name: "Чювак", color: "#FE6B6B", speed: 80 }
];
let raceInProgress = false;
const container = document.getElementById('container');
const buttonInv = document.getElementById('ButtonInv');
const buttonStart = document.getElementById('ButtonStart');
const buttonReset = document.getElementById('ButtonReset');
let isMenuOpened = false;

buttonInv.addEventListener('click', function()
{
    isMenuOpened = true;
    if(isMenuOpened) buttonInv.disabled = true;
    const newDiv = document.createElement('div');
    newDiv.classList.add('inventoryMenu');
    newDiv.id = 'menuDiv';
    document.body.appendChild(newDiv);

    for(let i = 0; i < characters.length; i++)
    {
        const newMDiv = document.createElement('div');
        newMDiv.classList.add('characterInMenu');
        newMDiv.id = `char${i}`;
        newDiv.appendChild(newMDiv);
        newMDiv.textContent = characters[i].name + " СКОРОЧТЬ!!: " + characters[i].speed;

        const addButton = document.createElement('button');
        addButton.textContent = 'Добавить';
        addButton.classList.add('addButton');
        newMDiv.appendChild(addButton);
        addButton.id = `addButton${i}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('deleteButton');
        newMDiv.appendChild(deleteButton);
        deleteButton.id = `deleteButton${i}`;

        addButton.addEventListener('click', function()
        {
            if(!document.getElementById(`track${i}`))
            {
                const newDiv = document.createElement('div');
                newDiv.classList.add('track');
                newDiv.id = `track${i}`;
                newDiv.dataset.characterId = i;
                newDiv.dataset.speed = characters[i].speed;
                newDiv.dataset.position = "0";
                container.appendChild(newDiv);

                const newDiv2 = document.createElement('div');
                newDiv2.classList.add('charOnTrack');
                newDiv2.id = `char${i}`;
                newDiv2.style.backgroundColor = characters[i].color;
                newDiv.appendChild(newDiv2);

                const newP = document.createElement('p');
                newP.classList.add('charTextOnTrack');
                newP.id = `charText${i}`;
                newP.textContent = characters[i].name + " (" + characters[i].speed + ")";
                newDiv.appendChild(newP);
            }
        })

        deleteButton.addEventListener('click', function()
        {
            if(document.getElementById(`track${i}`))
            {
                const track = document.getElementById(`track${i}`);
                if (track && track.parentNode) {
                    track.parentNode.removeChild(track);
        }
            }
        })
    }

    const generateButton = document.createElement('button');
    generateButton.textContent = 'Сгенерировать';
    generateButton.classList.add('generateButton');
    newDiv.appendChild(generateButton);
    generateButton.id = 'generateButton'

    const exitButton = document.createElement('button');
    exitButton.textContent = 'X';
    exitButton.classList.add('exitButton');
    newDiv.appendChild(exitButton);
    exitButton.id = 'exitButton'

    exitButton.addEventListener('click', function()
    {
        const menuDiv = document.getElementById('menuDiv');
        menuDiv.removeChild(exitButton);
        document.body.removeChild(menuDiv);
        isMenuOpened = false;
        buttonInv.disabled = false;
    })
})

buttonReset.addEventListener('click', function()
{
    raceInProgress = false;
    buttonStart.disabled = false;
    buttonInv.disabled = false;

    const tracks = container.getElementsByClassName('track');
    for (let track of tracks) {
        track.dataset.position = "0";
        track.style.transform = 'translateX(0px)';
    }
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Результаты: </h2>';
})

buttonStart.addEventListener('click', function()
{
    if (raceInProgress) {
        return;
    }
    
    const tracks = container.getElementsByClassName('track');
    if (tracks.length === 0) {
        alert("Добавьте хотя бы одного персонажа на трек!");
        return;
    }
    
    raceInProgress = true;
    buttonStart.disabled = true;
    buttonInv.disabled = true;
    
    const finishLine = container.offsetWidth - 400;
    let animationId;
    
    function moveTracks() {
        if (!raceInProgress) {
            cancelAnimationFrame(animationId);
            return;
        }
        
        let allFinished = true;
        let maxPosition = 0;
        let winnerTrack = null;
    
        for (let track of tracks) {
            let currentPosition = parseInt(track.dataset.position);
            let speed = parseInt(track.dataset.speed);
            
            if (currentPosition < finishLine) {
                currentPosition += speed;
                track.dataset.position = currentPosition.toString();
                track.style.transform = `translateX(${currentPosition}px)`;
                allFinished = false;
            }
            
            if (currentPosition > maxPosition) {
                maxPosition = currentPosition;
                winnerTrack = track;
            }
        }
        
        if (allFinished) {
            raceInProgress = false;
            buttonStart.disabled = false;
            buttonInv.disabled = false;
            
            if (winnerTrack) {
                const winnerId = parseInt(winnerTrack.dataset.characterId);
                const winnerCharacter = characters[winnerId];
                
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = `<h3>🏁 Победитель: ${winnerCharacter.name}!</h3>
                                       <p>Скорость: ${winnerCharacter.speed}</p>
                                       <p>Цвет: <span style="color:${winnerCharacter.color}">${winnerCharacter.color}</span></p>`;
                
                console.log(`Победитель: ${winnerCharacter.name}`);
            }
        } else {
            animationId = requestAnimationFrame(moveTracks);
        }
    }
    
    moveTracks();
})





