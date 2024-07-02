class IpDeniedError extends Error {
    constructor(message) {
        super(message);
        this.name = "IpDeniedError";
    }
}

let blockedIPs = {};
const blockDuration = 15 * 60 * 1000; // 15 dakika

function ipfilterMiddleware(req, res, next) {
    const ip = req.ip;
    if (blockedIPs[ip]) {
        const timeBlocked = blockedIPs[ip].time;
        const timePassed = Date.now() - timeBlocked;
        const timeLeft = blockDuration - timePassed;

        if (timeLeft > 0) {
            const minutesLeft = Math.floor(timeLeft / 60000);
            const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
            return res.status(200).render('login', {
                error: `Çok fazla başarısız deneme. Lütfen ${minutesLeft} dakika ${secondsLeft} saniye sonra tekrar deneyin.`
            });
        } else {
            delete blockedIPs[ip]; // Süre dolduysa IP adresini engelden çıkar
        }
    }
    next();
}

function blockIP(ip) {
    if (!blockedIPs[ip]) {
        blockedIPs[ip] = { time: Date.now() };
        console.log(`IP ${ip} blocked for ${blockDuration / 1000 / 60} minutes`);

        setTimeout(() => {
            delete blockedIPs[ip];
            console.log(`IP ${ip} unblocked`);
        }, blockDuration);
    }
}

module.exports = {
    ipfilterMiddleware,
    blockIP,
    IpDeniedError,
    blockedIPs,
    blockDuration
};
