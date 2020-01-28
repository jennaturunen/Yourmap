// -------------------- KARTAN LUONTI
function initMap() {

// -------------------- TYYLI kartalle

    const styledMapType = new google.maps.StyledMapType(
        [
            {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6'}]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
            },
            {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
            },
            {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
            },
            {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
            },
            {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
            },
            {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
            },
            {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
            },
            {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
            }
        ],
        {name: 'Kartta'});


// ---------------------- määritellään KARTTA ja lisätään tyyli

    const kartta = new google.maps.Map(document.getElementById('kartta'), {
        center: {lat: 60.2149842, lng: 24.802977},
        zoom: 11,
        mapTypeControlOptions: {
            mapTypeIds: ['satellite', 'styled_map']
        }
    });

    kartta.mapTypes.set('styled_map', styledMapType);
    kartta.setMapTypeId('styled_map');


// ---------------------- testataan PAIKANNUS käyttäjän sijaintiin

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let paikka = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            kartta.setCenter(paikka);
        });
    } else {
        alert('Paikannus ei onnistu, tarkista asetukset');
    }

    //Reitin hakeminen ja näyttäminen käyttäjän syöttämien tietojen perusteella

    // Luodaan DirectionsService-objekti, jonka avulla käytetään route-metodia, joka palauttaa pyydetyt paikkatiedot
    let hae_reitti = new google.maps.DirectionsService();

    // Luodaan DirectionsRenderer-objekti, jonka avulla näytetään reitti kartalla
    let reitti_kartalla = new google.maps.DirectionsRenderer();

    // Liitetään DirectionsRenderer sivumme karttaan
    reitti_kartalla.setMap(kartta);

    // Käynnistetään laske_reitti-funktio, kun klikataan hae-nappia sivulla
    const haku = document.querySelector('#hakunappi');

    haku.addEventListener('click', laske_reitti);


