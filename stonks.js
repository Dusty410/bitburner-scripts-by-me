/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();
	
	var stonk_list = ns.stock.getSymbols();
	for (let i in stonk_list) {
		var current = stonk_list[i];
		ns.stock.getVolatility
		
	}
}

// $100,000 commission fee for every transaction
// Stock prices are updated every ~6 seconds.