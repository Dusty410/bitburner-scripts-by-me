/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.tail();
    ns.disableLog('sleep');
    ns.clearLog();
    
    let stockList = ns.stock.getSymbols();
    for (let stock of stockList) {
        
        
    }
}

// $100,000 commission fee for every transaction
// Stock prices are updated every ~6 seconds.