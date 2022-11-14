/*
Some stuff to add.
- Styling in general. (at the very least a prison background, maybe an animation of bars closing.)
- Add a remaining turn counter.
- Clean this in general and fix most of this into classes and objects.
- Possibly add more death quotes and prevent the same from coming up twice, or maybe even do the tetris piece rotation type randomization where it 
  goes through all of them before repeats can show up.
  
*/




let roundNumber = 0;    /* Increase this at the start of every round. */

let playerRoundNumber = 0;
let playerVetoNum = []; // An array of size player num holding each players remaining vetos.
// For vetos instead of turns. After the prisoner is selected just ask if anyone would like to veto and give a yes or no prompt.


let beforeLastRound; /* This will be set to "the number of inmates" - "the number of inmates on death row." */

let randomArray = [];

let finalArray = [];
let selectedInmates = [];
const settingSubmit = document.querySelector('#subButton');

const settings = document.querySelectorAll('.settings');


let numPlayers;
let numInmates;
let deathRow;
let numVetos;

let veto;

let deathArray = [
    " drowned...",
    " was shot down by firing squad.",
    " was lethally injected.",
    " was used as a crash test dummy.",
    " was beheaded by guilotine.",
    " couldn't grasp the true form of Giygas' attack!",
    " was fatally shocked by the electric chair.",
    " was killed in the prison riot.",
    " died of old age.",
    " died of dysentary."
]

const gridDisplay = document.querySelector('.grid');
const nameDisplay = document.querySelector('.name');
const gameDisplay = document.querySelector('.gameLabel');
const vetoDisplay = document.querySelector('.veto')


const gameRoundLabel = document.createElement('h1');
const playerTurnLabel = document.createElement('h2');


function setupGame()
{
    numPlayers = document.getElementById('playerEnter').value;
    numInmates = document.getElementById('inmateEnter').value;
    deathRow = document.getElementById('rowEnter').value;
    numVetos = document.getElementById('vetoEnter').value;

    settings.forEach((setting) =>
    {
        setting.classList.add('remove');
    }
    )

    settingSubmit.removeEventListener('click', setupGame);
    setupPrison();
}


settingSubmit.addEventListener('click', setupGame);

function setupPrison()
{
    for (let i = 0; i < numInmates; i++)
    {
        const prisoner = document.createElement('input');
        prisoner.type = 'text';
        prisoner.setAttribute('placeholder', 'Prisoner ' + (i + 1));
        prisoner.id = "pID" + i;
        prisoner.classList.add('prison-label');
        prisoner.setAttribute('data-id', i);
        prisoner.classList.add('game');
        prisoner.classList.add()

        //If you want to change the size of anything later on add a class or id that can be changed by the CSS.
        const prisonerImg = document.createElement('img');
        prisonerImg.type = 'image';
        prisonerImg.setAttribute('src', 'images/prisoner.jpg')
        prisonerImg.setAttribute('data-id', i);
        prisonerImg.setAttribute('votes', 0);
        prisonerImg.id = "pImg" + i;
        prisonerImg.addEventListener('click', setupImg)

        prisonerImg.classList.add('prison-label');


        const prisonerFile = document.createElement('input');
        prisonerFile.type = 'file';
        prisonerFile.style.display = 'none';
        prisonerFile.accept = 'image/*';
        prisonerFile.setAttribute('data-id', i);
        prisonerFile.id = "pFile" + i;
        prisonerFile.addEventListener('change', (getImage) =>
        {
            let file = prisonerFile.files[0];
            let num = prisonerFile.getAttribute('data-id');

            let reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = (setImage) =>
            {
                let image = document.getElementById("pImg" + num);
                image.setAttribute('src', reader.result);
            }
        }
        );

        gridDisplay.appendChild(prisonerImg);
        gridDisplay.appendChild(prisoner);
        gridDisplay.appendChild(prisonerFile);

    }

    const start = document.createElement('img');
    start.setAttribute('src', 'images/Start.png');
    start.addEventListener('click', startGame);
    start.classList.add('prison-label');

    gridDisplay.appendChild(start);
}

function startGame()
{

    for (let i = 0; i < numInmates; i++)
    {
        let prisoner = document.getElementById('pID' + i);
        let prisonerName = document.createElement('p');
        prisonerName.classList.add('prison-label');
        prisonerName.setAttribute('data-id', i);
        prisonerName.id = "pName" + i;
        prisonerName.textContent = (prisoner.value);
        nameDisplay.appendChild(prisonerName);
    }

    const prisonerSettings = document.querySelectorAll('.prison-label');


    prisonerSettings.forEach((setting) =>
    {
        setting.classList.remove('prison-label');
        setting.classList.add('remove');
    }
    )

    beforeLastRound = numInmates - deathRow;

    for (let i = 0; i < numPlayers; i++)
    {
        playerVetoNum.push(numVetos);
    }

    for (let i = 0; i < numInmates; i++)
    {
        randomArray.push(i);
    }

    roundNumber = 0;
    playerRoundNumber = 0;

    startRound();

}