// -------------------- REITIN MÄÄRITYS
    function laske_reitti() {

        //lista luoduille markereille
        let gmarkereita = [];


        //Kutsutaan funktiota, joka hakee ja nÃ¤yttÃ¤Ã¤ tulokset
        nayta_reitti(hae_reitti, reitti_kartalla);
        document.getElementById('mode').addEventListener('change', function () {
            nayta_reitti(hae_reitti, reitti_kartalla);
        });

        function nayta_reitti(directionsService, directionsDisplay) {

            //Luetaan haluttu kulkutapa
            let selectedMode = document.getElementById('mode').value;

            //Asetetaan pyynnÃ¶ksi kÃ¤yttÃ¤jÃ¤n syÃ¶ttÃ¤mÃ¤t tiedot
            hae_reitti.route({
                origin: document.getElementById('paikka1').value,
                destination: document.getElementById('paikka2').value,
                travelMode: google.maps.TravelMode[selectedMode],
                unitSystem: google.maps.UnitSystem.METRIC,
            }, function (result, status) {
                if (status === 'OK') {
                    console.log(result);

                    //Haetaan matka-aika ja vÃ¤limatka ja tulostetaan ne sivulle
                    const tulosta = document.getElementById('output');

                    const tulostus = ('<div class=\'result-table\'>Välimatka kilometreinä: ' +
                        result.routes[0].legs[0].distance.text + '.<br />Matka-aika: ' +
                        result.routes[0].legs[0].duration.text + '.</div>');

                    tulosta.innerHTML = tulostus;

// -------------------- KESKIPISTE
                    /*
                    // tulostellaan koordinaatteja
                    console.log(result.routes[0].bounds);
                    */

                    // määritellään A ja B pisteiden koordinaatit
                    let Alat = result.routes[0].bounds.l.j;
                    let Alon = result.routes[0].bounds.j.j;
                    let Blat = result.routes[0].bounds.l.l;
                    let Blon = result.routes[0].bounds.j.l;

                    //muutetaan koordinaatit radiaaneiksi
                    let AlatRAD = Alat * Math.PI / 180;
                    let AlonRAD = Alon * Math.PI / 180;
                    let BlatRAD = Blat * Math.PI / 180;
                    let BlonRAD = Blon * Math.PI / 180;

                    // matematiikkaa
                    let Bx = Math.cos(BlatRAD) * Math.cos(BlonRAD - AlonRAD);
                    let By = Math.cos(BlatRAD) * Math.sin(BlonRAD - AlonRAD);

                    //määritellään C piste
                    let ClatRAD = Math.atan2(Math.sin(AlatRAD) + Math.sin(BlatRAD),
                        Math.sqrt((Math.cos(AlatRAD) + Bx) * (Math.cos(AlatRAD) + Bx) + By * By));
                    let ClonRAD = AlonRAD + Math.atan2(By, Math.cos(AlatRAD) + Bx);

                    //muutetaan C radiaaneista asteiksi
                    let Clat = (ClatRAD * 180 / Math.PI);
                    let Clon = (ClonRAD * 180 / Math.PI);

                    let C = {
                        lat: Clat,
                        lng: Clon
                    };

// -------------------- C MARKER

                    let infoC;
                    infoC = new google.maps.InfoWindow();
                    let image1 = 'https://url_goes_here/pics/smol/MarkerC.png';

                    // lisätään C:lle marker
                    const marker3 = new google.maps.Marker({
                        position: C,
                        map: kartta,
                        icon: image1
                    });
                    google.maps.event.addListener(marker3, 'click', function () {
                        infoC.setContent('<strong>KESKIPISTE</strong>');
                        infoC.open(kartta, this);
                    });

                    //lisätään C marker gmarkereiden listaan
                    gmarkereita.push(marker3);

                    //Kun vaihdetaan kulkutapaa, nollautuu markkerit
                    const modenappi = document.querySelector('#mode');
                    modenappi.addEventListener('change', function () {
                        for (let i = 0; i < gmarkereita.length; i++) {
                            marker3.setMap(null);
                        }
                    });

                    //kun tehdään uusi haku, poistetaan edellinen keskipiste (C)
                    haku.addEventListener('click', function () {
                        for (let i = 0; i < gmarkereita.length; i++) {
                            marker3.setMap(null);
                        }
                    });

// -------------------- LÄHIMMÄT KOHTEET, markerit

                    let info;
                    info = new google.maps.InfoWindow();
                    let image2 = 'https://url_goes_here/pics/smol/icorest2.png';

                    let service = new google.maps.places.PlacesService(kartta);

                    service.nearbySearch({
                        location: C,
                        radius: 500,
                        type: ['restaurant']
                    }, callback);

                    //etsitään paikat
                    function callback(results, status) {

                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            for (let i = 0; i < 10; i++) {
                                createMarker(results[i]);
                            }
                        }
                    }

                    // luodaan markerit löydetyille sijainneille
                    function createMarker(place) {

                        let markereita = new google.maps.Marker({
                            map: kartta,
                            position: place.geometry.location,
                            icon: {
                                url: image2,
                                scale: 0.2
                            }
                        });

                        // lisätään luodut markerit listaan
                        gmarkereita.push(markereita);

                        // markeria klikatessa näytetään paikan nimi
                        google.maps.event.addListener(markereita, 'click', function () {
                            info.setContent('RAVINTOLA:<br>' + '<strong>' + place.name + '</strong>');
                            info.open(kartta, this);
                        });

                        // poistetaan edellisen haun markerit uuden haun yhteydessä
                        haku.addEventListener('click', function () {
                            for (let i = 0; i < gmarkereita.length; i++) {
                                markereita.setMap(null);
                            }
                        });
                    }

// -------------------- NÄYTETÄÄN reitti, poistetaan jos status ei ok

                    reitti_kartalla.setDirections(result);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
    }

// -------------------- AUTOCOMPLETE käyttäjän syöttämälle tekstille

    const rajoitus = {
        componentRestrictions: {country: "fi"}
    };

    let paikka1 = document.getElementById('paikka1');
    new google.maps.places.Autocomplete(paikka1, rajoitus);

    let paikka2 = document.getElementById('paikka2');
    new google.maps.places.Autocomplete(paikka2, rajoitus);

}

