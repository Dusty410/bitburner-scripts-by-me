/** @param {import(".").NS } ns */
export async function main(ns) {
    // only relevant actions
    const FIELD_ANALYSIS = { type: 'General', name: 'Field Analysis' };
    const TRACKING = { type: 'Contracts', name: 'Tracking' };
    const INVESTIGATION = { type: 'Operations', name: 'Investigation' };
    const ASSASSINATION = { type: 'Operations', name: 'Assassination' };

    const CHANCE_LMT = 0.8;

    const RELEVANT_SKILLS = ['Blade\'s Intuition', 'Cloak', 'Short-Circuit', 'Digital Observer', 'Tracer',
        'Overclock', 'Reaper', 'Evasive System', 'Hyperdrive'];
    const SKILLS_TO_MAX = ['Blade\'s Intuition', 'Digital Observer', 'Reaper', 'Evasive System'];

    const CITIES = ['Sector-12', 'Aevum', 'Volhaven', 'Chongqing', 'New Tokyo', 'Ishima'];

    let getStam = () => ns.bladeburner.getStamina()[0];
    let maxStam = () => Math.floor(ns.bladeburner.getStamina()[1]);
    let halfStam = () => Math.ceil(maxStam() / 2);
    let actionSuccess = (action) => ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name)[1];
    let doingBlackOp = () => ns.bladeburner.getBlackOpNames().includes(ns.bladeburner.getCurrentAction().name);
    let getHighestSkillLevel = () => Math.max(...SKILLS_TO_MAX.map(ns.bladeburner.getSkillLevel));
    let getLowestSkillLevel = () => Math.min(...SKILLS_TO_MAX.map(ns.bladeburner.getSkillLevel));
    let isGoodCity = (city) => ns.bladeburner.getCityEstimatedPopulation(city) > 1e9;

    function updateSkills() {
        let level = getHighestSkillLevel();
        if (getHighestSkillLevel() == getLowestSkillLevel()) {
            level++;
        }

        if (actionSuccess(ASSASSINATION) > 0.9 && ns.bladeburner.getSkillLevel('Overclock') < 90) {
            ns.bladeburner.upgradeSkill('Overclock');
        } else {
            for (let i in RELEVANT_SKILLS) {
                let current = RELEVANT_SKILLS[i];
                if (ns.bladeburner.getSkillLevel(current) < level
                    && ns.bladeburner.getSkillUpgradeCost(current) <= ns.bladeburner.getSkillPoints()
                ) {
                    switch (current) {
                        case 'Blade\'s Intuition':
                        case 'Digital Observer':
                        case 'Reaper':
                        case 'Evasive System':
                            ns.bladeburner.upgradeSkill(current);
                            break;
                        case 'Cloak':
                        case 'Short-Circuit':
                            if (ns.bladeburner.getSkillLevel(current) < 25) {
                                ns.bladeburner.upgradeSkill(current);
                            }
                            break;
                        case 'Tracer':
                            if (ns.bladeburner.getSkillLevel(current) < 10) {
                                ns.bladeburner.upgradeSkill(current);
                            }
                            break;
                        case 'Hyperdrive':
                            if (ns.bladeburner.getSkillLevel(current) < 20) {
                                ns.bladeburner.upgradeSkill(current);
                            }
                    }
                }
            }
        }
    }

    // switch cities if pop less than 1 billion
    function tryCitySwitch() {
        let goodCities = CITIES.filter(isGoodCity);
        // jump to good city at random, if not in a good one
        if (!goodCities.includes(ns.bladeburner.getCity()) && goodCities.length > 0) {
            ns.bladeburner.switchCity(goodCities[Math.floor(Math.random() * goodCities.length)]);
        }
    }

    function getHighAction() {
        if (actionSuccess(INVESTIGATION) < CHANCE_LMT && actionSuccess(ASSASSINATION) < CHANCE_LMT) {
            return TRACKING;
        }

        if (actionSuccess(INVESTIGATION) >= CHANCE_LMT && actionSuccess(ASSASSINATION) < CHANCE_LMT) {
            return INVESTIGATION;
        }

        if (actionSuccess(ASSASSINATION) >= CHANCE_LMT) {
            return ASSASSINATION;
        }
    }

    function tryBlackOp() {
        let blackOps = ns.bladeburner.getBlackOpNames();
        for (let i in blackOps) {
            let current = blackOps[i];
            let checkBlackOp = [];
            checkBlackOp.push(ns.bladeburner.getRank() >= ns.bladeburner.getBlackOpRank(current));
            checkBlackOp.push(actionSuccess({ type: 'Operation', name: current }) >= CHANCE_LMT)
            checkBlackOp.push(!doingBlackOp());
            checkBlackOp.push(current != 'Operation Daedalus');
            if (checkBlackOp.every(x => x)) {
                ns.bladeburner.startAction('Operation', current);
            }
        }
    }

    // starting actions
    let highAction = getHighAction();
    let lowAction = FIELD_ANALYSIS;

    // main loop
    while (true) {
        // try to join the bladeburner faction
        if (ns.bladeburner.getRank() > 25) {
            ns.bladeburner.joinBladeburnerFaction();
        }

        // start low stam action
        let checkLow = [];
        checkLow.push(getStam() <= halfStam() || ns.bladeburner.getActionCountRemaining(highAction.type, highAction.name) == 0);
        checkLow.push(ns.bladeburner.getCurrentAction().name != lowAction.name);
        checkLow.push(!doingBlackOp());
        if (checkLow.every(x => x)) {
            ns.bladeburner.startAction(lowAction.type, lowAction.name);
        }

        // start high stam action
        let checkHigh = [];
        checkHigh.push(getStam() >= maxStam());
        checkHigh.push(ns.bladeburner.getCurrentAction().name != highAction.name);
        checkHigh.push(ns.bladeburner.getActionCountRemaining(highAction.type, highAction.name) > 0);
        checkHigh.push(!doingBlackOp());
        if (checkHigh.every(x => x)) {
            ns.bladeburner.startAction(highAction.type, highAction.name);
        }

        // check if current highAction should be updated and started
        let checkInterrupt = [];
        checkInterrupt.push(getStam() >= halfStam());
        checkInterrupt.push(getStam < maxStam());
        checkInterrupt.push(getHighAction().name != highAction.name);
        checkInterrupt.push(ns.bladeburner.getCurrentAction().name != lowAction.name);
        checkInterrupt.push(!doingBlackOp());
        if (checkInterrupt.every(x => x)) {
            highAction = getHighAction();
            ns.bladeburner.startAction(highAction.type, highAction.name);
        }

        updateSkills();

        tryCitySwitch();

        tryBlackOp();

        await ns.sleep(1 * 1e3);
    }
}


/**
 * Blade's Intuition - max
 * Cloak - limit 25
 * Short-Circuit - limit 25
 * Digital Observer - max
 * Tracer - limit 10
 * Overclock - wait til Assassination is ~90%, then max
 * Reaper - max
 * Evasive System - max
 * Hyperdrive - limit 20
 * 
 * rank 400,000 for final black ops
 * 
 * 
 * only tasks we care about:
 * 
 * General:
 * Field Analysis
 * 
 * Contracts:
 * Tracking
 * 
 * Operations:
 * Investigation
 * Assassination
 */