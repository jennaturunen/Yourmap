// -------------------- NAVIGAATIO pysyy ylälaidassa, sticky

window.onscroll = function () {
    myFunction()
};

const navbar = document.querySelector("nav");
const sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

// -------------------- HAKU voidaan toteuttaa myös ENTERIÄ painamalla

const enter = document.querySelector('#paikka2');
enter.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        document.getElementById('hakunappi').click();
    }
});