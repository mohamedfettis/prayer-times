const dateActuelle = new Date();

const jour = String(dateActuelle.getDate()).padStart(2, '0'); 
const mois = String(dateActuelle.getMonth() + 1).padStart(2, '0'); 
const annee = dateActuelle.getFullYear();

const dateFormatee = `${jour}/${mois}/${annee}`;
document.getElementById('date').innerHTML = dateFormatee;

let button = document.getElementById('get-times');
let input = document.getElementById('city-input');

button.addEventListener('click', function () {
    let city = input.value.trim();
    if (!city) {
        alert("Veuillez entrer une ville.");
        return;
    }

    axios.get(`https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(city)}`)
        .then(function (response) {
            let data = response.data.data;
            document.getElementById('timezone').innerHTML = data.meta.timezone;
            timeOfPrayer('sobah-time', data.timings.Fajr);
            timeOfPrayer('dhuhr-time', data.timings.Dhuhr);
            timeOfPrayer('asr-time', data.timings.Asr);
            timeOfPrayer('maghrib-time', data.timings.Maghrib);
            timeOfPrayer('isha-time', data.timings.Isha);
            timediff('sobah-remaining-time', data.timings.Fajr);
            timediff('dhuhr-remaining-time', data.timings.Dhuhr);
            timediff('asr-remaining-time', data.timings.Asr);
            timediff('maghrib-remaining-time', data.timings.Maghrib);
            timediff('isha-remaining-time', data.timings.Isha);
        })
        .catch(function (error) {
            console.error(error);
            alert("Une erreur s'est produite. Vérifiez votre connexion ou l'adresse de la ville.");
        });
});

function timeOfPrayer(id, time) {
    document.getElementById(id).innerHTML = time;
}
function timediff(id, salat) {
    let now = new Date();

    // Récupérer l'heure actuelle
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Convertir l'heure actuelle en minutes totales
    let nowInMinutes = hours * 60 + minutes;

    // Convertir l'heure de la prière (salat) en minutes totales
    let [salatHours, salatMinutes] = salat.split(':').map(Number);
    let salatInMinutes = salatHours * 60 + salatMinutes;

    // Calculer la différence
    let diff = salatInMinutes - nowInMinutes;

    // Formater la différence en heures et minutes
    let diffHours = Math.floor(Math.abs(diff) / 60);
    let diffMinutes = Math.abs(diff) % 60;
    let prefix = diff < 0 ? '-' : ''; // Ajouter un signe négatif si nécessaire

    // Afficher le résultat dans l'élément HTML
    document.getElementById(id).innerHTML = `${prefix}${diffHours}h ${diffMinutes}min`;
}

let nowYear= new Date().getFullYear();
document.getElementById('now-year').innerHTML = nowYear;
