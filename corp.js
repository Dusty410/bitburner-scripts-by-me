/** @param {import(".").NS } ns */
export async function main(ns) {	
	const corpName = 'EJ Dynamics';
	const agroDiv = 'Agro';
	const cities = ['Sector-12', 'Aevum', 'Volhaven', 'Chongqing', 'New Tokyo', 'Ishima'];
	const jobs = {ops:'Operations', eng:'Engineer', bus:'Business', mgmt:'Management', rd:'Research & Development'};

	function funds() {
		return ns.corporation.getCorporation().funds;
	}

	function expandToAllCities(division) {
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.expandCity(division, city);
		}
	}

	function enableSmartSupplyAllCities(division) {
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.setSmartSupply(division, city, true);
		}
	}

	function upgradeOfficeAllCities(division, newPositions) { // newPositions must be a multiple of 3
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.upgradeOfficeSize(division, city, newPositions);
		}
	}

	function hireEmployeesAllCities(division, numEmployees) {
		for (let i in cities) {
			var city = cities[i];
			for (let j = 0; j < numEmployees; j += 1) {
				ns.corporation.hireEmployee(division, city);
			}	
		}
	}

	function s1JobAssignments(division) {
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.setAutoJobAssignment(division, city, jobs.ops, 1);
			ns.corporation.setAutoJobAssignment(division, city, jobs.eng, 1);
			ns.corporation.setAutoJobAssignment(division, city, jobs.bus, 1);
		}
	}

	function s2JobAssignments(division) {
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.setAutoJobAssignment(division, city, jobs.ops, 1);
			ns.corporation.setAutoJobAssignment(division, city, jobs.eng, 1);
			ns.corporation.setAutoJobAssignment(division, city, jobs.mgmt, 2);
			ns.corporation.setAutoJobAssignment(division, city, jobs.rd, 2);
		}
	}

	function expandStorageAllCities(division, upgradeCount) {
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.upgradeWarehouse(division, city, upgradeCount);
		}
	}

	function sellPlantsAndFood(division) {
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.sellMaterial(division, city, 'Plants', 'MAX', 'MP');
			ns.corporation.sellMaterial(division, city, 'Food', 'MAX', 'MP');
		}
	}

	function oneTimeBuy(division, shoppingList) {
		for (let i in cities) {
			var city = cities[i];
			for (let j in shoppingList) {
				ns.corporation.buyMaterial(division, city, shoppingList[j][0], shoppingList[j][1]);
				var materialAmount = 0;
				while (materialAmount < shoppingList[j][1] * 10) {
					await ns.sleep(10);
					materialAmount = ns.corporation.getMaterial(division, city, shoppingList[j][0]).qty;
				}
				ns.corporation.buyMaterial(division, city, shoppingList[j][0], 0);
			}
		}
	}

	/**
	 * Initial Setup
	 * 
	 * Pick a name and choose to Expand right out of the gate… you don’t have anything yet,
	 * so expansion is how you make your first Agriculture division!
	 */
	ns.corporation.createCorporation(corpName);
	if (funds() >= ns.corporation.getExpandIndustryCost('Agriculture')) {
		ns.corporation.expandIndustry('Agriculture', agroDiv);
	}

	/**
	 * Once you’ve got a brand-new division, the first step is to buy Smart Supply,
	 * which will keep you topped up on materials you need to do business. Speaking of
	 * which, you’ll have to Configure said Smart Supply on the Sector-12 office tab and enable it for it to keep you flush.
	 * Next, you’ll want to start Expanding to offices in different cities. After buying each,
	 * Hire 3 Employees for that office, one in each of the essential positions: Operations, Engineer, and Business.
	 */
	expandToAllCities(agroDiv);
	if (funds() > ns.corporation.getUnlockUpgradeCost('Smart Supply')) {
		ns.corporation.unlockUpgrade('Smart Supply');
	}
	enableSmartSupplyAllCities(agroDiv);
	hireEmployeesAllCities(agroDiv, 3);
	s1JobAssignments(agroDiv);

	/**
	 * When you’re spread across the map and staffed, splurge on a single AdVert.Inc
	 * purchase to get the word out that you’re in town… all of them. This will
	 * increase Awareness and Popularity, which help you sell materials and later, products.
	 */
	ns.corporation.hireAdVert(agroDiv);

	/**
	 * Upgrade each office’s Storage to 300 (two successive upgrades) and start selling
	 * your Plants and Food. To do that, click Sell (0.000/0.000) to open the selling dialog,
	 * which you can study at your leisure, then pick a sell amount and sell price.
	 * I’d suggest starting with MAX for Sell amount and MP (market price) for the Sell
	 * price, but this is your corporation, you run it how you want! After a tick, it should
	 * change to say something like Sell (69.420/MAX) @$3.210k, indicating that you’re selling
	 * 69.420 items per second (out of whatever MAX happens to be now), at $3.210k per unit. Great!
	 */
	expandStorageAllCities(agroDiv, 2);
	sellPlantsAndFood(agroDiv);

	/**
	 * Time to Grow
	 * 
	 * With all the basics in place, we’re going to grease the gears a bit with some upgrades,
	 * in order and in two rounds (i.e., through this list twice):
	 * 		FocusWires
	 * 		Neural Accelerators
	 * 		Speech Processor Implants
	 * 		Nuoptimal Nootropic Injector Implants
	 * 		Smart Factories
	 * 
	 * Just one level of each, then back through to make it two each.
	 */
	for (let index = 0; index < 2; index++) {
		ns.corporation.levelUpgrade('FocusWires');
		ns.corporation.levelUpgrade('Neural Accelerators');
		ns.corporation.levelUpgrade('Speech Processor Implants');
		ns.corporation.levelUpgrade('Nuoptimal Nootropic Injector Implants');
		ns.corporation.levelUpgrade('Smart Factories');
	}

	/**
	 * Now we want to get some more materials to help make products and run the business better.
	 * You’ve noticed by now that the list values change on a timed basis, corresponding to the
	 * Current state of the market cycle shown at the top of the list. We need to be ready to
	 * make a change within one tick, but it’s long enough that it shouldn’t be hard (10s). The general process is:
	 * 		
	 * 		1. Click Buy (0.000)
	 * 		2. Enter the number of items to purchase per second
	 * 		3. Click Confirm
	 * 		4. Watch the item amount on the left (e.g., Material:  AMOUNT (RATE)) and the moment it
	 * 		changes to our desired value, just click the button to buy again and click Clear Purchase
	 * 
	 * We’re going to buy 3 things for each office:
	 * 
	 * 		Hardware at 12.5/s for one tick to 125 total
	 * 		AI Cores at 7.5/s for one tick to 75 total
	 * 		Real Estate at 2.7k/s (that’s twenty-seven hundred, 2 700, 2.7×103) for one tick to 27k total
	 */
	ns.corporation.unlockUpgrade('Warehouse API');
	var shoppingList = [['Hardware', 12.5], ['AI Cores', 7.5], ['Real Estate', 2700]];
	oneTimeBuy(agroDiv, shoppingList);

	/**
	 * When they start, employee Morale, Happiness, and Energy will be fair-to-middlin’, but they’ll
	 * improve with time. You should wait for the values to hit the following before proceeding:
	 * 
	 * 		Avg Employee Morale: 100.000
	 * 		Avg Employee Happiness: 99.998 (or higher)
	 * 		Avg Employee Energy: 99.998 (or higher)
	 * 
	 * Workers should be allowed to reach these values whenever they’re hired, but note that this
	 * requires the company to be earning income. This will make sure they’re contributing their
	 * best work, and is a good way to squeeze out a couple extra bucks. This will be relevant very soon…
	 * 
	 * Now the Profit ought to be humming along, rocking steady at about $1.5m/s, and your corporation is
	 * looking nice; I bet there’s someone out there who’ll want to invest! Head back to the main tab and Find
	 * Investors. You ought to catch a bid of around $210b or so. Cool.
	 */
	 ns.corporation.acceptInvestmentOffer();

	 /** 
	 * Now you want to Upgrade the size of each office and increase the staff to 9 employees. You should end up with:
	 * 
	 * 		Operations (2)
	 * 		Engineer (2)
	 * 		Business (1)
	 * 		Management (2)
	 * 		Research & Development (2)
	 * 
	 * If everything went according to plan above, you’ve now got about $160b left over. Now it’s time to ratchet this thing up to the peaks!
	 */
	upgradeOfficeAllCities(division, 6);
	hireEmployeesAllCities(agroDiv, 6)
	s2JobAssignments(agroDiv);
	
	/**
	 * Upgrade each of Smart Factories and Smart Storage to level 10 to increase productivity and
	 * give your offices more room to store all the new stuff. This should leave you with about $110b.
	 * 
	 * Upgrade Warehouse Sizes directly 7 times for each office, for a new grand total storage of 2k at
	 * all locations, leaving around $45b to work with. Now to use some of that new space!
	 */
	
}