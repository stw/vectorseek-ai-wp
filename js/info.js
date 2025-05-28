async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

var info={

    timeOpened:new Date(),
    timezone:(new Date()).getTimezoneOffset()/60,

    onPage(){return window.location.pathname},
    referrer(){return document.referrer},
    previousSites(){return history.length},

    browserName(){return navigator.appName},
    browserEngine(){return navigator.product},
    browserVersion1a(){return navigator.appVersion},
    browserVersion1b(){return navigator.userAgent},
    browserLanguage(){return navigator.language},
    browserOnline(){return navigator.onLine},
    browserPlatform(){return navigator.platform},
    javaEnabled(){return navigator.javaEnabled()},
    dataCookiesEnabled(){return navigator.cookieEnabled},
    dataCookies1(){return document.cookie},
    dataCookies2(){return decodeURIComponent(document.cookie.split(";"))},
    dataStorage(){return localStorage},

    sizeScreenW(){return screen.width},
    sizeScreenH(){return screen.height},
    sizeDocW(){return document.width},
    sizeDocH(){return document.height},
    sizeInW(){return innerWidth},
    sizeInH(){return innerHeight},
    sizeAvailW(){return screen.availWidth},
    sizeAvailH(){return screen.availHeight},
    scrColorDepth(){return screen.colorDepth},
    scrPixelDepth(){return screen.pixelDepth},


    latitude(){return position.coords.latitude},
    longitude(){return position.coords.longitude},
    accuracy(){return position.coords.accuracy},
    altitude(){return position.coords.altitude},
    altitudeAccuracy(){return position.coords.altitudeAccuracy},
    heading(){return position.coords.heading},
    speed(){return position.coords.speed},
    timestamp(){return position.timestamp},

    async ip() {
        const ip = await getIP();
        return ip;
    },
};

function getInfo() {
    return {
        'page': info.onPage(),
        'referrer': info.referrer(),
        'broswer': info.browserName(),
        'version1a': info.browserVersion1a(),
        'version1b': info.browserVersion1b(),
        'engine': info.browserEngine(),
        'platform': info.browserPlatform(),
        'language': info.browserLanguage(),
        'size_w': info.sizeScreenW(),
        'size_h': info.sizeScreenH(),
        'avail_w': info.sizeAvailW(),
        'avail_h': info.sizeAvailH(),
        'in_w': info.sizeInW(),
        'in_h': info.sizeInH()
    };
}
