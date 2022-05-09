/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();

	var RAM = "GiB RAM";
	var cost = "Cost";
	var tier = "Tier";

	var RAMPad = 9;
	var costPad = 20;
	var tierPad = 4;

	ns.print(
		"┌".padEnd(tierPad + 1, '─') +
		"┬".padEnd(costPad + 1, '─') +
		"┬".padEnd(RAMPad + 1, '─') + "┐"
	);

	ns.print(
		"│" + tier.padEnd(tierPad, ' ') +
		"│" + cost.padEnd(costPad, ' ') +
		"│" + RAM.padEnd(RAMPad, ' ') + "│"
	);

	ns.print(
		"├".padEnd(tierPad + 1, '─') +
		"┼".padEnd(costPad + 1, '─') +
		"┼".padEnd(RAMPad + 1, '─') + "┤"
	);

	for (let i = 1; i <= 20; i++) {
		ns.print(
			"│" + i.toString().padStart(tierPad, ' ') +
			"│" + ("$" + Intl.NumberFormat('en-US').format(Math.ceil(ns.getPurchasedServerCost(2 ** i)))).padStart(costPad, ' ') +
			"│" + Intl.NumberFormat('en-US').format(2 ** i).padStart(RAMPad, ' ') + "│"
		);
	}
	
	ns.print(
		"└".padEnd(tierPad + 1, '─') +
		"┴".padEnd(costPad + 1, '─') +
		"┴".padEnd(RAMPad + 1, '─') + "┘"
	);
}