function startRound()
{
    roundNumber++;
    playerRoundNumber++;

    if (playerRoundNumber > numPlayers)
    {
        playerRoundNumber = 1;
    }

    veto = false;

    gameRoundLabel.textContent = ("Round " + roundNumber);
    playerTurnLabel.textContent = ("Player " + playerRoundNumber + " it is your turn. Select a prisoner to be executed.");

    gameDisplay.appendChild(gameRoundLabel);
    gameDisplay.appendChild(playerTurnLabel);

    if (roundNumber == beforeLastRound)
    {
        playerRoundNumber = 1;
        startFinalRound();
        return;
    }

    randomArray.sort(() => 0.5 - Math.random());

    selectedInmates.length = 0;
    let inmatePic;

    for (let i = 0; i < deathRow; i++)
    {
        selectedInmates.push(document.getElementById('pID' + randomArray[i]));

        let num = selectedInmates[i].getAttribute('data-id');
        inmatePic = document.getElementById('pImg' + num);
        inmatePic.style.order = i;
        inmatePic.classList.remove('remove');
        inmatePic.classList.add('prison-label');

        inmatePic.removeEventListener('click', setupImg)

        inmatePic.addEventListener('click', selectInmate)

        let prisonerName = document.getElementById('pName' + num);
        prisonerName.style.order = i;
        prisonerName.classList.remove('remove');
        prisonerName.classList.add('prison-label');
    }


    function selectInmate(x)
    {
        let num = this.getAttribute('data-id');

        if (veto)
        {
            veto = false;

            for (let i = 0; i < deathRow - 1; i++)
            {
                let image = document.getElementById('pImg' + selectedInmates[i].getAttribute('data-id'));
                image.removeEventListener('click', selectInmate);
            }

            killPrisoner(num);
            return;
        }


        let name = document.getElementById('pID' + num).value;
        playerTurnLabel.textContent = (name + " has been selected. Does anyone wish to veto?")

        for (let i = 0; i < deathRow; i++)
        {
            let image = document.getElementById('pImg' + selectedInmates[i].getAttribute('data-id'));
            image.removeEventListener('click', selectInmate);
        }

        let playerList = [];

        for (let i = 0; i < numPlayers; i++)
        {
            playerList.push(i + 1);
        }

        let playerSelect = document.createElement("select");


        let noVetos = numPlayers;

        for (let i = 0; i < playerList.length; i++)
        {

            if (playerVetoNum[i] != 0)
            {
                let option = document.createElement("option");
                option.value = playerList[i];
                option.text = playerList[i];
                playerSelect.appendChild(option);
            }
            else
            {
                noVetos--;
            }

            if (noVetos == 0)
            {
                playerSelect.remove();
                killPrisoner(num);
                return;
            }
        }

        let yesVeto = document.createElement('img');
        let noVeto = document.createElement('img');

        yesVeto.src = 'images/Yes.png';
        noVeto.src = 'images/No.png';

        yesVeto.classList.add('veto')
        noVeto.classList.add('veto')

        yesVeto.addEventListener('click', (myFunc) =>
        {
            let vetoNum = playerSelect.value;
            playerVetoNum[vetoNum - 1] -= 1;
            yesVeto.remove();
            noVeto.remove();
            playerSelect.remove();
            handleVeto(true, num);
        }
        )



        noVeto.addEventListener('click', (myFunc) =>
        {
            yesVeto.remove();
            noVeto.remove();
            playerSelect.remove();
            killPrisoner(num);
        }
        )

        vetoDisplay.appendChild(playerSelect);
        vetoDisplay.appendChild(yesVeto);
        vetoDisplay.appendChild(noVeto);

    }

    function handleVeto(isVeto, num)
    {
        let prisoner = document.getElementById('pImg' + num);
        veto = true;

        for (let i = 0; i < deathRow - 1; i++)
        {
            if (prisoner.getAttribute('data-id') == selectedInmates[i].getAttribute('data-id'))
            {

                let pName = document.getElementById('pName' + prisoner.getAttribute('data-id'));

                prisoner.classList.remove('prison-label');
                prisoner.classList.add('remove');
                pName.classList.remove('prison-label');
                pName.classList.add('remove');
                selectedInmates.splice(i, 1);
                playerTurnLabel.textContent = ("Player " + playerRoundNumber + "; " + pName.textContent + " has been vetoed. Select another prisoner to be executed.");
            }
            let image = document.getElementById('pImg' + selectedInmates[i].getAttribute('data-id'));
            image.addEventListener('click', selectInmate)
        }
    }

    function killPrisoner(num)
    {
        let prisoner = document.getElementById('pImg' + num);

        for (let i = 0; i < selectedInmates.length; i++)
        {
            if (prisoner.getAttribute('data-id') == selectedInmates[i].getAttribute('data-id'))
            {
                prisoner.removeEventListener('click', selectInmate);
                prisoner.addEventListener('click', executed);
                prisoner.style.filter = "grayscale(100%)";
                deathArray.sort(() => 0.5 - Math.random());
                let name = document.getElementById('pName' + num);
                playerTurnLabel.textContent = (name.textContent + deathArray[0]);
            }
            else
            {
                let pName = document.getElementById('pName' + selectedInmates[i].getAttribute('data-id'));
                let image = document.getElementById('pImg' + selectedInmates[i].getAttribute('data-id'));
                image.classList.remove('prison-label');
                image.classList.add('remove');
                pName.classList.remove('prison-label');
                pName.classList.add('remove');
            }
        }
    }

    function startFinalRound()
    {
        gameRoundLabel.textContent = ("Final Round");
        playerTurnLabel.textContent = ("Player " + playerRoundNumber + " cast your vote for who shall be set free.");

        randomArray.sort(() => 0.5 - Math.random());

        selectedInmates = [];
        let inmatePic;

        for (let i = 0; i < deathRow; i++)
        {
            selectedInmates.push(document.getElementById('pID' + randomArray[i]));

            num = selectedInmates[i].getAttribute('data-id');
            inmatePic = document.getElementById('pImg' + num);
            inmatePic.style.order = i;
            inmatePic.classList.remove('remove');
            inmatePic.classList.add('prison-label');

            inmatePic.removeEventListener('click', setupImg)

            inmatePic.addEventListener('click', voteInmate)

            let prisonerName = document.getElementById('pName' + num);
            prisonerName.style.order = i;
            prisonerName.classList.remove('remove');
            prisonerName.classList.add('prison-label');
        }
    }

    function voteInmate()
    {
        playerRoundNumber++;
        let num = this.getAttribute('votes');
        num = parseInt(num);
        num++;
        this.setAttribute('votes', num)

        if (playerRoundNumber > numPlayers)
        {
            declareWinner();
        }
        else
        {
            playerTurnLabel.textContent = ("Player " + playerRoundNumber + " cast your vote for who shall be set free.");
        }
    }

    function declareWinner()
    {
        let tally = [];

        for (let i = 0; i < deathRow; i++)
        {
            let image = document.getElementById('pImg' + selectedInmates[i].getAttribute('data-id'));
            let vote = parseInt(image.getAttribute('votes'));
            tally.push(vote);
        }

        let largest = 0;
        let winnerNum;

        let winnerArray = [];

        for (let i = 0; i < deathRow; i++)
        {

            if (tally[i] >= largest)
            {

                largest = tally[i];
                winnerArray.push(i);
            }
        }

        winnerNum = winnerArray[Math.floor(Math.random() * winnerArray.length)];

        let winnerNumString = selectedInmates[winnerNum].getAttribute('data-id');

        winnerNumString = parseInt(winnerNumString);

        let winnerImg = document.getElementById('pImg' + winnerNumString);
        let winnerName = document.getElementById('pName' + winnerNumString);

        for (let i = 0; i < selectedInmates.length; i++)
        {
            let image = document.getElementById('pImg' + selectedInmates[i].getAttribute('data-id'));

            if (winnerImg.getAttribute('data-id') == image.getAttribute('data-id')) 
            {
                winnerImg.removeEventListener('click', voteInmate);
                playerTurnLabel.textContent = (winnerName.textContent + " has been released, the rest have been killed. Congrats to " + winnerName.textContent + " and all of their fans.");
            }
            else
            {
                let pName = document.getElementById('pName' + selectedInmates[i].getAttribute('data-id'));
                image = document.getElementById('pImg' + selectedInmates[i].getAttribute('data-id'));
                image.classList.remove('prison-label');
                image.classList.add('remove');
                pName.classList.remove('prison-label');
                pName.classList.add('remove');
            }
        }
    }

}




function setupImg(x)
{
    prisonerFile = document.getElementById('pFile' + this.getAttribute('data-id'));

    if (prisonerFile)
    {
        prisonerFile.click();
    }
}

function executed()
{
    let num = this.getAttribute('data-id');
    //this.style.filter = 'none';
    //this.classList.remove('prison-label');
    //this.classList.add('remove');

    this.remove();

    let text = document.getElementById('pName' + num);
    //text.classList.remove('prison-label');
    //text.classList.add('remove');

    text.remove();

    let id = document.getElementById('pID' + num);
    //this.removeEventListener('click', executed);

    id.remove();

    let removeNum = parseInt(num);
    let remove = randomArray.indexOf(removeNum);

    randomArray.splice(remove, 1);

    startRound();
}






