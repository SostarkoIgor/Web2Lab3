//dohvačanje canvasa
let c = document.getElementsByTagName('canvas')[0]
let ctx = c.getContext('2d')

//podešavanje dimenzija
c.width = window.innerWidth
c.height = window.innerHeight

//podešavanje varijabli

let topMargin = 50 //udaljenost izmežu prvog reda ciglica i vrha prozora, služi da imamo mjesta za ispis bodova

let fontSize=20 //veličina fonta

let textColor="white" //boja teksta

let intervalId=undefined //id setintervala, bilježimo ga da možemo zaustaviti igru

//varijabla za cigle
let targetInfo = {
    numberOfTargets: 72, //broj ciglica
    targets: [], //ciglice, kasnije se tu popunjava ovo polje
    targetWidth: undefined, //ovo je širina ciglice, to se izračunava na temelju parametra kliko je ciglica u jednom retku
    targetHeight: 30, //visina ciglice
    targetDistance: 10 //udaljenosti među ciglicama
}

//boje za stvaranje gradijenata za ciglice, prvi element je lijeva boja a drugi desna
const colors = [
    ['#ff0000', '#a30000'],
    ['#ff7f00', '#bb5e00'],
    ['#ffff00', '#bcbc00'],
    ['#00ff00', '#009900'],
    ['#0081ec', '#0000cc'],
    ['#a800f0', '#600097']
]

let screenSize = { //širina i visina prozora
    width: window.innerWidth,
    height: window.innerHeight
}

let paddle = { //objekt sa informacijama o palici
    x: screenSize.width/2-100, //x koordinata (gornji lievi kut, ito i y ispod), početno postavljena na sredinu
    y: screenSize.height-40, //y koordinata palice
    width: 200, //širina palice
    height: 20, //visina palice
    speed: 6, //brzina kojom se palica kreće kad ju pomičemo
    directionOfMovement: 0, //smjer kretanja, -1 za lijevo, 1 za desno, 0 za mirovanje
    color: 'darkred', //boja palice
    strokeColor: 'white' //boja obruba
}

let ball = { //podešavanje loptice
    x: paddle.x+paddle.width/2, //koordinate loptice, tj. njenog centra
    y: paddle.y-paddle.height/2-1,
    r: 10, //parametar za radijus
    speed: 4, //brzina kretanja
    dx: 1, //promjene u x, i ispod y smjeru, vektor [dx,dy] se normalizira na početku igre i kod svake kolizije na duljinu speed
    dy: 3, 
    color: 'white' //boja loptice
}

//funkcija za postavljanje cigla
const createTargets = () => {
    let numOfColumns = 12//broj stupaca
    
    //postavimo širinu u ovisnosti o broju ciglica po retku tako da zauzimaju ravnomjerno cijeli redak i imaju međusobne udaljenosti jednake targetDistance
    targetInfo.targetWidth = (screenSize.width-targetInfo.targetDistance*(numOfColumns+1))/numOfColumns

    //za sve cigle računamo koordinate gornjeg lijevog kuta
    for (let i=0;i<targetInfo.numberOfTargets;i++) {
        //ovo je objekt koji predstavlja jednu ciglicu, računamo koordinate pazeči na to u kojem je retku i stupcu
        let target = {
            x: i%numOfColumns*(targetInfo.targetWidth+targetInfo.targetDistance)+targetInfo.targetDistance,
            y: Math.floor(i/numOfColumns)*(targetInfo.targetHeight+targetInfo.targetDistance)+targetInfo.targetDistance+topMargin
        }
        //dodajemo svakoj ciglici pripadajući gradijent, to se izračunava nakon pošto to visi o koordinatama ciglice
        target.gradient = generateGradient(target.x, target.y, targetInfo.targetWidth, targetInfo.targetHeight, (i%numOfColumns)%colors.length)
        //svaku ciglicu dodajemo u polje ciglica
        targetInfo.targets.push(target)
    }
}

//funckija za generiranje gradienta
const generateGradient = (x, y, width, height, colorIndex) => {
    //gradijen generiramo za svaku ciglicu temeljem koordinata i dimenzija i odabiremo boju temeljen položaja u retku
    let gradient = ctx.createLinearGradient(x, y, x+width, y+height)
    gradient.addColorStop(0, colors[colorIndex][0])
    gradient.addColorStop(1, colors[colorIndex][1])
    return gradient
}

