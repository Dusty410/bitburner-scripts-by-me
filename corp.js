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

    ==Ad values from the Discord server==
    Using Awareness: 1.7976931348623157e+308 and Popularity: 1.7976931348623157e+308 (both are max-value)
    Max Advertising Multipliers for:
    Agriculture: x914788419353586565120.000
    Chemical: x4.811839707320989e+36
    Computer: x1.2179032708051464e+89
    Energy: x8.368378521834333e+41
    Fishing: x8.368378521834333e+41
    Food: x1.01918755730774e+131
    Healthcare: x4.401815240042955e+57
    Mining: x2.7668205146957528e+31
    Pharmaceutical: x7.00297590846982e+83
    Real Estate: x1.01918755730774e+131
    Robotics: x2.118082935632901e+94
    Software: x7.00297590846982e+83
    Tobacco: x6.406241262080406e+104
    Utilities: x8.368378521834333e+41

    Actual Peak multiplier is higher; when Popularity is e308, but Awareness is less, you have a Ratio 
    Multiplier that improves this.  But it's easier to just spam Adverts...

    So, highest values are Food and Real Estate, at 1.02e131.
    Worst is Agriculture, at 9.1e20
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
    ];

    // const funds = () => ns.corporation.getCorporation().funds;
    // const corpProfit = () => ns.corporation.getCorporation().revenue - ns.corporation.getCorporation().expenses;

    /**
     * Get current corp funds
     * 
     * @returns current corp funds
     */
    function funds() {
        return ns.corporation.getCorporation().funds;
    }

    /**
     * Gets current corp profit
     * 
     * @returns current corp profit
     */
    function corpProfit() {
        return ns.corporation.getCorporation().revenue - ns.corporation.getCorporation().expenses;
    }

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

    // setup begins
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

    await expandToAllCities(DIVS.agro.name);

    await buyUnlockUpgrade('Warehouse API');
    await buyUnlockUpgrade('Office API');
    await buyUnlockUpgrade('Smart Supply');

    await buyWarehouseAllCities(DIVS.agro.name);
    enableSmartSupplyAllCities(DIVS.agro.name);
    hireEmployeesAllCities(DIVS.agro.name, 3);

    await phase1Jobs(DIVS.agro.name);

    if (ns.corporation.getHireAdVertCount(DIVS.agro.name) < 1) {
        ns.corporation.hireAdVert(DIVS.agro.name);
    }

    await upgrWarehouseAllCities(DIVS.agro.name, 3);
    sellDivMatsAndProducts(DIVS.agro);

    let upgradeList = [
        'FocusWires',
        'Neural Accelerators',
        'Speech Processor Implants',
        'Nuoptimal Nootropic Injector Implants',
        'Smart Factories'
    ]
    await levelUpgrades(upgradeList, 2);

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

    // ns.corporation.acceptInvestmentOffer();

    await upgradeOffices(DIVS.agro.name, CITIES, 9);
    hireEmployeesAllCities(DIVS.agro.name)
    await phase2Jobs(DIVS.agro.name);

    upgradeList = [
        'Smart Factories',
        'Smart Storage'
    ];
    await levelUpgrades(upgradeList, 10);
    await upgrWarehouseAllCities(DIVS.agro.name, 10);

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

    if (!divExists(DIVS.tobac.name)) {
        let cost = ns.corporation.getExpandIndustryCost(DIVS.tobac.industry);
        await waitForMoney(cost, 'getExpandIndustryCost');
        ns.corporation.expandIndustry(DIVS.tobac.industry, DIVS.tobac.name);
    }

    await expandToAllCities(DIVS.tobac.name);
    await buyWarehouseAllCities(DIVS.tobac.name);
    enableSmartSupplyAllCities(DIVS.tobac.name);
    await upgradeOffices(DIVS.tobac.name, CITIES, 9);
    await upgradeOffices(DIVS.tobac.name, ['Aevum'], 30);
    hireEmployeesAllCities(DIVS.tobac.name);

    await phase1Jobs(DIVS.tobac.name);
    await phase2Jobs(DIVS.tobac.name);
    await assignJobs(DIVS.tobac.name, ['Aevum'], 6);

    await attemptMakeProd(DIVS.tobac.name);

    upgradeList = [
        'FocusWires',
        'Neural Accelerators',
        'Speech Processor Implants',
        'Nuoptimal Nootropic Injector Implants'
    ];
    await levelUpgrades(upgradeList, 20);

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
            // if (
            //     !divExists(divName)
            //     && funds() >= ns.corporation.getExpandIndustryCost(divInd) + 2e12
            //     // arbitrary amount added to make sure we have money for new offices & warehouses
            // ) {
            //     ns.corporation.expandIndustry(divInd, divName);
            // }

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