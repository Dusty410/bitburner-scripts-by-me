/** @param {import(".").NS } ns */
export async function main(ns) {
    /*
    Agriculture:
0.5\text{ }Water+0.5\text{ }Energy\Rightarrow 1\text{ }Plants+1\text{ }Food

Tobacco:
1\text{ }Plants+0.2\text{ }Water\Rightarrow Products

Software:
0.5\text{ }Hardware+0.5\text{ }Energy\Rightarrow 1\text{ }AICores+Products

Food:
0.5\text{ }Food+0.5\text{ }Water+0.2\text{ }Energy\Rightarrow Products

Chemical:
1\text{ }Plants+0.5\text{ }Energy+0.5\text{ }Water\Rightarrow 1\text{ }Chemicals

Computer:
2\text{ }Metal+1\text{ }Energy\Rightarrow 1\text{ }Hardware+Products

Energy:
0.1\text{ }Hardware+0.2\text{ }Metal\Rightarrow 1\text{ }Energy

Fishing:
0.5\text{ }Energy\Rightarrow 1\text{ }Food

Healthcare:
10\text{ }Robots+5\text{ }AICores+5\text{ }Energy+5\text{ }Water\Rightarrow Products

Mining:
0.8\text{ }Energy\Rightarrow 1\text{ }Metal

Real Estate:
5\text{ }Metal+5\text{ }Energy+2\text{ }Water+4\text{ }Hardware\Rightarrow 1\text{ }RealEstate+Products

Pharmaceutical:
2\text{ }Chemicals+1\text{ }Energy+0.5\text{ }Water\Rightarrow 1\text{ }Drugs+Products

Robotics:
5\text{ }Hardware+3\text{ }Energy\Rightarrow 1\text{ }Robots+Products

Utilities:
0.1\text{ }Hardware+0.1\text{ }Metal\Rightarrow 1\text{ }Water
*/

    const CORP_NAME = 'EJ Dynamics';
    const DIV_NAMES = {
        agro: 'Agro'
        , tobac: 'Old Toby'
        , software: 'Broderbund'
        , food: 'Soylent Blue'
        , chem: 'Umbrella'
        , comp: 'Gateway'
        , energy: 'NRG'
        , fish: 'Nemo'
        , health: 'Sacred Heart'
        , mining: 'Boring Co'
        , rlEst: 'Laaaaaaand'
        , pharm: 'Heisenberg'
        , robot: 'R2D2'
        , util: 'GCWW'
    }
    const CITIES = ['Sector-12', 'Aevum', 'Volhaven', 'Chongqing', 'New Tokyo', 'Ishima'];
    const JOBS = {
        ops: 'Operations'
        , eng: 'Engineer'
        , bus: 'Business'
        , mgmt: 'Management'
        , rd: 'Research & Development'
    };

    const funds = () => ns.corporation.getCorporation().funds;

    /**
     * Search if a division with the specified name exists
     * 
     * @param {string} divTarget division name to search for
     * @returns True if div exists
     */
    function divExists(divTarget) {
        // divisions is an array of division objects
        let divs = ns.corporation.getCorporation().divisions;
        return divs.some(div => div.name == divTarget);
    }

    /**
     * Expand to all cities in specified division
     * 
     * @param {string} div expand cities in this div
     */
    function expandToAllCities(div) {
        CITIES.forEach(
            city => {
                if (!ns.corporation.getDivision(div).cities.includes(city)) {
                    if (funds() >= ns.corporation.getExpandCityCost()) {
                        ns.corporation.expandCity(div, city);
                    }
                }
            }
        );
    }

    /**
     * Buys warehouse levels in all cities up to the target level in the specified division
     * 
     * @param {string} div division name
     * @param {number} targetLvl target warehouse level
     */
    function buyWarehouseAllCities(div, targetLvl) {
        CITIES.forEach(
            city => {
                while (ns.corporation.getWarehouse(div, city).level < targetLvl) {
                    if (funds() >= ns.corporation.getPurchaseWarehouseCost()) {
                        ns.corporation.purchaseWarehouse(div, city);
                    }
                }
            }
        );
    }

    function enableSmartSupplyAllCities(division) {
        for (let i in CITIES) {
            var city = CITIES[i];
            ns.corporation.setSmartSupply(division, city, true);
        }
    }

    function upgradeOfficeAllCities(division, newPositions) { // newPositions must be a multiple of 3
        for (let i in CITIES) {
            var city = CITIES[i];
            ns.corporation.upgradeOfficeSize(division, city, newPositions);
        }
    }

    function hireEmployeesAllCities(division, numEmployees) {
        for (let i in CITIES) {
            var city = CITIES[i];
            for (let j = 0; j < numEmployees; j += 1) {
                ns.corporation.hireEmployee(division, city);
            }
        }
    }

    function s1JobAssignments(division) {
        for (let i in CITIES) {
            var city = CITIES[i];
            ns.corporation.setAutoJobAssignment(division, city, JOBS.ops, 1);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.eng, 1);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.bus, 1);
        }
    }

    function s2JobAssignments(division) {
        for (let i in CITIES) {
            var city = CITIES[i];
            ns.corporation.setAutoJobAssignment(division, city, JOBS.ops, 1);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.eng, 1);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.mgmt, 2);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.rd, 2);
        }
    }

    function s3JobAssignments(division) {
        ns.corporation.setAutoJobAssignment(division, 'Aevum', JOBS.ops, 4);
        ns.corporation.setAutoJobAssignment(division, 'Aevum', JOBS.eng, 4);
        ns.corporation.setAutoJobAssignment(division, 'Aevum', JOBS.bus, 5);
        ns.corporation.setAutoJobAssignment(division, 'Aevum', JOBS.mgmt, 4);
        ns.corporation.setAutoJobAssignment(division, 'Aevum', JOBS.rd, 4);
    }

    function assignJobsAllCities(division, numEmployees) {
        for (let i in CITIES) {
            var city = CITIES[i];
            ns.corporation.setAutoJobAssignment(division, city, JOBS.ops, numEmployees);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.eng, numEmployees);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.bus, numEmployees);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.mgmt, numEmployees);
            ns.corporation.setAutoJobAssignment(division, city, JOBS.rd, numEmployees);
        }
    }

    function expandStorageAllCities(division, upgradeCount) {
        for (let i in CITIES) {
            var city = CITIES[i];
            ns.corporation.upgradeWarehouse(division, city, upgradeCount);
        }
    }

    function sellPlantsAndFood(division) {
        for (let i in CITIES) {
            var city = CITIES[i];
            ns.corporation.sellMaterial(division, city, 'Plants', 'MAX', 'MP');
            ns.corporation.sellMaterial(division, city, 'Food', 'MAX', 'MP');
        }
    }

    async function oneTimeBuy(division, shoppingList) {
        for (let i in CITIES) {
            var city = CITIES[i];
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
    ns.corporation.createCorporation(CORP_NAME);

    if (funds() >= ns.corporation.getExpandIndustryCost('Agriculture') && !divExists(DIV_NAMES.agro)) {
        ns.corporation.expandIndustry('Agriculture', DIV_NAMES.agro);
    }

    /**
     * Once you’ve got a brand-new division, the first step is to buy Smart Supply,
     * which will keep you topped up on materials you need to do business. Speaking of
     * which, you’ll have to Configure said Smart Supply on the Sector-12 office tab and enable it for it to keep you flush.
     * Next, you’ll want to start Expanding to offices in different cities. After buying each,
     * Hire 3 Employees for that office, one in each of the essential positions: Operations, Engineer, and Business.
     */
    expandToAllCities(DIV_NAMES.agro);
    if (funds() > ns.corporation.getUnlockUpgradeCost('Smart Supply')) {
        ns.corporation.unlockUpgrade('Smart Supply');
    }
    enableSmartSupplyAllCities(DIV_NAMES.agro);
    hireEmployeesAllCities(DIV_NAMES.agro, 3);
    s1JobAssignments(DIV_NAMES.agro);

    /**
     * When you’re spread across the map and staffed, splurge on a single AdVert.Inc
     * purchase to get the word out that you’re in town… all of them. This will
     * increase Awareness and Popularity, which help you sell materials and later, products.
     */
    ns.corporation.hireAdVert(DIV_NAMES.agro);

    /**
     * Upgrade each office’s Storage to 300 (two successive upgrades) and start selling
     * your Plants and Food. To do that, click Sell (0.000/0.000) to open the selling dialog,
     * which you can study at your leisure, then pick a sell amount and sell price.
     * I’d suggest starting with MAX for Sell amount and MP (market price) for the Sell
     * price, but this is your corporation, you run it how you want! After a tick, it should
     * change to say something like Sell (69.420/MAX) @$3.210k, indicating that you’re selling
     * 69.420 items per second (out of whatever MAX happens to be now), at $3.210k per unit. Great!
     */
    expandStorageAllCities(DIV_NAMES.agro, 2);
    sellPlantsAndFood(DIV_NAMES.agro);

    /**
     * Time to Grow
     * 
     * With all the basics in place, we’re going to grease the gears a bit with some upgrades,
     * in order and in two rounds (i.e., through this list twice):
     *         FocusWires
     *         Neural Accelerators
     *         Speech Processor Implants
     *         Nuoptimal Nootropic Injector Implants
     *         Smart Factories
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
     *         1. Click Buy (0.000)
     *         2. Enter the number of items to purchase per second
     *         3. Click Confirm
     *         4. Watch the item amount on the left (e.g., Material:  AMOUNT (RATE)) and the moment it
     *         changes to our desired value, just click the button to buy again and click Clear Purchase
     * 
     * We’re going to buy 3 things for each office:
     * 
     *         Hardware at 12.5/s for one tick to 125 total
     *         AI Cores at 7.5/s for one tick to 75 total
     *         Real Estate at 2.7k/s (that’s twenty-seven hundred, 2 700, 2.7×103) for one tick to 27k total
     */
    ns.corporation.unlockUpgrade('Warehouse API');
    var shoppingList = [['Hardware', 12.5], ['AI Cores', 7.5], ['Real Estate', 2700]];
    await oneTimeBuy(DIV_NAMES.agro, shoppingList);

    /**
     * When they start, employee Morale, Happiness, and Energy will be fair-to-middlin’, but they’ll
     * improve with time. You should wait for the values to hit the following before proceeding:
     * 
     *         Avg Employee Morale: 100.000
     *         Avg Employee Happiness: 99.998 (or higher)
     *         Avg Employee Energy: 99.998 (or higher)
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
    *         Operations (2)
    *         Engineer (2)
    *         Business (1)
    *         Management (2)
    *         Research & Development (2)
    * 
    * If everything went according to plan above, you’ve now got about $160b left over. Now it’s time to ratchet this thing up to the peaks!
    */
    upgradeOfficeAllCities(division, 6);
    hireEmployeesAllCities(DIV_NAMES.agro, 6)
    s2JobAssignments(DIV_NAMES.agro);

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
    expandStorageAllCities(DIV_NAMES.agro, 7);

    /**
     * We’re gonna do that thing again where we Buy some exact amounts of materials, one tick at a time.
     * Here’s what we need at each office:
     * 
     *         Hardware at 267.5/s for one tick to get to 125 + 2675 = 2800
     *         Robots at 9.6/s for one tick to get to 96
     *         AI Cores at 244.5/s for one tick to get to 75 + 2445 = 2520
     *         Real Estate at 11940/s for one tick to get to 27000 + 119400 = 146400
     * 
     * With all this additional production, and thus revenue, let’s see if we can Find Investors again;
     * spoiler alert: we can, and this time it should be about $5t. Nice.
     */
    shoppingList = [['Hardware', 267.5], ['Robots', 9.6], ['AI Cores', 244.5], ['Real Estate', 11940]];
    await oneTimeBuy(DIV_NAMES.agro, shoppingList);
    ns.corporation.acceptInvestmentOffer();

    /**
     * Let’s get a bit more storage space, say 9 Warehouse Size upgrades per office
     * for another 1.8k storage each, bringing them to 3.8k total.
     * 
     * Now we’ll get some more materials to fill up all that space we bought before.
     * You know the drill, so here’s the shopping list for each office:
     * 
     *         Hardware at 650/s for one tick to 2800 + 6500 = 9300
     *         Robots at 63/s for one tick to 96 + 630 = 726
     *         AI Cores at 375/s for one tick to 2520 + 3750 = 6270
     *         Real Estate at 8400/s for one tick to 146400 + 84000 = 230400
     * 
     * This should get the Production Multiplier over 500. Neat.
     */
    expandStorageAllCities(DIV_NAMES.agro, 9);
    shoppingList = [['Hardware', 650], ['Robots', 63], ['AI Cores', 375], ['Real Estate', 8400]];
    await oneTimeBuy(DIV_NAMES.agro, shoppingList);

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
    ns.corporation.expandIndustry('Tobacco', DIV_NAMES.tobac);

    /**
     * Expand first to Aevum, then to all other cities. In Aevum, Upgrade the Size
     * of the office to 30 employees and hire enough folks to have 6 of each type
     * of employee except Training. As you expand to every other branch, keep the
     * same 9 employees in their same roles as before.
     */
    expandToAllCities(DIV_NAMES.tobac);
    enableSmartSupplyAllCities(DIV_NAMES.tobac);
    upgradeOfficeAllCities(DIV_NAMES.tobac, 6);
    ns.corporation.upgradeOfficeSize(DIV_NAMES.tobac, 'Aevum', 21);
    hireEmployeesAllCities(DIV_NAMES.tobac, 9);
    for (let index = 0; index < 21; index++) {
        ns.corporation.hireEmployee(DIV_NAMES.tobac, 'Aevum');
    }
    s1JobAssignments(DIV_NAMES.tobac);
    s2JobAssignments(DIV_NAMES.tobac);
    s3JobAssignments(DIV_NAMES.tobac);

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
    ns.corporation.makeProduct(DIV_NAMES.tobac, 'Aevum', prod, 1e9, 1e9);

    /**
     * Now we’ll introduce a set of guidelines for continued improvement of the corporation
     * (and our budding Tobacco division) while we wait. Do the first list item, if possible,
     * then the second, then the third, and so on:
     * 
     *         1. Whenever your corporation has more than $3t, invest a level in Wilson Analytics;
     *         just keep ballooning it to the moon (realistically it will top out at about lvl 14 here)
     *         2. Level FocusWires, Neural Accelerators, Speech Processor Implants, and Nuoptimal
     *         Nootropic Injector Implants each to level 20
     *         3. While you can afford to sink money into AdVert.Inc, do so for the Tobacco division
     *         (should end up with something like 36k Awareness and 27k Popularity)
     */
    for (let index = 0; index < 18; index++) {
        ns.corporation.levelUpgrade('FocusWires');
        ns.corporation.levelUpgrade('Neural Accelerators');
        ns.corporation.levelUpgrade('Speech Processor Implants');
        ns.corporation.levelUpgrade('Nuoptimal Nootropic Injector Implants');
    }

    while (ns.corporation.getProduct(DIV_NAMES.tobac, prod).developmentProgress < 100) {
        if (funds() > 3e12) {
            ns.corporation.levelUpgrade('Wilson Analytics');
        }

        if (funds() > ns.corporation.getHireAdVertCost(DIV_NAMES.tobac)) {
            ns.corporation.hireAdVert(DIV_NAMES.tobac);
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
    ns.corporation.sellProduct(DIV_NAMES.tobac, 'Aevum', prod, 'MAX', 'MP', true);

    for (let i = 0; i < 2; i++) {
        ns.corporation.makeProduct(DIV_NAMES.tobac, 'Aevum', ++prod, 1e9, 1e9);
        while (ns.corporation.getProduct(DIV_NAMES.tobac, prod).developmentProgress < 100) {
            if (ns.corporation.getCorporation().funds > 3e12) {
                ns.corporation.levelUpgrade('Wilson Analytics');
            }

            if (ns.corporation.getCorporation().funds > ns.corporation.getHireAdVertCost(DIV_NAMES.tobac)) {
                ns.corporation.hireAdVert(DIV_NAMES.tobac);
            }
        }
        ns.corporation.sellProduct(DIV_NAMES.tobac, 'Aevum', prod, 'MAX', 'MP', true);
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
    var numJobs = Object.keys(JOBS).length;
    var jobsPerPosition = employeesToHire / numJobs;
    ns.corporation.upgradeOfficeSize(DIV_NAMES.tobac, 'Aevum', employeesToHire);
    for (let index = 0; index < employeesToHire; index++) {
        ns.corporation.hireEmployee(DIV_NAMES.tobac, 'Aevum');
    }

    ns.corporation.setAutoJobAssignment(DIV_NAMES.tobac, 'Aevum', JOBS.ops, jobsPerPosition);
    ns.corporation.setAutoJobAssignment(DIV_NAMES.tobac, 'Aevum', JOBS.eng, jobsPerPosition);
    ns.corporation.setAutoJobAssignment(DIV_NAMES.tobac, 'Aevum', JOBS.bus, jobsPerPosition);
    ns.corporation.setAutoJobAssignment(DIV_NAMES.tobac, 'Aevum', JOBS.mgmt, jobsPerPosition);
    ns.corporation.setAutoJobAssignment(DIV_NAMES.tobac, 'Aevum', JOBS.rd, jobsPerPosition);

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
    //     await ns.sleep(25);
    // }
}