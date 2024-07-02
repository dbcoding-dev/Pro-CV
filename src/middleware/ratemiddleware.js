const rateLimit = require('express-rate-limit');
const { blockIP, blockedIPs, blockDuration } = require('./ipfilter');

const failedAttempts = {}; // Başarısız denemeleri takip eden obje

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5, // 5 deneme
    handler: (req, res, /*next*/) => {
        const ip = req.ip;

        // Eğer IP zaten engellenmişse, rate limiter'e girmeden önce kontrol edelim
        if (blockedIPs[ip]) {
            const timeBlocked = blockedIPs[ip].time;
            const timePassed = Date.now() - timeBlocked;
            const timeLeft = blockDuration - timePassed;
            const minutesLeft = Math.floor(timeLeft / 60000);
            const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
            return res.status(200).render('login', {
                error: `Çok fazla başarısız deneme. Lütfen ${minutesLeft} dakika ${secondsLeft} saniye sonra tekrar deneyin.`
            });
        }

        failedAttempts[ip] = failedAttempts[ip] || 0;
        failedAttempts[ip]++;

        if (failedAttempts[ip] >= 5) {
            blockIP(ip);
        }

        const remainingAttempts = 5 - failedAttempts[ip];
        res.status(429).render('login', {
            error: `Çok fazla başarısız deneme. Lütfen 15 dakika sonra tekrar deneyin. Kalan deneme hakkınız: ${remainingAttempts}`
        });
    }
});

module.exports = limiter;
