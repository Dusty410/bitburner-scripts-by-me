/** @param {NS} ns */
export async function main(ns) {

	function GetNodeCost () {
		ns.tprint("max nodes: " + ns.hacknet.maxNumNodes());
	}

	GetNodeCost();

	// max level 200
	// max RAM 64 GiB
	// max cores 16
}