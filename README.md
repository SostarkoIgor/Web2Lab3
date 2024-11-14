# Treća laboratorijska vježba iz kolegija napredni razvoj programske potpore za web
## Breakout - Canvas API igra

Ovo je jednostavna implementacija klasične igre **Breakout** koristeći HTML5 `canvas` i JavaScript. Cilj igre je kontrolirati palicu kako biste odbijali lopticu i razbili sve ciglice na ekranu.

Palica se pomiče sa lijevom i desnom strelicom na tipkovnici.

Igra je dostupna na linku: https://web2lab3-7ip1.onrender.com/breakout.html

## Izgled sučelja

![Screenshot_1](https://github.com/user-attachments/assets/a0e20f44-75b1-4893-9c33-aedceb542ac7)

## Tekst zadatka

Potrebno je izraditi arkadnu 2D računalnu igru kao HTML5 web stranicu.

Igra je znatno pojednostavljena verzija poznate arkadne igre Breakout.

Izgled igre s opisom traženih funkcionalnosti opisan je u nastavku zadatka.

### Obavezne i opcionalne funkcionalnosti:

Igra se prikazuje u Canvas objektu koji pokriva cijeli prozor web preglednika. Pozadina Canvas može biti crne ili bijele boje, ili neke druge boje po vašem odabiru s dovoljnim kontrastom za bolji prikaz.

Canvas objekt mora imati vidljivi rub.

Igra započinje odmah nakon učitavanja web stranice. Na početku igre generira se određen broj objekata (cigli) koje igrač treba razbiti pomoću loptice koja se odbija o palicu koju igrač kontrolira na dnu ekrana. Loptica se inicijalno generira na središtu palice i počinje se kretati prema gore pod slučajnim kutem.

Igrač upravlja palicom obavezno pomoću tipkovnice. Npr. tipke strelice - lijevo i desno, ili neke druge dvije tipke po vašem izboru.

Novi objekti cigli su raspoređeni u nekoliko redova na vrhu ekrana, dok se loptica i palica nalaze na dnu. Loptica se kreće konstantnom brzinom, a smjer mijenja prilikom udara o palicu, cigle ili rubove ekrana. Odabrane vrijednosti za brzinu loptice i veličinu palice moraju biti takve da je igru moguće igrati, odnosno da nije preteška.

Parametri igre - broj cigli i početna brzina loptice su predefinirani (konstantne u vašem programskom kodu). Opcionalno, parametri igre mogu se konfigurirati kroz HTML5 web stranicu prije pokretanja igre.

Objekt koji predstavlja ciglu je pravokutnik odabrane boje. Umjesto pravokutnika dozvoljeno je koristiti prikladnu sliku (JPG, PNG) cigle.

Slično, objekt koji predstavlja palicu na dnu ekrana je pravokutnik crvene boje s obaveznim sjenčanjem ruba. Dozvoljeno je koristiti neku sliku (npr. platformu) umjesto pravokutnika.

Cigle i palica obavezno moraju imati sjenčanje ruba i biti prikazani korištenjem HTML5 Canvas API-a.

Ako loptica izađe izvan donjeg ruba ekrana, igra završava, te se obavezno preko sredine Canvasa (vertikalno i horizontalno centrirano) prikazuje tekstualna obavijest (npr. "GAME OVER"), velikih slova u definiranom fontu.

Ako je igrač dovoljno vješt i uspije uništiti sve cigle, igra završava uz obavezni ispis prikladne poruke na isti način.

U svakom koraku animacije mora se detektirati kolizija (sudar) loptice s ciglama, palicom i rubovima ekrana. Nakon svakog sudara s ciglom, cigla nestaje, a igrač dobiva bodove (1 uništena cigla = 1 bod).

Moguće je (nije obavezno) generirati zvuk prilikom kolizije loptice i cigle, loptice i palice, ili loptice i gornjeg, lijevo i desnog ruba Canvasa. Također, moguće je generirati odgovarajuće zvuk na početku i kraju igre, te kada igrač pređe neki okrugli broj bodova.

Igra mora mjeriti broj bodova, a cilj igrača je postići što više bodova razbijanjem svih cigli bez gubitka loptice.

Najbolje ostvareni rezultat, od kad je igra prvi put pokrenuta, mora se pohranjivati koristeći local storage pomoću HTML5 Web Storage API-ja.

U gornjem desnom rubu Canvasa mora se prikazivati trenutni broj bodova i maksimalni broj bodova.

Za rješenje zadatka obavezno je izraditi jednu HTML5 stranicu, jednu CSS datoteku i jednu JavaScript datoteku.

Deklaracije struktura, objekata, funkcija kao i pozivi funkcija moraju biti detaljno komentirani i precizno objašnjeni u HTML5 i JavaScript izvornom kodu vašim riječima.

### Bodovanje:

Za svaku obaveznu funkcionalnost koja nije implementirana gubi se dio bodova.

Korištenje postojećih biblioteka, programskih sučelja, okvira ili drugih gotovih elemenata programskog koda je strogo zabranjeno.

