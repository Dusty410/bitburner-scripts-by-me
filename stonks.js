/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog('ALL');
    ns.clearLog();
    
    var stockList = ns.stock.getSymbols();
    for (let stock of stockList) {
        ns.stock.getVolatility
        
    }
}

// $100,000 commission fee for every transaction
// Stock prices are updated every ~6 seconds.