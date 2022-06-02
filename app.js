let gameStarted = false
let arrowLeftPressed = false
let arrowRightPressed = false
let arrowDownPressed = false
let activeBlock
let activeBlockType
let freeFallID
let controlID


document.addEventListener('keydown', (e)=> {
    if(e.key=="Enter" && !gameStarted){
        startGame()
    }
    else if(e.key=='ArrowLeft'){
        arrowLeftPressed = true
    }
    else if(e.key=='ArrowRight'){
        arrowRightPressed = true
    }
    else if(e.key=='ArrowDown'){
        arrowDownPressed = true
    }
    else if(e.keyCode=='32' && !e.repeat){
        let distances = []

        activeBlock.forEach((square_A)=>{
            Array.from(document.querySelectorAll('#play-board img')).slice(4).forEach((square_B)=>{
                if(marginLeft(square_A)==marginLeft(square_B) && marginTop(square_B)>marginTop(square_A)){
                    distances.push(marginTop(square_B)-marginTop(square_A)-26)
                }
            })
        })

        let marginTopValues = activeBlock.map(square => marginTop(square))
        let maxMarginTopValue = Math.max.apply(Math,marginTopValues)
        distances.push(494-maxMarginTopValue)

        let shortestDistance = Math.min.apply(Math,distances)
        activeBlock.forEach(square => square.style.marginTop = `${marginTop(square)+shortestDistance}px`)
        changeActiveBlock()
    }
})

document.addEventListener('keyup', (e)=> {
    if(e.key=='ArrowLeft'){
        arrowLeftPressed = false
    }
    else if(e.key=='ArrowRight'){
        arrowRightPressed = false
    }
    else if(e.key=='ArrowDown'){
        arrowDownPressed = false
    }
})

function startGame(){
    gameStarted = true
    let type = randomBlockType()
    generateBlock(type)
    activeBlock = Array.from(document.querySelectorAll(`#play-board img`)).slice(0,4)
    activeBlockType = type

    document.querySelector('#score-board p').remove()
    document.querySelector('#score-board').insertAdjacentHTML('beforeend', `
        <p>Level: <span id='level'>1</span></p>
        <p>Score: <span id='score'>0</span></p>
        <p>Lines: <span id='lines>0'</span></p>
        <p>Next Block:</p>
        <img src='${randomBlockType()} block.png'>
    `)
    freeFall()
    control()
}

function control(){
    controlID = setInterval(()=> {
        if(arrowLeftPressed){
            !hitTest('left') && activeBlock.forEach(square => square.style.marginLeft = `${marginLeft(square)-26}px`)
        }
        if(arrowRightPressed){
            !hitTest('right') && activeBlock.forEach(square => square.style.marginLeft = `${marginLeft(square)+26}px`)
        }
        if(arrowDownPressed){
            if(hitTest('down')){
                changeActiveBlock()
            }
            else{
                activeBlock.forEach(square => square.style.marginTop = `${marginTop(square)+26}px`)
            }
        }
    },50)
}

function freeFall(){
    freeFallID = setInterval(() =>{
         if(hitTest('down')){
            changeActiveBlock()

        }else{
            activeBlock.forEach(square => square.style.marginTop = `${marginTop(square)+26}px`)
        }
    },1000)
}

function changeActiveBlock(){
    let nextBlock = document.querySelector(`#score-board img`)
    let nextBlockType = nextBlock.getAttribute('src')[0]
    generateBlock(nextBlockType)
    activeBlock = Array.from(document.querySelectorAll(`#play-board img`)).slice(0,4)
    activeBlockType = nextBlockType
    nextBlock.src = `${randomBlockType()} block.png`
}

function hitTest(direction){
    let hit = false
    activeBlock.forEach((square_A)=>{
        if(direction=='down'){
            if(marginTop(square_A)==494){
                hit = true
            }
            Array.from(document.querySelectorAll(`#play-board img`)).slice(4).forEach((square_B) =>{
                if(marginTop(square_A)+26==marginTop(square_B) && marginLeft(square_A)==marginLeft(square_B)){
                    hit=true
                }
            })
        }
        else{
            let valueA = (direction=='left')  ? 0 : 234
            let valueB = (direction=='left')  ? -26 : 26

            if(marginLeft(square_A)==valueA) {
                hit = true
            }
            Array.from(document.querySelectorAll(`#play-board img`)).slice(4).forEach((square_B) =>{
                if(marginLeft(square_A)+valueB==marginLeft(square_B) && marginTop(square_A)==marginTop(square_B)){
                    hit = true
                }
            })
        }
    })
    return hit
}

function marginLeft(square){
    return Number(square.style.marginLeft.split('px')[0])
}

function marginTop(square){
    return Number(square.style.marginTop.split('px')[0])
}


function generateBlock(type) {
    let blockData = [
        {type: 'I', squares:[{x:78, y:0}, {x:104, y:0}, {x:130, y:0}, {x:156, y:0}], sqrColor:'lightblue'},
        {type: 'S', squares:[{x:78, y:26}, {x:104, y:26}, {x:104, y:0}, {x:130, y:0}], sqrColor:'green'},
        {type: 'Z', squares:[{x:78, y:0}, {x:104, y:0}, {x:104, y:26}, {x:130, y:26}], sqrColor:'red'},
        {type: 'L', squares:[{x:78, y:26}, {x:104, y:26}, {x:130, y:26}, {x:130, y:0}], sqrColor:'orange'},
        {type: 'J', squares:[{x:130, y:26}, {x:104, y:26}, {x:78, y:26}, {x:78, y:0}], sqrColor:'darkblue'},
        {type: 'O', squares:[{x:104, y:0}, {x:104, y:26}, {x:130, y:0}, {x:130, y:26}], sqrColor:'yellow'},
        {type: 'T', squares:[{x:78, y:26}, {x:104, y:26}, {x:130, y:26}, {x:104, y:0}], sqrColor:'purple'},
    ]

    blockData.forEach((block)=> {
        if(block.type==type) {
            let html = ''
            for(let i=0; i<=3; i++){
                let style = `margin-left:${block.squares[i].x}px; margin-top:${block.squares[i].y}px;` 
                html += `<img src='${block.sqrColor} square.png' style='${style}'>`
            }
            document.querySelector('#play-board').insertAdjacentHTML('afterbegin', html)
        }
    })
}

function randomBlockType(){
    let types = ['I','J','S','Z','L','O','T']
    let randomType = types[Math.floor(Math.random() * types.length)]
    return randomType
}