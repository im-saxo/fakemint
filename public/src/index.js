(function() {
	 // Initialize Firebase
	 var config = {
		apiKey: "AIzaSyDb4javSaumLksCIM7IIXXPovvw2rGerFs",
		authDomain: "fakemint-c7134.firebaseapp.com",
		databaseURL: "https://fakemint-c7134.firebaseio.com",
		projectId: "fakemint-c7134",
		storageBucket: "fakemint-c7134.appspot.com",
		messagingSenderId: "813882715485"
	  };

	firebase.initializeApp(config);
	firebase.auth();

	const noop = () => {};

	// Database
	class Store {
		constructor(callback) {
			this.callback = callback || noop;

			this.state = {
				mint: 0,
				watermelon: 0,
			};

			this.database = firebase.database();

			this.database.ref('mint').on('value', this.onDBChange.bind(this));
			this.database.ref('watermelon').on('value', this.onDBChange.bind(this));
		}

		onDBChange(snapshot) {
			this.state[snapshot.key] = snapshot.val();
			this.callback(this.getData());
		}

		onWatermelonChange(snapshot) {
			this.state.mint = snapshot.val();
			this.callback(this.getData());
		}

		count(type) {
			switch(type) {
				case 'mint':
				return this.countMint();
				case 'watermelon': 
				return this.countWatermelon();
			}
		}

		countMint() {
			this.state.mint++;
			this.database.ref('mint').set(this.state.mint);
			
			this.callback(this.getData());
		}

		countWatermelon() {
			this.state.watermelon++;
			this.database.ref('watermelon').set(this.state.watermelon);
			
			this.callback(this.getData());
		}

		getData() {
			const {mint, watermelon} = this.state;
			const total = mint + watermelon;

			return {
				mint,
				mintPercent: total === 0 ? 50 : Math.round(mint / total * 100),
				watermelon,
				watermelonPercent: total === 0 ? 50 : Math.round(watermelon / total * 100),
			}
		}
	}

	class App {
		constructor() {
			this.$mint = document.querySelector('.mint');
			this.$watermelon = document.querySelector('.watermelon');
			this.store = new Store(this.updateAll.bind(this));

			[this.$mint, this.$watermelon].forEach((element) => {
				element.addEventListener('click', this.onClick.bind(this));
			})
		}

		onClick(event) {
			const type = event.currentTarget.getAttribute('data-name');
			this.store.count(type)
			
			event.preventDefault();
		}

		updateAll({mint, mintPercent, watermelon, watermelonPercent}) {
			this.updateBox(this.$mint, mint, mintPercent);
			this.updateBox(this.$watermelon, watermelon, watermelonPercent);
		}

		updateBox($box, count, percent) {
			$box.querySelector('.count').innerText = count;
			$box.querySelector('.percent').innerText = `${percent}%`;
		}
	}

	// start
	new App();
})();