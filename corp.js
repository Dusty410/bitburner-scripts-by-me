/** @param {import(".").NS } ns */
export async function main(ns) {
	const corpName = 'EJ Dynamics';
	const agroDiv = 'Agro';
	const tobacDiv = 'Old Toby';
	const cities = ['Sector-12', 'Aevum', 'Volhaven', 'Chongqing', 'New Tokyo', 'Ishima'];
	const jobs = { ops: 'Operations', eng: 'Engineer', bus: 'Business', mgmt: 'Management', rd: 'Research & Development' };

	function funds() {
		return ns.corporation.getCorporation().funds;
	}

	function divExists(divName) {
		var exists = false;
		var divisions = ns.corporation.getCorporation().divisions;
		for (let i in divisions) {
			var division = divisions[i];
			if (division.name == divName) {
				exists = true;
			}
		}
		return exists;
	}

	function expandToAllCities(division) {
		for (let i in cities) {
			var city = cities[i];
			if (!ns.corporation.getDivision(division).cities.includes(city)) {
				ns.corporation.expandCity(division, city);
				ns.corporation.purchaseWarehouse(division, city);
			}
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

	function s3JobAssignments(division) {
		ns.corporation.setAutoJobAssignment(division, 'Aevum', jobs.ops, 4);
		ns.corporation.setAutoJobAssignment(division, 'Aevum', jobs.eng, 4);
		ns.corporation.setAutoJobAssignment(division, 'Aevum', jobs.bus, 5);
		ns.corporation.setAutoJobAssignment(division, 'Aevum', jobs.mgmt, 4);
		ns.corporation.setAutoJobAssignment(division, 'Aevum', jobs.rd, 4);
	}

	function assignJobsAllCities(division, numEmployees) {
		for (let i in cities) {
			var city = cities[i];
			ns.corporation.setAutoJobAssignment(division, city, jobs.ops, numEmployees);
			ns.corporation.setAutoJobAssignment(division, city, jobs.eng, numEmployees);
			ns.corporation.setAutoJobAssignment(division, city, jobs.bus, numEmployees);
			ns.corporation.setAutoJobAssignment(division, city, jobs.mgmt, numEmployees);
			ns.corporation.setAutoJobAssignment(division, city, jobs.rd, numEmployees);
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

	async function oneTimeBuy(division, shoppingList) {
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
	
	if (funds() >= ns.corporation.getExpandIndustryCost('Agriculture') && !divExists(agroDiv)) {
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
	await oneTimeBuy(agroDiv, shoppingList);

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
	for (let index = 0; index < 10; index++) {
		ns.corporation.levelUpgrade('Smart Factories');
		ns.corporation.levelUpgrade('Smart Storage');
	}
	expandStorageAllCities(agroDiv, 7);

	/**
	 * We’re gonna do that thing again where we Buy some exact amounts of materials, one tick at a time.
	 * Here’s what we need at each office:
	 * 
	 * 		Hardware at 267.5/s for one tick to get to 125 + 2675 = 2800
	 * 		Robots at 9.6/s for one tick to get to 96
	 * 		AI Cores at 244.5/s for one tick to get to 75 + 2445 = 2520
	 * 		Real Estate at 11940/s for one tick to get to 27000 + 119400 = 146400
	 * 
	 * With all this additional production, and thus revenue, let’s see if we can Find Investors again;
	 * spoiler alert: we can, and this time it should be about $5t. Nice.
	 */
	shoppingList = [['Hardware', 267.5], ['Robots', 9.6], ['AI Cores', 244.5], ['Real Estate', 11940]];
	await oneTimeBuy(agroDiv, shoppingList);
	ns.corporation.acceptInvestmentOffer();

	/**
	 * Let’s get a bit more storage space, say 9 Warehouse Size upgrades per office
	 * for another 1.8k storage each, bringing them to 3.8k total.
	 * 
	 * Now we’ll get some more materials to fill up all that space we bought before.
	 * You know the drill, so here’s the shopping list for each office:
	 * 
	 * 		Hardware at 650/s for one tick to 2800 + 6500 = 9300
	 * 		Robots at 63/s for one tick to 96 + 630 = 726
	 * 		AI Cores at 375/s for one tick to 2520 + 3750 = 6270
	 * 		Real Estate at 8400/s for one tick to 146400 + 84000 = 230400
	 * 
	 * This should get the Production Multiplier over 500. Neat.
	 */
	expandStorageAllCities(agroDiv, 9);
	shoppingList = [['Hardware', 650], ['Robots', 63], ['AI Cores', 375], ['Real Estate', 8400]];
	await oneTimeBuy(agroDiv, shoppingList);

	/**
	 * The First Product and Beyond
	 * 
	 * Now we’ll want to let that farm some cash for us while we work on the next step.
	 * It’s time to make a product! Note that this section is a bit more freeform than
	 * before. Don’t fret about the order as much as the ideas.
	 * 
	 * To create a product, we need to Expand again, and this time we’re going with
	 * Tobacco. It costs $20b to make the expansion, so scoop the corporation’s money
	 * into a pile, come up with a snazzy name, and take the plunge.
	 */
	ns.corporation.expandIndustry('Tobacco', tobacDiv);

	/**
	 * Expand first to Aevum, then to all other cities. In Aevum, Upgrade the Size
	 * of the office to 30 employees and hire enough folks to have 6 of each type
	 * of employee except Training. As you expand to every other branch, keep the
	 * same 9 employees in their same roles as before.
	 */
	expandToAllCities(tobacDiv);
	enableSmartSupplyAllCities(tobacDiv);
	upgradeOfficeAllCities(tobacDiv, 6);
	ns.corporation.upgradeOfficeSize(tobacDiv, 'Aevum', 21);
	hireEmployeesAllCities(tobacDiv, 9);
	for (let index = 0; index < 21; index++) {
		ns.corporation.hireEmployee(tobacDiv, 'Aevum');
	}
	s1JobAssignments(tobacDiv);
	s2JobAssignments(tobacDiv);
	s3JobAssignments(tobacDiv);

	/**
	 * When everyone is up and running, pop into the Aevum office and click Create Product.
	 * Have a read of the product creation dialog if desired, then choose Aevum (duh), name
	 * it something like “Tobacco v1” (or a more creative name) and set it up for $1b in
	 * each of Design investment and Marketing investment, then click Develop Product. This
	 * will take some time; you can monitor the process at the bottom of the materials and
	 * products list in an office with a warehouse set up (right off the bat this will only
	 * be Sector-12 if you don’t expand and set them up first).
	 */
	var prod = 0;
	ns.corporation.makeProduct(tobacDiv, 'Aevum', prod, 1e9, 1e9);

	/**
	 * Now we’ll introduce a set of guidelines for continued improvement of the corporation
	 * (and our budding Tobacco division) while we wait. Do the first list item, if possible,
	 * then the second, then the third, and so on:
	 * 
	 * 		1. Whenever your corporation has more than $3t, invest a level in Wilson Analytics;
	 * 		just keep ballooning it to the moon (realistically it will top out at about lvl 14 here)
	 * 		2. Level FocusWires, Neural Accelerators, Speech Processor Implants, and Nuoptimal
	 * 		Nootropic Injector Implants each to level 20
	 * 		3. While you can afford to sink money into AdVert.Inc, do so for the Tobacco division
	 * 		(should end up with something like 36k Awareness and 27k Popularity)
	 */
	for (let index = 0; index < 18; index++) {
		ns.corporation.levelUpgrade('FocusWires');
		ns.corporation.levelUpgrade('Neural Accelerators');
		ns.corporation.levelUpgrade('Speech Processor Implants');
		ns.corporation.levelUpgrade('Nuoptimal Nootropic Injector Implants');
	}

	while (ns.corporation.getProduct(tobacDiv, prod).developmentProgress < 100) {
		if (funds() > 3e12) {
			ns.corporation.levelUpgrade('Wilson Analytics');
		}

		if (funds() > ns.corporation.getHireAdVertCost(tobacDiv)) {
			ns.corporation.hireAdVert(tobacDiv);
		}
	}

	/**
	 * When v1 completes, set its sell amount to MAX, and its price to MP. Set it the
	 * same for all cities for now. If you see it constantly selling 100%, try multiplying
	 * MP by increasing integers until it doesn’t, then drop back down by 1 (i.e., when you
	 * have stock sitting in the warehouse, the price is too high, so reduce it). When
	 * you’re feeling froggy, leap into “Tobacco v2”, with the same setup as v1, and then
	 * do it again for v3 when ready. During this process, don’t spend Scientific Research!
	 * Your tobacco products will benefit in a huge way from stockpiled research, so each
	 * version will be better than the last!
	 */
	ns.corporation.sellProduct(tobacDiv, 'Aevum', prod, 'MAX', 'MP', true);

	for (let i = 0; i < 2; i++) {
		ns.corporation.makeProduct(tobacDiv, 'Aevum', ++prod, 1e9, 1e9);
		while (ns.corporation.getProduct(tobacDiv, prod).developmentProgress < 100) {
			if (ns.corporation.getCorporation().funds > 3e12) {
				ns.corporation.levelUpgrade('Wilson Analytics');
			}

			if (ns.corporation.getCorporation().funds > ns.corporation.getHireAdVertCost(tobacDiv)) {
				ns.corporation.hireAdVert(tobacDiv);
			}
		}
		ns.corporation.sellProduct(tobacDiv, 'Aevum', prod, 'MAX', 'MP', true);
	}

	/**
	 * If you haven’t already, expand to all cities, then hire employees up to 60 in
	 * Aevum primarily, but do hire at each office eventually. Feel free to let Aevum
	 * be your hiring focus indefinitely though; it needs the employees for continuing
	 * design work, while other cities will simply produce and sell a bit more if you
	 * staff them. It’s not nothing, but better products will sell better on their own
	 * so it’s more of a “sprinkles on the sundae” situation.
	 */
	var employeesToHire = 30;
	var numJobs = Object.keys(jobs).length;
	var jobsPerPosition = employeesToHire / numJobs;
	ns.corporation.upgradeOfficeSize(tobacDiv, 'Aevum', employeesToHire);
	for (let index = 0; index < employeesToHire; index++) {
		ns.corporation.hireEmployee(tobacDiv, 'Aevum');
	}

	ns.corporation.setAutoJobAssignment(tobacDiv, 'Aevum', jobs.ops, jobsPerPosition);
	ns.corporation.setAutoJobAssignment(tobacDiv, 'Aevum', jobs.eng, jobsPerPosition);
	ns.corporation.setAutoJobAssignment(tobacDiv, 'Aevum', jobs.bus, jobsPerPosition);
	ns.corporation.setAutoJobAssignment(tobacDiv, 'Aevum', jobs.mgmt, jobsPerPosition);
	ns.corporation.setAutoJobAssignment(tobacDiv, 'Aevum', jobs.rd, jobsPerPosition);

	/**
	 * When the hiring in Aevum is done and the corp has 3 products, Discontinue the
	 * first one (the lowest value) and make another, same setup as before. There
	 * should always be a product under development. When the eggheads down in
	 * R&D have cooked up 10k Scientific Research, it’s time to apply it via the
	 * Research button. The first thing needed is the Hi-Tech R&D Laboratory, which
	 * will earn an additional 10% on all research done; getting this in early pays
	 * off later. The main goal here is getting Market-TA.I and Market-TA.II,
	 * simultaneously, at the low, low price of 70k. Make sure to wait to have 140k
	 * Scientific Research stored up so that new products aren’t completely tanked.
	 * It is generally agreed that Market-TA.I is not worth using on its own, so
	 * when setting prices on new products (still MAX and MP), it’s only necessary
	 * to turn on Market-TA.II (to the right, inside MARKET-TA).
	 */
	// var products = ns.corporation.getDivision().products;
	// while (products.length < 3) {
	// 	await ns.sleep(25);
	// }
}