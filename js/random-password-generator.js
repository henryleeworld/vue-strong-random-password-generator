const app = Vue.createApp({
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
        lengthThumbPosition() {
            return (((this.settings.length - 6) / (this.settings.maxLength - 6)) * 100);
        },
        digitsThumbPosition() {
            return (((this.settings.digits - 0) / (this.settings.maxDigits - 0)) * 100);
        },
        symbolsThumbPosition() {
            return (((this.settings.symbols - 0) / (this.settings.maxSymbols - 0)) * 100);
        },
        strength() {
            let count = {
                excess: 0,
                upperCase: 0,
                numbers: 0,
                symbols: 0
            };

            let weight = {
                excess: 3,
                upperCase: 4,
                numbers: 5,
                symbols: 5,
                combo: 0,
                flatLower: 0,
                flatNumber: 0
            };

            let strength = {
                text: '',
                score: 0
            };

            let baseScore = 30;

            for (let i = 0; i < this.password.length; i++) {
                if (/[A-Z]/.test(this.password[i])) count.upperCase++;
                if (/[0-9]/.test(this.password[i])) count.numbers++;
                if (/[!,@,#,$,%,^,&,*,?,_,~]/.test(this.password[i])) count.symbols++;
            }

            count.excess = this.password.length - 6;

            if (count.upperCase && count.numbers && count.symbols) {
                weight.combo = 25;
            } else if (
                (count.upperCase && count.numbers) ||
                (count.upperCase && count.symbols) ||
                (count.numbers && count.symbols)
            ) {
                weight.combo = 15;
            }

            if (/^[\sa-z]+$/.test(this.password)) weight.flatLower = -30;
            if (/^[\s0-9]+$/.test(this.password)) weight.flatNumber = -50;

            let score =
                baseScore +
                (count.excess * weight.excess) +
                (count.upperCase * weight.upperCase) +
                (count.numbers * weight.numbers) +
                (count.symbols * weight.symbols) +
                weight.combo + weight.flatLower + weight.flatNumber;

            if (score < 30) {
                strength.text = "弱";
                strength.score = 10;
            } else if (score < 75) {
                strength.text = "普通";
                strength.score = 40;
            } else if (score < 150) {
                strength.text = "強";
                strength.score = 75;
            } else {
                strength.text = "安全";
                strength.score = 100;
            }

            return strength;
        },
    },
    mounted() {
        this.generatePassword();
    },
    watch: {
        settings: {
            handler() {
                this.generatePassword();
            },
            deep: true
        }
    },
    methods: {
        copyToClipboard() {
            const copyElement = document.createElement("textarea");
            copyElement.style.opacity = '0';
            copyElement.style.position = 'fixed';
            copyElement.textContent = this.password;
            document.body.appendChild(copyElement);
            copyElement.select();
            document.execCommand('copy');
            document.body.removeChild(copyElement);

            this.copied = true;
            setTimeout(() => this.copied = false, 750);
        },
        generatePassword() {
            const letters = "abcdefghijklmnopqrstuvwxyz".split("");
            const symbols = ["=", "+", "-", "^", "?", "!", "%", "&", "*", "$", "#", "^", "@", "|"];
            let passwordArray = [];
            let digitsPositionArray = [];

            for (let i = 0; i < this.settings.length; i++) {
                digitsPositionArray.push(i);
                const letter = letters[Math.floor(Math.random() * letters.length)];
                passwordArray[i] = Math.random() < 0.5 ? letter.toUpperCase() : letter;
            }

            for (let i = 0; i < this.settings.digits; i++) {
                const numberIndex = digitsPositionArray.splice(Math.floor(Math.random() * digitsPositionArray.length), 1)[0];
                passwordArray[numberIndex] = Math.floor(Math.random() * 10);
            }

            for (let i = 0; i < this.settings.symbols; i++) {
                const symbolIndex = digitsPositionArray.splice(Math.floor(Math.random() * digitsPositionArray.length), 1)[0];
                passwordArray[symbolIndex] = symbols[Math.floor(Math.random() * symbols.length)];
            }

            this.password = passwordArray.join("");
        }
    }
});

app.mount('#app');