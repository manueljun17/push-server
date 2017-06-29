exports.config = config = {
    apiKey: "AIzaSyCc5iNeysOZqbgVjE02AL_PhU7ucQDT5Ig",
    authDomain: "webpush-2c901.firebaseapp.com",
    databaseURL: "https://webpush-2c901.firebaseio.com",
    projectId: "webpush-2c901",
    storageBucket: "webpush-2c901.appspot.com",
    messagingSenderId: "207005138267"
};

exports.options =  options = {
    vapidDetails: {
        subject: 'http://localhost:4200',
        publicKey: 'BNzNJai0BhWggRnf4ehKwHXLB9q_1At6mfw-mLzB2ieE-bgLdhl1HuDdJ70SH80nUkSOJtbZqOVjgLXlFXme2h0',
        privateKey: 'daCTs_ipLIAKyOfk_cMfWp3sW2vROj5RTrkALA8usEM'
    },
    TTL: 60 * 60
};