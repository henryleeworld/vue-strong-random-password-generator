new Vue({
    el: '#app',
    data() {
        return {
            password: '',
            copied: false,
            settings: {
                maxLength: 64,
                maxDigits: 10,
                maxSymbols: 10,
                length: 12,
                digits: 4,
                symbols: 2,
                ambiguous: true,
            }
        };
    },
    computed: {
        lengthThumbPosition: function() {
            return (((this.settings.length - 6) / (this.settings.maxLength - 6)) * 100);
        },
        digitsThumbPosition: function() {
            return (((this.settings.digits - 0) / (this.settings.maxDigits - 0)) * 100);
        },
        symbolsThumbPosition: function() {
            return (((this.settings.symbols - 0) / (this.settings.maxSymbols - 0)) * 100);
        },
        strength: function() {
            var count = {
                excess: 0,
                upperCase: 0,
                numbers: 0,
                symbols: 0
            };

            var weight = {
                excess: 3,
                upperCase: 4,
                numbers: 5,
                symbols: 5,
                combo: 0,
                flatLower: 0,
                flatNumber: 0
            };

            var strength = {
                text: '',
                score: 0
            };

            var baseScore = 30;

            for (i = 0; i < this.password.length; i++) {
                if (this.password.charAt(i).match(/[A-Z]/g)) {
                    count.upperCase++;
                }
                if (this.password.charAt(i).match(/[0-9]/g)) {
                    count.numbers++;
                }
                if (this.password.charAt(i).match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                    count.symbols++;
                }
            }

            count.excess = this.password.length - 6;

            if (count.upperCase && count.numbers && count.symbols) {
                weight.combo = 25;
            } else if ((count.upperCase && count.numbers) || (count.upperCase && count.symbols) || (count.numbers && count.symbols)) {
                weight.combo = 15;
            }

            if (this.password.match(/^[\sa-z]+$/)) {
                weight.flatLower = -30;
            }

            if (this.password.match(/^[\s0-9]+$/)) {
                weight.flatNumber = -50;
            }

            var score =
                baseScore +
                (count.excess * weight.excess) +
                (count.upperCase * weight.upperCase) +
                (count.numbers * weight.numbers) +
                (count.symbols * weight.symbols) +
                weight.combo + weight.flatLower +
                weight.flatNumber;

            if (score < 30) {
                strength.text = "弱";
                strength.score = 10;
                return strength;
            } else if (score >= 30 && score < 75) {
                strength.text = "普通";
                strength.score = 40;
                return strength;
            } else if (score >= 75 && score < 150) {
                strength.text = "強";
                strength.score = 75;
                return strength;
            } else {
                strength.text = "安全";
                strength.score = 100;
                return strength;
            }
        },
    },
    mounted() {
        this.generatePassword();
    },
    watch: {
        settings: {
            handler: function() {
                this.generatePassword();
            },
            deep: true
        }
    },
    methods: {
        copyToClipboard() {
            var copyElement = document.createElement("textarea");
            copyElement.style.opacity = '0';
            copyElement.style.position = 'fixed';
            copyElement.textContent = this.password;
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(copyElement);
            copyElement.select();
            document.execCommand('copy');
            body.removeChild(copyElement);

            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 750);
        },
        generatePassword() {
            var lettersSetArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
            var symbolsSetArray = ["=", "+", "-", "^", "?", "!", "%", "&", "*", "$", "#", "^", "@", "|"];
            var passwordArray = [];
            var digitsArray = [];
            var digitsPositionArray = [];

            for (var i = 0; i < this.settings.length; i++) {
                digitsPositionArray.push(i);

                var upperCase = Math.round(Math.random() * 1);
                if (upperCase === 0) {
                    passwordArray[i] = lettersSetArray[Math.floor(Math.random() * lettersSetArray.length)].toUpperCase();
                } else {
                    passwordArray[i] = lettersSetArray[Math.floor(Math.random() * lettersSetArray.length)];
                }
            }

            for (i = 0; i < this.settings.digits; i++) {
                digit = Math.round(Math.random() * 9);
                numberIndex = digitsPositionArray[Math.floor(Math.random() * digitsPositionArray.length)];

                passwordArray[numberIndex] = digit;

                var j = digitsPositionArray.indexOf(numberIndex);
                if (i != -1) {
                    digitsPositionArray.splice(j, 1);
                }
            }

            for (i = 0; i < this.settings.symbols; i++) {
                var symbol = symbolsSetArray[Math.floor(Math.random() * symbolsSetArray.length)];
                var symbolIndex = digitsPositionArray[Math.floor(Math.random() * digitsPositionArray.length)];

                passwordArray[symbolIndex] = symbol;

                var j = digitsPositionArray.indexOf(symbolIndex);
                if (i != -1) {
                    digitsPositionArray.splice(j, 1);
                }
            }
            this.password = passwordArray.join("");
        },
    },
});