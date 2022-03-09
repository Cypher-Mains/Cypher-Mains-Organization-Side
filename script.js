var qrcode = new QRCode("qrcode");
var globalToken;

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}


function qrCodeGenerator() {
    var secretCode = getRandomString(32)
    var link = `otpauth://totp/SarathTest?issuer=GithubTest&secret=${secretCode}&algorithm=SHA1&digits=6&period=30`;
    console.log(link)

    qrcode.makeCode(link);
    document.querySelector('.key').innerHTML = secretCode;
    return link;
}

function extractDetails(link) {
    var splitQR = link.split('&');
    var len = splitQR.length;

    var result = [];
    var details = [];

    for (var i = 0; i < len; i++) {
        result[i] = splitQR[i].split('=');
        details[i] = result[i][1];
    }
    return details;
}

function generateOTP(link) {

    var details = extractDetails(link);
    let totp = new OTPAuth.TOTP({
        issuer: details[0],
        label: details[0],
        algorithm: details[2],
        digits: details[3],
        period: details[4],
        secret: details[1],
    });

    let token = totp.generate();
    globalToken = token;
    console.log(token)

}

function changeOTP() {
    var link = qrCodeGenerator()
    setInterval(() => generateOTP(link), 1000)
}

function checkToken() {
    var getToken = document.getElementById('key').value;
    if (getToken === globalToken)
        alert("correct");
    else
        alert("Wrong");
}

changeOTP();

document.querySelector('.show').addEventListener('click', function() {
    var copyKey = document.querySelector('.key');
    navigator.clipboard.writeText(copyKey.innerHTML);
    alert("Secret Key is successfully copied. Dont share the secret key with anyone.")
})