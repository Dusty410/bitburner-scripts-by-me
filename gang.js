/** @param {import(".").NS } ns */
export async function main(ns) {
    function shouldAscend(gangMem) {
        let gangInfo = ns.gang.getMemberInformation(gangMem);
         
        
    }

    function allEquipCost(gangMem) {
        let equipCost = 0;
        let equipList = ns.gang.getEquipmentNames();
        for (let i in equipList) {
            let equip = equipList[i];
            equipCost += ns.gang.getEquipmentCost(equip);
            
        }
        return equipCost;
    }

    while (true) {
        if (ns.gang.canRecruitMember()) {
            ns.gang.recruitMember(Math.random());
        }
    }
}