//funkcije za crtanje
const drawPaddle = () => { //crtanje palice
    //ovdje se postavlja sijena kako je zadano u zadatku da ju palica treba imati
    setShadow()
    ctx.fillStyle = paddle.color
    //popunjavamo palicu
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
    ctx.strokeStyle = paddle.strokeColor
    //crtamo joj obrub
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)
    //u ovoj je funkciji odmah izvedeno micanje palice u smijeru u kojem ju korisnik miče
    paddle.x += paddle.directionOfMovement*paddle.speed
    //ograničavanje pozicije palice tako da ne može izaći van prozora
    if (paddle.x < 0) paddle.x = 0
    if (paddle.x > c.width-paddle.width) paddle.x = c.width-paddle.width
}

const drawTargets = () => { //crtanje cigla
    //ovdje se postavlja sijena kako je zadano u zadatku da ciglice trebaju imati
    setShadow()
    //prolazimo kroz sve ciglice i crtamo ih, koristeći pripadajući gradijent
    targetInfo.targets.forEach(target => {
        ctx.fillStyle = target.gradient
        ctx.fillRect(target.x, target.y, targetInfo.targetWidth, targetInfo.targetHeight)
    })
}

const drawBall = () => { //crtanje loptice
    //postavljamo boju loptice
    ctx.fillStyle = ball.color
    //slično kao i u funkciji za crtanje palice, i ovdje se izvodi kretanje loptice
    ball.x += ball.dx
    ball.y += ball.dy
    //loptica ne treba imati sjenu, pa ju mičemo
    clearShadow()
    //crtamo krug radijusa r oko koordinata x, y
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI)
    ctx.fill()
    ctx.closePath()
}

const drawScore = () => { //crtanje bodova
    ctx.fillStyle = textColor
    //centriramo tekst u desno kako je zadano u zadatku
    ctx.textAlign = 'right'
    ctx.font = ''+fontSize+'px Arial'
    clearShadow()
    //ispisujemo bodove, bodovi su broj uništenih ciglica, tj broj ukupnih ciglica minus broj ostalih
    ctx.fillText('Score: '+ (targetInfo.numberOfTargets - targetInfo.targets.length), screenSize.width-10, topMargin-fontSize)

    //provjeravamo ako je već zapisana info o max scoreu u local storage, ako nije ispisujemo nulu
    ctx.fillText('Max score: '+(localStorage.getItem('maxScore') ? localStorage.getItem('maxScore') : '0'), screenSize.width-10, topMargin)
}

//funkcija za postavljanje sjene
const setShadow = () => {
    //sjena je bijela za x i y offsetom 2 i bez zamučenja
    ctx.shadowColor = 'white'
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 0
}

//funkcija za micanje sjene kad je to potrebno
const clearShadow = () => {
    ctx.shadowColor = 'transparent'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 0
}

//funkcija za postavljanje novog smjera kretanja loptice s slučajnim odabirom smjera
const randomizeDirection = () => {
    //pamtimo predznak početnog smjera kretanja
    let signX = Math.sign(ball.dx)
    let signY = Math.sign(ball.dy)
    //smjeru dodajemo slučajnu komponentu, tj mjenjamo kut kretanja
    ball.dx += Math.random()-0.5
    ball.dy += Math.random()-0.5
    //pošto se takvim pristupom može dogoditi da se promijeni predznak komponenta vektora [dx, dy], moramo to provjeriti i ispraviti ako je potrebno
    if (signX != Math.sign(ball.dx)) ball.dx *= -1
    if (signY != Math.sign(ball.dy)) ball.dy *= -1
    //vektor naravno moramo normalizirati, jer inače brzina kretanja nebi bila konstanta kroz trajanje igre
    normalizeDirection()
}

//funkcija za normaliziranje vektora kretanja loptice na duljinu jednaku speed atributu
const normalizeDirection = () => {
    //izračunavamo trenutnu nenormaliziranu duljinu vektora promjene
    let currentMagnitude = Math.sqrt(Math.pow(ball.dx, 2)+Math.pow(ball.dy, 2))
    //normaliziramo vektor, pošto je duljina vektora b=sqrt(dx^2+dy^2), ako ga želimo normalizirati na neku
    //duljinu a, lako slijedi da je vektor potrebno množiti sa a/b
    ball.dx = ball.dx/currentMagnitude*ball.speed
    ball.dy = ball.dy/currentMagnitude*ball.speed
}

//funkcije za koliziju
const checkCollisionWithEdges = () => { //provjera kolizije sa rubom
    //ovo provjerava lijevi i desni rub, potš je ekvivalentna akcija u sličaju kolizija s oba ruba
    //u tom je slučaju potrebno promijeniti predznak dx
    if (ball.x+ball.r > c.width || ball.x-ball.r < 0) {
        ball.dx = -ball.dx
        randomizeDirection()
    }
    //ovjde se provjerava kolizija s gornjim rubom
    //s donjim je ekvivalentno ali to očito nije potrebno provjeravati pošto se u tom slučaju gubi igra
    if (ball.y-ball.r < 0) {
        ball.dy = -ball.dy
        randomizeDirection()
    }
    //u slučaju se svih kolizija malo promijeni kut kretanja
    
}

