/** @param {import(".").NS } ns */
export async function main(ns) {

    /**
     * Get original tasks of members, used to revert change to Territory Warfare later on
     * 
     * @returns Object where property is member, value is task
     */
    function getOrigTasksObj() {
        let origTasks = {};
        ns.gang.getMemberNames().forEach(
            member => {
                origTasks[member] = ns.gang.getMemberInformation(member).task;
            }
        )
        return origTasks;
    }

    /**
     * Sets all members tasks using passed task Obj
     * 
     * @param {string} tasksObj Property is member, value is task
     */
    function setAllTask(tasksObj) {
        let gangMems = ns.gang.getMemberNames();
        gangMems.forEach(
            member => {
                ns.gang.setMemberTask(member, tasksObj[member]);
            }
        )
    }

    /**
     * Switch to Territory Warfare right before tick, then switch back right after tick.
     * This maximizes profit, and points entire gang at Territory Warfare, only when needed
     * 
     * @param {object} origTasks Object of member's original tasks
     */
    async function switchToWarfare(origTasks) {
        let power = ns.gang.getGangInformation().power;
        while (ns.gang.getGangInformation().territory < 1) {
            ns.gang.getMemberNames().forEach(
                member => {
                    ns.gang.setMemberTask(member, 'Territory Warfare');
                }
            )
            // poll for tick
            while (power == ns.gang.getGangInformation().power) {
                await ns.sleep(25);
            }
            // tick should happen by this point
            power = ns.gang.getGangInformation().power;
            // return each member to original task
            ns.gang.getMemberNames().forEach(
                member => {
                    ns.gang.setMemberTask(member, origTasks[member]);
                }
            )
            await ns.sleep(19.5 * 1e3);
        }
        await ns.sleep(25);
    }

    let origTasks = getOrigTasksObj();
    ns.atExit(() => setAllTask(origTasks));

    await switchToWarfare(origTasks);
}