function HammingCodeOlustur() {
    const bitData = parseInt(document.getElementById('bitData').value);  //HTML sayfasında 'bitData' id'sine sahip olan select elementinin değerini alıp tamsayıya çeviriyoruz.

    const GirisData = document.getElementById('GirisData').value.trim(); //'GirisData' id'sine sahip input elementinin değerini alıp başındaki ve sonundaki boşlukları kaldırıyoruz.


    if (GirisData.length !== bitData) { // girilen verinin uzunluğu bit uzunluğuna eşit değilse

        alert(`Lütfen tam olarak ${bitData} bitlik veri girin.`); //ekrana hata mesajı veriyoruz.
        return;
    }

    if (!/^[01]+$/.test(GirisData)) {
        alert('Lütfen sadece 0 ve 1 içeren bir veri girin.');
        return;
    }

    const hammingCode = HammingCodeHesapla(GirisData); //HammingCodeHesapla fonksiyonunu çağırıyoruz ve 'hammingcode' adlı değişkene atıyoruz.

    document.getElementById('hammingCodeCiktisi').innerText = `Hamming Code: ${hammingCode}`; // Hesaplanan Hamming kodunu 'hammingCodeCiktisi' id'sine sahip HTML elementine yazdırıyoruz.

    introduceError(hammingCode); // Rastgele bir hata ekliyoruz.

}

function HammingCodeHesapla(data) {
    const m = data.length;
    let r = 0;

    // Gerekli parite bit sayısını hesaplıyoruz
    while (Math.pow(2, r) < m + r + 1) {
        r++;
    }

    const toplamBit = m + r;
    let hammingCode = new Array(toplamBit).fill(0);

    // Veri bitlerini yerleştiriyoruz
    let j = 0;
    for (let i = 0; i < toplamBit; i++) {
        if (Math.pow(2, j) - 1 === i) {
            j++;
        } else {
            hammingCode[i] = parseInt(data.charAt(i - j));
        }
    }

    // Parite bitlerini hesaplıyoruz
    for (let i = 0; i < r; i++) {
        const pos = Math.pow(2, i) - 1;
        hammingCode[pos] = ParityBitHesapla(hammingCode, pos + 1);
    }

    return hammingCode.join('');
}

function ParityBitHesapla(arr, pos) { // belirtilen pozisyondaki bitlerin paritesi hesaplanır.

    let parity = 0;
    for (let i = pos - 1; i < arr.length; i += 2 * pos) {  // Belirtilen pozisyondan başlayarak dizi boyunca adım adım ilerliyoruz.

        for (let j = 0; j < pos && i + j < arr.length; j++) {// Her adımda belirtilen pozisyon kadar bit kontrol ediyoruz.
                                                            // Dizinin sınırları içinde kalıp kalmadığımızı kontrol ediyoruz.

            parity ^= arr[i + j]; // XOR işlemi ile pariteyi hesaplıyoruz.
        }
    }
    return parity;        // Hesaplanan parite bitini döndürüyoruz.

}

function introduceError(hammingCode) {  //Bu fonksiyonda hamming koduna rastgele bir hata ekliyoruz ve hafızaya kaydediyor.

    const bitPos = Math.floor(Math.random() * hammingCode.length); // Hamming kodunun uzunluğu içinde rastgele bir bit pozisyonu seçiyoruz.

    const hammingArr = hammingCode.split(''); // Hamming kodunu bir karakter dizisine (array) dönüştürüyoruz.
    hammingArr[bitPos] = hammingArr[bitPos] === '0' ? '1' : '0';   //hamming kodunda bir bit rastgele seçilir ve tersine çevrilir.

    memory = hammingArr.join('');  // Karakter dizisini tekrar bir string'e dönüştürerek hafızaya kaydediyoruz.


    const highlightedMemory = memory.split('').map((bit, index) => {
        if (index === bitPos) {
            return `<span style="color: red;">${bit}</span>`;
        }
        return bit;
    }).join('');

    document.getElementById('HafizaCiktisi').innerHTML = `Hatalı Hafıza: ${highlightedMemory} (Hata Biti: ${bitPos + 1})`;
}

function HafizadanOkuma() {
    if (!memory) {  // Eğer 'memory' boşsa, yani henüz bir Hamming kodu oluşturulmadıysa

        alert('Hafiza boş. Önce Hamming kodu oluşturun.');  //  ekrana bir uyarı gönderir.

        return;
    }

    const hataBiti = HataTespit(memory);
    if (hataBiti === 0) {
        document.getElementById('duzeltilmisHammingCiktisi').innerText = `Hafizada hata bulunamadi: ${memory}`;
    } else {
        const correctedMemory = HataDuzelt(memory, hataBiti);
        document.getElementById('duzeltilmisHammingCiktisi').innerText = `Hata bulundu, hata biti: ${hataBiti}. Düzeltildi: ${correctedMemory}`;
    }
}

function HataTespit(hammingCode) {  //bu fonksiyon ile hata tespiti yapar.
    const toplamBit = hammingCode.length;  // Hamming kodunun toplam uzunluğunu hesaplar.

    const r = Math.ceil(Math.log2(toplamBit + 1)); // Kontrol bitlerinin sayısını hesaplar.
    let errorPos = 0;  // Hata pozisyonunu tutmak için bir değişken oluşturur ve başlangıçta sıfır olarak ayarlar.

    for (let i = 0; i < r; i++) {  //kontrol bitleri üzerinden hata pozisyonu hesaplanır 

        const pos = Math.pow(2, i);  // Kontrol bitinin pozisyonunu hesaplar.

        let parity = 0;   // Parite bitini tutmak için bir değişken oluşturur.

        for (let j = pos; j <= toplamBit; j += 2 * pos) {  // Hamming kodunu kontrol bitinin pozisyonuna göre kontrol eder.

            for (let k = 0; k < pos; k++) {  // Belirli aralıklarda kontrol bitlerini toplar.

                if (j + k - 1 < toplamBit) {   // Dizinin sınırları içinde olup olmadığını kontrol eder.

                    parity ^= parseInt(hammingCode[j + k - 1]); // XOR operatörü ile parite hesaplaması yapar.
                }
            }
        }
        errorPos += parity * pos;  // Eğer bir hata bulunursa hata pozisyonunu hesaplar.

    }

    return errorPos;  // Hata pozisyonunu döndürür
}

function HataDuzelt(hammingCode, errorPos) {  //Bu fonksiyon ile tespit edilen hata düzeltilir.
    const correctedCode = hammingCode.split(''); // Hamming kodunu karakter dizisine dönüştürür.
    const pos = errorPos - 1;  // Hata pozisyonu 1'den başladığı için 0 tabanlı indekslemeye dönüştürülür.


    correctedCode[pos] = correctedCode[pos] === '0' ? '1' : '0';
    return correctedCode.join('');   // hatalı bit tersine çevrilir ve düzeltilmiş Hamming kodu string olarak döndürülür.

}
