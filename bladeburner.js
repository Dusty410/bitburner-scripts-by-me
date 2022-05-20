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
    let actionSuccess = (action) => ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name);
    let doingBlackOp = () => ns.bladeburner.getBlackOpNames().includes(ns.bladeburner.getCurrentAction().name);
    let getHighestSkillLevel = () => Math.max(...SKILLS_TO_MAX.map(ns.bladeburner.getSkillLevel));
    let getLowestSkillLevel = () => Math.min(...SKILLS_TO_MAX.map(ns.bladeburner.getSkillLevel));
    let isGoodCity = (city) => ns.bladeburner.getCityEstimatedPopulation(city) > 1e9;

    function updateSkills() {
        let level = getHighestSkillLevel();
        let lowestSkill = getLowestSkillLevel();
        let highestSkill = getHighestSkillLevel();
        let allSkills = ns.bladeburner.getSkillNames();
        if (getHighestSkillLevel() == getLowestSkillLevel()) {
            level++;
        }

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
                        break;
                    case 'Overclock':
                        if (actionSuccess(ASSASSINATION) > 0.9 && ns.bladeburner.getSkillLevel(current) < 90) {
                            ns.bladeburner.upgradeSkill(current);
                        }
                }
            }
        }
    }

    // switch cities if pop less than 1e9
    function tryCitySwitch() {
        let goodCities = CITIES.filter(isGoodCity);
        // jump to good city at random, if not in a good one
        if (!goodCities.includes(ns.bladeburner.getCity())) {
            ns.bladeburner.switchCity(goodCities[Math.floor(Math.random() * goodCities.length)]);
        }
    }

    // starting actions
    let highAction = TRACKING;
    let lowAction = FIELD_ANALYSIS;

    // main loop
    while (true) {

        // start low stam action
        if (getStam() <= halfStam() && ns.bladeburner.getCurrentAction().name != lowAction.name) {
            ns.bladeburner.startAction(lowAction.type, lowAction.name);
        }

        // start high stam action
        if (getStam() >= maxStam() && ns.bladeburner.getCurrentAction().name != highAction.name) {
            ns.bladeburner.startAction(highAction.type, highAction.name);
        }

        // if chances are good, start investigation
        if (actionSuccess(INVESTIGATION) > CHANCE_LMT
            && ns.bladeburner.getCurrentAction().name != ASSASSINATION.name
            && ns.bladeburner.getCurrentAction().name != INVESTIGATION.name
            && !doingBlackOp()
        ) {
            highAction = INVESTIGATION;
        }

        // if chances are good, start assassination
        if (actionSuccess(ASSASSINATION) > CHANCE_LMT
            && ns.bladeburner.getCurrentAction().name != ASSASSINATION.name
            && !doingBlackOp()
        ) {
            highAction = ASSASSINATION;
        }

        updateSkills();

        tryCitySwitch();

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