/** @param {import(".").NS } ns */
export async function main(ns) {
    /*
    ===Divs w/ products===
    Tobacco: 1 plants + 0.2 water => products
    Software: 0.5 hardware + 0.5 energy => 1 AI cores + products
    Food: 0.5 food + 0.5 water + 0.2 energy => products
    Computer: 2 metal + 1 energy => 1 hardware + products
    Healthcare: 10 robots + 5 AI cores + 5 energy + 5 water => products
    Real Estate: 5 metal + 5 energy + 2 water + 4 hardware => 1 real estate + products
    Pharmaceutical: 2 chemicals + 1 energy + 0.5 water => 1 drugs + products
    Robotics: 5 hardware + 3 energy => 1 robots + products

    ===Divs w/o products===
    Agriculture: 0.5 water + 0.5 energy => 1 plants + 1 food
    Chemical: 1 plants + 0.5 energy + 0.5 water => 1 chemicals
    Energy: 0.1 hardware + 0.2 metal => 1 energy
    Fishing: 0.5 energy => 1 food
    Mining: 0.8 energy => 1 metal
    Utilities: 0.1 hardware + 0.1 metal => 1 water
    */

    ns.disableLog('sleep');

    const CORP_NAME = 'EJ Dynamics';
    const UNLOCK_UPGRADES = [
        'Export',
        'VeChain',
        'Market Research - Demand',
        'Shady Accounting',
        'Market Data - Competition',
        'Government Partnership',
        'Warehouse API',
        'Office API',
        'Smart Supply'
    ];
    const DIVS = {
        agro: {
            name: 'Agro',
            industry: 'Agriculture',
            prodMats: ['Plants', 'Food'],
            makesProducts: false
        },
        tobac: {
            name: 'Old Toby',
            industry: 'Tobacco',
            prodMats: [],
            makesProducts: true
        },
        software: {
            name: 'Broderbund',
            industry: 'Software',
            prodMats: ['AI Cores'],
            makesProducts: true
        },
        food: {
            name: 'Soylent Blue',
            industry: 'Food',
            prodMats: [],
            makesProducts: true
        },
        chem: {
            name: 'ChemCo',
            industry: 'Chemical',
            prodMats: ['Chemicals'],
            makesProducts: false
        },
        comp: {
            name: 'Hello, Computer',
            industry: 'Computer',
            prodMats: ['Hardware'],
            makesProducts: true
        },
        energy: {
            name: 'NRG',
            industry: 'Energy',
            prodMats: ['Energy'],
            makesProducts: false
        },
        fish: {
            name: 'Nemo',
            industry: 'Fishing',
            prodMats: ['Food'],
            makesProducts: false
        },
        health: {
            name: 'Sacred Heart',
            industry: 'Healthcare',
            prodMats: [],
            makesProducts: true
        },
        mining: {
            name: 'Mineco',
            industry: 'Mining',
            prodMats: ['Metal'],
            makesProducts: false
        },
        rlEst: {
            name: 'Laaaaaaand',
            industry: 'RealEstate',
            prodMats: ['Real Estate'],
            makesProducts: true
        },
        pharm: {
            name: 'PharmaBros',
            industry: 'Pharmaceutical',
            prodMats: ['Drugs'],
            makesProducts: true
        },
        robot: {
            name: 'R2D2',
            industry: 'Robotics',
            prodMats: ['Robots'],
            makesProducts: true
        },
        util: {
            name: 'util',
            industry: 'Utilities',
            prodMats: ['Water'],
            makesProducts: false
        }
    }
    const CITIES = [
        'Sector-12',
        'Aevum',
        'Volhaven',
        'Chongqing',
        'New Tokyo',
        'Ishima'
    ];
    const JOBS = {
        ops: 'Operations',
        eng: 'Engineer',
        bus: 'Business',
        mgmt: 'Management',
        rd: 'Research & Development'
    };
    const RESEARCH = [
        {
            name: 'Hi-Tech R&D Laboratory',
            prereq: 'none'
        },
        {
            name: 'Drones',
            prereq: 'Hi-Tech R&D Laboratory'
        },
        {
            name: 'Drones - Assembly',
            prereq: 'Drones'
        },
        {
            name: 'Drones - Transport',
            prereq: 'Drones'
        },
        {
            name: 'Market-TA.I',
            prereq: 'Hi-Tech R&D Laboratory'
        },
        {
            name: 'Market-TA.II',
            prereq: 'Market-TA.I'
        },
        {
            name: 'Self-Correcting Assemblers',
            prereq: 'Hi-Tech R&D Laboratory'
        },
        {
            name: 'uPgrade: Fulcrum',
            prereq: 'Hi-Tech R&D Laboratory'
        },
        {
            name: 'uPgrade: Capacity.I',
            prereq: 'uPgrade: Fulcrum'
        },
        {
            name: 'uPgrade: Capacity.II',
            prereq: 'uPgrade: Capacity.I'
        }
    ]

    const funds = () => ns.corporation.getCorporation().funds;
    const corpProfit = () => ns.corporation.getCorporation().revenue - ns.corporation.getCorporation().expenses;

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
    async function expandToAllCities(div) {
        for (let city of CITIES) {
            if (!ns.corporation.getDivision(div).cities.includes(city)) {
                let cost = ns.corporation.getExpandCityCost();
                await waitForMoney(cost, 'getExpandCityCost');
                ns.corporation.expandCity(div, city);
            }
        }
    }

    /**
     * Wait for corp funds to reach the specified amount
     * 
     * @param {number} amount target money amount
     * @param {string} funcName name of function we're waiting for
     */
    async function waitForMoney(amount, funcName) {
        ns.print(`Waiting for money for: ${funcName}, costs: $${Intl.NumberFormat('en-US').format(amount)}`)
        while (funds() < amount) {
            await ns.sleep(25);
        }
    }

    /**
     * Does some checks for buying an unlock, then buys it
     * 
     * @param {string} name name of one time buy unlock for corp 
     */
    async function buyUnlockUpgrade(name) {
        if (!ns.corporation.hasUnlockUpgrade(name)) {
            let cost = ns.corporation.getUnlockUpgradeCost(name);
            await waitForMoney(cost, 'getUnlockUpgradeCost');
            ns.corporation.unlockUpgrade(name);
        }
    }

    /**
     * Buy warehouse in all cities that don't have one, in the specified division
     * 
     * @param {string} div division name
     */
    async function buyWarehouseAllCities(div) {
        for (let city of CITIES) {
            if (!ns.corporation.hasWarehouse(div, city)) {
                let cost = ns.corporation.getPurchaseWarehouseCost();
                await waitForMoney(cost, 'getPurchaseWarehouseCost');
                ns.corporation.purchaseWarehouse(div, city);
            }
        }
    }

    /**
     * Upgrades the warehouse level in all cities in specified division to target level
     * 
     * @param {string} div division name
     * @param {number} targetLvl target warehouse level
     */
    async function upgrWarehouseAllCities(div, targetLvl) {
        for (let city of CITIES) {
            while (
                ns.corporation.hasWarehouse(div, city) &&
                ns.corporation.getWarehouse(div, city).level < targetLvl
            ) {
                let cost = ns.corporation.getUpgradeWarehouseCost(div, city);
                await waitForMoney(cost, 'getUpgradeWarehouseCost');
                ns.corporation.upgradeWarehouse(div, city);
            }
        }
    }

    /**
     * Turn on smart supply in specified division in all cities
     * 
     * @param {string} div division name
     */
    function enableSmartSupplyAllCities(div) {
        for (let city of CITIES) {
            if (
                ns.corporation.hasWarehouse(div, city) &&
                ns.corporation.hasUnlockUpgrade('Smart Supply') &&
                !ns.corporation.getWarehouse(div, city).smartSupplyEnabled
            )
                ns.corporation.setSmartSupply(div, city, true);
        }
    }

    /**
     * Purchases specified number of new positions in specified division for all cities
     * 
     * @param {string} div division name
     * @param {string[]} cityList list of cities in which to expand offices
     * @param {number} targetPositions target office size
     */
    async function upgradeOffices(div, cityList, targetPositions) {
        for (let city of cityList) {
            let positionsToBuy = targetPositions - ns.corporation.getOffice(div, city).size;
            if (positionsToBuy > 0) {
                let cost = ns.corporation.getOfficeSizeUpgradeCost(div, city, positionsToBuy);
                await waitForMoney(cost, 'getOfficeSizeUpgradeCost');
                ns.corporation.upgradeOfficeSize(div, city, positionsToBuy);
            }
        }
    }

    /**
     * Fill all offices in the specified division with employees
     * 
     * @param {string} div division name 
     */
    function hireEmployeesAllCities(div) {
        const getEmpNum = (city) => ns.corporation.getOffice(div, city).employees.length;
        for (let city of CITIES) {
            let officeSize = ns.corporation.getOffice(div, city).size;
            while (getEmpNum(city) < officeSize) {
                ns.corporation.hireEmployee(div, city);
            }
        }
    }

    /**
     * Buys all provided level upgrades to target level
     * 
     * @param {string[]} upgradeList 
     * @param {number} targetLvl 
     */
    async function levelUpgrades(upgradeList, targetLvl) {
        for (let upgrade of upgradeList) {
            while (ns.corporation.getUpgradeLevel(upgrade) < targetLvl) {
                let cost = ns.corporation.getUpgradeLevelCost(upgrade);
                await waitForMoney(cost, 'getUpgradeLevelCost');
                ns.corporation.levelUpgrade(upgrade);
            }
        }
    }

    /**
     * Phase 1 job assignments
     * 
     * @param {string} div division name
     */
    async function phase1Jobs(div) {
        for (let city of CITIES) {
            if (ns.corporation.getOffice(div, city).employeeJobs.Operations < 1) {
                await ns.corporation.setAutoJobAssignment(div, city, JOBS.ops, 1);
            }
            if (ns.corporation.getOffice(div, city).employeeJobs.Engineer < 1) {
                await ns.corporation.setAutoJobAssignment(div, city, JOBS.eng, 1);
            }
            if (ns.corporation.getOffice(div, city).employeeJobs.Business < 1) {
                await ns.corporation.setAutoJobAssignment(div, city, JOBS.bus, 1);
            }
        }
    }

    /**
     * Phase 2 job assignments
     * 
     * @param {string} div division name
     */
    async function phase2Jobs(div) {
        for (let city of CITIES) {
            if (ns.corporation.getOffice(div, city).employeeJobs.Operations < 2) {
                await ns.corporation.setAutoJobAssignment(div, city, JOBS.ops, 2);
            }
            if (ns.corporation.getOffice(div, city).employeeJobs.Engineer < 2) {
                await ns.corporation.setAutoJobAssignment(div, city, JOBS.eng, 2);
            }
            if (ns.corporation.getOffice(div, city).employeeJobs.Management < 2) {
                await ns.corporation.setAutoJobAssignment(div, city, JOBS.mgmt, 2);
            }
            if (ns.corporation.getOffice(div, city).employeeJobs["Research & Development"] < 2) {
                await ns.corporation.setAutoJobAssignment(div, city, JOBS.rd, 2);
            }
        }
    }

    /**
     * Assign employees to a target level in each relevant job, given a list of cities in a specified division
     * 
     * @param {string} div division name
     * @param {string[]} cityList list of cities in which to assign jobs
     * @param {number} empTarget target level of employees to have in each job
     */
    async function assignJobs(div, cityList, empTarget) {
        for (let city of cityList) {
            let jobs = Object.values(JOBS);
            for (let job of jobs) {
                if (ns.corporation.getOffice(div, city).employeeJobs[job] < empTarget) {
                    await ns.corporation.setAutoJobAssignment(div, city, job, empTarget);
                }
            }
        }
    }

    /**
     * Set the sell parameters for the materials and products that a division produces
     * 
     * @param {object} divObj division object, from DIVS
     */
    function sellDivMatsAndProducts(divObj) {
        let div = divObj.name;
        if (divObj.prodMats.length > 0) {
            for (let city of CITIES) {
                for (let mat of divObj.prodMats) {
                    ns.corporation.sellMaterial(div, city, mat, 'MAX', 'MP');
                    if (ns.corporation.hasResearched(div, 'Market-TA.II')) {
                        ns.corporation.setMaterialMarketTA2(div, city, mat, true);
                    }
                }
            }
        }
        if (divObj.makesProducts) {
            for (let prod of ns.corporation.getDivision(div).products) {
                if (ns.corporation.getProduct(div, prod).developmentProgress >= 100) {
                    ns.corporation.sellProduct(div, 'Aevum', prod, 'MAX', 'MP', true);
                    if (ns.corporation.hasResearched(div, 'Market-TA.II')) {
                        ns.corporation.setProductMarketTA2(div, prod, true);
                    }
                }
            }
        }
    }

    /**
     * Equivalent to bulk purchase research later on, allows one time purchase  of items
     * 
     * @param {string} divName division name 
     * @param {object[]} targetInvList array of material objects, with target inventory levels
     */
    async function oneTimeBuyAllCities(divName, targetInvList) {
        for (let city of CITIES) {
            for (let item of targetInvList) {
                ns.corporation.buyMaterial(divName, city, item.name, item.perScnd);
                while (ns.corporation.getMaterial(divName, city, item.name).qty < item.target) {
                    await ns.sleep(25);
                }
                ns.corporation.buyMaterial(divName, city, item.name, 0);
            }
        }
    }

    /**
     * Attempts to make a product. If product limit is reached, gets lowest price product, deletes it,
     * then starts a new product.
     * 
     * @param {string} div division name
     */
    async function attemptMakeProd(div) {
        const getProducts = () => ns.corporation.getDivision(div).products;
        const allProdDone = () => getProducts().every(x => ns.corporation.getProduct(div, x).developmentProgress >= 100);
        const getProdName = () => Math.trunc(Math.random() * 1e6);
        const getLowestRatedProd = () => {
            let lowestRat = Infinity;
            let lowestProd;
            for (let prod of getProducts()) {
                let rat = ns.corporation.getProduct(div, prod).rat;
                if (rat < lowestRat) {
                    lowestRat = rat;
                    lowestProd = prod;
                }
            }
            return lowestProd;
        }

        let productLimit = 3;
        let invest = 1e9;

        if (ns.corporation.hasResearched(div, 'uPgrade: Capacity.I')) {
            productLimit++;
            if (ns.corporation.hasResearched(div, 'uPgrade: Capacity.II')) {
                productLimit++;
            }
        }

        if (allProdDone() && getProducts().length == productLimit) {
            let worstProd = await getLowestRatedProd();
            ns.corporation.discontinueProduct(div, worstProd);
        }

        if (allProdDone() && getProducts().length < productLimit) {
            await waitForMoney(invest * 2, 'makeProduct');
            ns.corporation.makeProduct(div, 'Aevum', getProdName(), invest, invest);
        }
    }

    /**
     * Cycles through each of the unlockable upgrades and attempts to buy them
     */
    function attemptUnlockUpgrade() {
        for (let upgrade of UNLOCK_UPGRADES) {
            if (
                !ns.corporation.hasUnlockUpgrade(upgrade)
                && funds() >= ns.corporation.getUnlockUpgradeCost(upgrade)
            ) {
                ns.corporation.unlockUpgrade(upgrade);
            }
        }
    }

    /**
     * Attempts to buy all relevant research for specified division
     * 
     * @param {string} div division name
     */
    function attemptBuyResearch(div) {
        const getResearch = () => ns.corporation.getDivision(div).research;
        const researchCheck = (research) => {
            if (ns.corporation.getDivision(div).makesProducts) {
                return !ns.corporation.hasResearched(div, research)
                    && getResearch() >= (70000 + ns.corporation.getResearchCost(div, research));
            } else {
                if (research.includes('uPgrade')) {
                    return false;
                } else {
                    return !ns.corporation.hasResearched(div, research)
                        && getResearch() >= (70000 + ns.corporation.getResearchCost(div, research));
                }
            }
        }

        for (let research of RESEARCH) {
            if (
                (research.prereq === 'none' || ns.corporation.hasResearched(div, research.prereq))
                && researchCheck(research.name)
            ) {
                ns.corporation.research(div, research.name)
            }
        }
    }

    /**
     * Automatically tell the HNSpend.js script what to spend hashes on
     */
    function assignHashSpend() {
        let spend = ns.corporation.getCorporation().divisions.some(x => x.makesProducts)
            && corpProfit() > 10e6 ? 'corpr' : 'corpf';
        if (!ns.isRunning('HNSpend.js', 'home', spend)) {
            if (ns.scriptRunning('HNSpend.js', 'home')) {
                ns.scriptKill('HNSpend.js', 'home');
            }
            ns.run('HNSpend.js', 1, spend);
        }
    }

    /**
     * Waits one cycle of START, PURCHASE, PRODUCTION, SALE, EXPORT
     */
    async function waitOneCorpCycle() {
        const getState = () => ns.corporation.getCorporation().state;
        let origState = getState();

        while (getState() === origState) {
            await ns.sleep(25);
        }

        while (getState() !== origState) {
            await ns.sleep(25);
        }
    }

    /**
     * Gets the name of the lowest valued product in the specified division
     * 
     * @param {string} div divison name
     * @returns lowest valued product
     */
    async function getWorstProd(div) {
        let products = ns.corporation.getDivision(div).products;
        let lowestVal = Infinity;
        let lowestProd;
        for (let prod of products) {
            ns.corporation.limitProductProduction(div, 'Sector-12', prod, 0);
            await waitOneCorpCycle();
            ns.corporation.limitProductProduction(div, 'Sector-12', prod, -1);
            latestDif = ns.corporation.getDivision(div).lastCycleRevenue - ns.corporation.getDivision(div).thisCycleRevenue;
            if (latestDif < lowestVal) {
                lowestVal = latestDif;
                lowestProd = prod;
            }
        }
        return lowestProd;
    }

    /**
     * Initial Setup
     * 
     * Pick a name and choose to Expand right out of the gate… you don’t have anything yet,
     * so expansion is how you make your first Agriculture division!
     */

    if (!ns.getPlayer().hasCorporation) {
        if (ns.getPlayer().bitNodeN === 3) {
            ns.corporation.createCorporation(CORP_NAME, false);
        } else {
            await waitForMoney(1e9, 'createCorporation');
            ns.corporation.createCorporation(CORP_NAME);
        }
    }

    assignHashSpend();

    if (funds() >= ns.corporation.getExpandIndustryCost(DIVS.agro.industry) && !divExists(DIVS.agro.name)) {
        ns.corporation.expandIndustry(DIVS.agro.industry, DIVS.agro.name);
    }

    /**
     * Once you’ve got a brand-new division, the first step is to buy Smart Supply,
     * which will keep you topped up on materials you need to do business. Speaking of
     * which, you’ll have to Configure said Smart Supply on the Sector-12 office tab and enable it for it to keep you flush.
     * Next, you’ll want to start Expanding to offices in different cities. After buying each,
     * Hire 3 Employees for that office, one in each of the essential positions: Operations, Engineer, and Business.
     */
    await expandToAllCities(DIVS.agro.name);

    await buyUnlockUpgrade('Warehouse API');
    await buyUnlockUpgrade('Office API');
    await buyUnlockUpgrade('Smart Supply');

    await buyWarehouseAllCities(DIVS.agro.name);
    enableSmartSupplyAllCities(DIVS.agro.name);
    hireEmployeesAllCities(DIVS.agro.name, 3);

    await phase1Jobs(DIVS.agro.name);

    /**
     * When you’re spread across the map and staffed, splurge on a single AdVert.Inc
     * purchase to get the word out that you’re in town… all of them. This will
     * increase Awareness and Popularity, which help you sell materials and later, products.
     */
    if (ns.corporation.getHireAdVertCount(DIVS.agro.name) < 1) {
        ns.corporation.hireAdVert(DIVS.agro.name);
    }

    /**
     * Upgrade each office’s Storage to 300 (two successive upgrades) and start selling
     * your Plants and Food. To do that, click Sell (0.000/0.000) to open the selling dialog,
     * which you can study at your leisure, then pick a sell amount and sell price.
     * I’d suggest starting with MAX for Sell amount and MP (market price) for the Sell
     * price, but this is your corporation, you run it how you want! After a tick, it should
     * change to say something like Sell (69.420/MAX) @$3.210k, indicating that you’re selling
     * 69.420 items per second (out of whatever MAX happens to be now), at $3.210k per unit. Great!
     */
    await upgrWarehouseAllCities(DIVS.agro.name, 3);
    sellDivMatsAndProducts(DIVS.agro);

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
    let upgradeList = [
        'FocusWires',
        'Neural Accelerators',
        'Speech Processor Implants',
        'Nuoptimal Nootropic Injector Implants',
        'Smart Factories'
    ]
    await levelUpgrades(upgradeList, 2);

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
    let targetInvList = [
        {
            name: 'Hardware',
            target: 125,
            perScnd: 12.5
        },
        {
            name: 'AI Cores',
            target: 75,
            perScnd: 7.5
        },
        {
            name: 'Real Estate',
            target: 27000,
            perScnd: 2700
        }
    ];
    await oneTimeBuyAllCities(DIVS.agro.name, targetInvList);

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
    // ns.corporation.acceptInvestmentOffer();

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
    await upgradeOffices(DIVS.agro.name, CITIES, 9);
    hireEmployeesAllCities(DIVS.agro.name)
    await phase2Jobs(DIVS.agro.name);

    /**
     * Upgrade each of Smart Factories and Smart Storage to level 10 to increase productivity and
     * give your offices more room to store all the new stuff. This should leave you with about $110b.
     * 
     * Upgrade Warehouse Sizes directly 7 times for each office, for a new grand total storage of 2k at
     * all locations, leaving around $45b to work with. Now to use some of that new space!
     */
    upgradeList = [
        'Smart Factories',
        'Smart Storage'
    ];
    await levelUpgrades(upgradeList, 10);
    await upgrWarehouseAllCities(DIVS.agro.name, 10);

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
    targetInvList = [
        {
            name: 'Hardware',
            target: 2800,
            perScnd: 267.5
        },
        {
            name: 'Robots',
            target: 96,
            perScnd: 9.6
        },
        {
            name: 'AI Cores',
            target: 2520,
            perScnd: 244.5
        },
        {
            name: 'Real Estate',
            target: 146400,
            perScnd: 11940
        }
    ];
    await oneTimeBuyAllCities(DIVS.agro.name, targetInvList);
    // ns.corporation.acceptInvestmentOffer();

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
    await upgrWarehouseAllCities(DIVS.agro.name, 19);
    targetInvList = [
        {
            name: 'Hardware',
            target: 9300,
            perScnd: 650
        },
        {
            name: 'Robots',
            target: 726,
            perScnd: 63
        },
        {
            name: 'AI Cores',
            target: 6270,
            perScnd: 375
        },
        {
            name: 'Real Estate',
            target: 230400,
            perScnd: 8400
        }
    ];
    await oneTimeBuyAllCities(DIVS.agro.name, targetInvList);

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
    if (!divExists(DIVS.tobac.name)) {
        let cost = ns.corporation.getExpandIndustryCost(DIVS.tobac.industry);
        await waitForMoney(cost, 'getExpandIndustryCost');
        ns.corporation.expandIndustry(DIVS.tobac.industry, DIVS.tobac.name);
    }

    /**
     * Expand first to Aevum, then to all other cities. In Aevum, Upgrade the Size
     * of the office to 30 employees and hire enough folks to have 6 of each type
     * of employee except Training. As you expand to every other branch, keep the
     * same 9 employees in their same roles as before.
     */
    await expandToAllCities(DIVS.tobac.name);
    await buyWarehouseAllCities(DIVS.tobac.name);
    enableSmartSupplyAllCities(DIVS.tobac.name);
    await upgradeOffices(DIVS.tobac.name, CITIES, 9);
    await upgradeOffices(DIVS.tobac.name, ['Aevum'], 30);
    hireEmployeesAllCities(DIVS.tobac.name);

    await phase1Jobs(DIVS.tobac.name);
    await phase2Jobs(DIVS.tobac.name);
    await assignJobs(DIVS.tobac.name, ['Aevum'], 6);

    /**
     * When everyone is up and running, pop into the Aevum office and click Create Product.
     * Have a read of the product creation dialog if desired, then choose Aevum (duh), name
     * it something like “Tobacco v1” (or a more creative name) and set it up for $1b in
     * each of Design investment and Marketing investment, then click Develop Product. This
     * will take some time; you can monitor the process at the bottom of the materials and
     * products list in an office with a warehouse set up (right off the bat this will only
     * be Sector-12 if you don’t expand and set them up first).
     */
    await attemptMakeProd(DIVS.tobac.name);

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
    upgradeList = [
        'FocusWires',
        'Neural Accelerators',
        'Speech Processor Implants',
        'Nuoptimal Nootropic Injector Implants'
    ];
    await levelUpgrades(upgradeList, 20);

    /**
     * When v1 completes, set its sell amount to MAX, and its price to MP. Set it the
     * same for all cities for now. If you see it constantly selling 100%, try multiplying
     * MP by increasing integers until it doesn’t, then drop back down by 1 (i.e., when you
     * have stock sitting in the warehouse, the price is too high, so reduce it). When
     * you’re feeling froggy, leap into “Tobacco v2”, with the same setup as v1, and then
     * do it again for v3 when ready. During this process, don’t spend Scientific Research!
     * Your tobacco products will benefit in a huge way from stockpiled research, so each
     * version will be better than the last!
     * 
     * If you haven’t already, expand to all cities, then hire employees up to 60 in
     * Aevum primarily, but do hire at each office eventually. Feel free to let Aevum
     * be your hiring focus indefinitely though; it needs the employees for continuing
     * design work, while other cities will simply produce and sell a bit more if you
     * staff them. It’s not nothing, but better products will sell better on their own
     * so it’s more of a “sprinkles on the sundae” situation.
     * 
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

    // main loop
    while (true) {
        if (funds() >= ns.corporation.getUpgradeLevelCost('Wilson Analytics')) {
            ns.corporation.levelUpgrade('Wilson Analytics');
        }

        attemptUnlockUpgrade();

        assignHashSpend();

        for (let div in DIVS) {
            let divObject = DIVS[div];
            let divName = divObject.name;
            let divInd = divObject.industry;

            // create it if it doesn't exist, and we can afford it
            if (
                !divExists(divName)
                && funds() >= ns.corporation.getExpandIndustryCost(divInd) + 2e12
                // arbitrary amount added to make sure we have money for new offices & warehouses
            ) {
                ns.corporation.expandIndustry(divInd, divName);
            }

            // if it exists, do all the checks
            if (divExists(divName)) {
                await expandToAllCities(divName);
                await buyWarehouseAllCities(divName);
                await upgrWarehouseAllCities(divName, 20); // should give 4400 storage
                enableSmartSupplyAllCities(divName);
                attemptBuyResearch(divName);
                sellDivMatsAndProducts(divObject);
                if (divObject.makesProducts) {
                    await attemptMakeProd(divName);
                }
                if (CITIES.some(city => ns.corporation.getOffice(divName, city).size < 60)) {
                    await upgradeOffices(divName, CITIES, 60);
                }
                hireEmployeesAllCities(divName);
                // special circumstances for tobacco div, keep increasing this to the sky for cheevo
                if (divName == DIVS.tobac.name) {
                    if (funds() >= ns.corporation.getOfficeSizeUpgradeCost(divName, 'Aevum', 15)) {
                        ns.corporation.upgradeOfficeSize(divName, 'Aevum', 15);
                        hireEmployeesAllCities(divName);
                    }
                    for (let city of CITIES) {
                        await assignJobs(divName, [city], (ns.corporation.getOffice(divName, city,).size / 5));
                    }
                } else {
                    await assignJobs(divName, CITIES, 12);
                }
                // hire an advert, if we can
                if (
                    funds() >= ns.corporation.getHireAdVertCost(divName)
                    && ns.corporation.getDivision(divName).popularity < 1.7e308 // supposedly the hard limit for popularity
                ) {
                    if (divObject.makesProducts) {
                        ns.corporation.hireAdVert(divName);
                    } else if (ns.corporation.getHireAdVertCount(divName) < 100) {
                        ns.corporation.hireAdVert(divName);
                    }

                }
                // go public if profit greater than 1t/s, set dividends to 10%
                if (
                    corpProfit() > 1e12
                    && !ns.corporation.getCorporation().public
                ) {
                    ns.corporation.goPublic(1e6);
                    ns.corporation.issueDividends(0.1);
                }
            }
        }
        await ns.sleep(25);
    }
}