const checkCollisionWithTargets = () => { //provjera kolizije sa ciglom
    //provjeravamo sve cigle ako ikoja je u koliziji s lopticom
    targetInfo.targets.forEach(target => {
        //provjera kolizije s ciglom na bilo kojoj strani cigle
        if (
            ball.x + ball.r > target.x &&
            ball.x - ball.r < target.x + targetInfo.targetWidth &&
            ball.y + ball.r > target.y &&
            ball.y - ball.r < target.y + targetInfo.targetHeight
        ) {
            //provjeravamo koja strana je pogođena
            if (ball.y < target.y || ball.y > target.y + targetInfo.targetHeight) {
                ball.dy = -ball.dy //pogođena je gornja ili donja strana
            } else {
                ball.dx = -ball.dx //pogođena je lijeva ili desna strana
            }
            
            //uklanjamo ciglu koja je pogođena
            targetInfo.targets.splice(targetInfo.targets.indexOf(target), 1)
            randomizeDirection()
            return
        }
    })
    
}

const checkCollisionWithPaddle = () => { //provjera kolizije sa palicom
    //ovdje se sve ponaša isto ako je kolizija, neovisno o tome na kojoj je stranici, pošto mi se takav pristup više sviđao
    if (ball.x+ball.r > paddle.x && ball.x-ball.r < paddle.x+paddle.width && ball.y+ball.r > paddle.y && ball.y-ball.r < paddle.y+paddle.height) {
        ball.dy = -ball.dy
        //ako je loptica pogodila lievu ili desnu stranu palice pomičemo ju prema gore da ne bude zaglavljena u samoj palici
        if (ball.y+ball.r > paddle.y) ball.y=paddle.y-ball.r
        randomizeDirection()
    }
}

//funkcija za kraj igre
const checkGameEnd = () => {
    let result = ''
    //yko nema više ciglica u polju je igra dobivena
    if (targetInfo.targets.length == 0) {
        result = 'YOU WON!'
    }
    //ako loptica padne van ekrana je igra izgubljena
    if (ball.y > screenSize.height + ball.r) {
        result = 'GAME OVER'
    }
    //ovo je zajednički dio koda za oba završetka igre
    if (targetInfo.targets.length == 0 || ball.y > screenSize.height + ball.r) {
        //loptica se zaustavlja
        ball.speed = 0
        ball.dx = 0
        ball.dy = 0
        //zaustavljamo igru
        clearInterval(intervalId)
        //ako je ovo novi najbolji rezultat ga zapisujemo u localstorage
        if (localStorage.getItem('maxScore') == null || localStorage.getItem('maxScore') < targetInfo.numberOfTargets - targetInfo.targets.length) {
            localStorage.setItem('maxScore', targetInfo.numberOfTargets - targetInfo.targets.length)
        }
        //ispisujemo rezultat igre, tj. ako je dobivena ili izgubljena
        clearShadow()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = ''+fontSize*2+'px Arial'
        ctx.fillStyle = textColor
        ctx.fillText(result, c.width/2, c.height/2)
    }
}

//poziv funkcije za stvaranje cigla
createTargets()

//početna normalizacija vektora kretanja loptice i odabri početnog slučajnog smjera
ball.dx=Math.random()/3-1/6 //ne želimo početni kut koji je previše "strm"
ball.dy=-(Math.abs(ball.dx)*((Math.random()+0.4)*3)) //dy se zadaje kao nešto što neće dati previše mali kut u kombinaciji s dx
normalizeDirection() //potrebno je to normalizirati

//glavna funkcija za crtanje
const draw = () => {
    //prvo počistimo sve od prije u canvasu
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.fillStyle = 'black'
    //crtamo crni pravokutnik preko canvasa kao pozadinu
    ctx.fillRect(0, 0, c.width, c.height)

    //crtamo palicu i lopticu
    drawPaddle()
    drawBall()

    //zovemo funkcije za detekciju kolizija
    checkCollisionWithPaddle()
    checkCollisionWithEdges()
    checkCollisionWithTargets()

    //crtamo ciglice
    drawTargets()

    //pišemo bodove
    drawScore()

    //provjeravamo ako je igra završena
    checkGameEnd()
}

//postavljamo interval na 10ms
intervalId = setInterval(draw, 10)

//event listeneri za kretanje palice
document.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowLeft' && paddle.x > 0) {
        paddle.directionOfMovement = -1
    }
    if (e.key == 'ArrowRight' && paddle.x < c.width-paddle.width) {
        paddle.directionOfMovement = 1
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
        paddle.directionOfMovement = 0
    }
})