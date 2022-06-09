/** @param {import(".").NS } ns */
export async function main(ns) {

    /**
     * Sanitize Parentheses in Expression
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * Given the following string:
     * 
     * <data>
     * 
     * remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways 
     * to validate the string, provide all of the possible results. The answer should be provided as an array of strings. 
     * If it is impossible to validate the string the result should be an array with only an empty string.
     * 
     * IMPORTANT: The string may contain letters, not just parentheses. Examples:
     * "()())()" -> [()()(), (())()]
     * "(a)())()" -> [(a)()(), (a())()]
     * ")(" -> [""]
     * 
     * @param {string} data 
     */
    function sanitizeParen(data) {

    }

    /**
     * Array Jumping Game
     * You are attempting to solve a Coding Contract. You have 1 tries remaining, after which the contract will self-destruct.
     * 
     * You are given the following array of integers:
     * 
     * <data>
     * 
     * Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at 
     * position i and your maximum jump length is n, you can jump to any position from i to i+n.
     * 
     * Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.
     * 
     * Your answer should be submitted as 1 or 0, representing true and false respectively
     * 
     * @param {number[]} data
     */
    function arrayJumpGame(data) {

    }

    /**
     * Compression I: RLE Compression
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of a repeated single
     * character. Runs are encoded as a length, followed by the character itself. Lengths are encoded as a single ASCII digit;
     * runs of 10 characters or more are encoded by splitting them into multiple runs.
     * 
     * You are given the following input string:
     *     <data>
     * Encode it using run-length encoding with the minimum possible output length.
     * 
     * Examples:
     *     aaaaabccc            ->  5a1b3c
     *     aAaAaA               ->  1a1A1a1A1a1A
     *     111112333            ->  511233
     *     zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
     * 
     * @param {string} data
     */
    function compr1(data) {

    }

    /**
     * Compression III: LZ Compression
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of 
     * the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded 
     * as a single ASCII digit from 1 - 9, followed by the chunk data, which is either:
     * 
     * 1. Exactly L characters, which are to be copied directly into the uncompressed data.
     * 2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII 
     * digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.
     * 
     * For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start 
     * of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.
     * 
     * You are given the following input string:
     *     <data>
     * Encode it using Lempel-Ziv encoding with the minimum possible output length.
     * 
     * Examples (some have other possible encodings of minimal length):
     *     abracadabra     ->  7abracad47
     *     mississippi     ->  4miss433ppi
     *     aAAaAAaAaAA     ->  3aAA53035
     *     2718281828      ->  627182844
     *     abcdefghijk     ->  9abcdefghi02jk
     *     aaaaaaaaaaaa    ->  3aaa91
     *     aaaaaaaaaaaaa   ->  1a91031
     *     aaaaaaaaaaaaaa  ->  1a91041
     * 
     * @param {string} data
     */
    function compr3(data) {

    }

    /**
     * Unique Paths in a Grid I
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * You are in a grid with <random> rows and <random> columns, and you are positioned in the top-left corner of that grid. You are 
     * trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. Determine 
     * how many unique paths there are from start to finish.
     *  
     * NOTE: The data returned for this contract is an array with the number of rows and columns:
     *
     * [10, 12]
     * 
     * @param {number[]} data
     */
    function uniquePaths1(data) {
        let grid = [data[0]][data[1]];
    }

    /**
     * Unique Paths in a Grid II
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * You are located in the top-left corner of the following grid:
     * 
     * <data>
     * 
     * You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. 
     * Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', 
     * while empty spaces are denoted by 0.
     * 
     * Determine how many unique paths there are from start to finish.
     * 
     * NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
     * 
     * @param {number[][]} data
     */
    function uniquePaths2(data) {

    }

    /**
     * Minimum Path Sum in a Triangle
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to adjacent
     * numbers in the row below. The triangle is represented as a 2D array of numbers:
     * 
     * <data>
     * 
     * Example: If you are given the following triangle:
     * 
     * [
     *    [2],
     *   [3,4],
     *  [6,5,7],
     * [4,1,8,3]
     * ]
     * 
     * The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
     * 
     * @param {number[][]} data
     */
    function minPathTriangle(data) {

    }

    /**
     * Proper 2-Coloring of a Graph
     * You are attempting to solve a Coding Contract. You have 5 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * You are given the following data, representing a graph:
     * 
     * <data>
     * 
     * Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting.
     * The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between
     * 0 and 10. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be
     * adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.
     * You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either
     * 0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element
     * i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit
     * an empty array.
     * 
     * Examples:
     * 
     * Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
     * Output: [0, 0, 1, 1]
     * 
     * Input: [3, [[0, 1], [0, 2], [1, 2]]]
     * Output: []
     * 
     * @param {number[]} data
     */
    function twoColoringGraph(data) {

    }

    /**
     * Algorithmic Stock Trader III
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * You are given the following array of stock prices (which are numbers) where the i-th element represents the stock 
     * price on day i:
     * 
     * <data>
     * 
     * Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as 
     * buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In 
     * other words, you must sell the stock before you buy it again.
     * 
     * If no profit can be made, then the answer should be 0
     * 
     * @param {number[]} data
     */
    function algStock3(data) {

    }

    /**
     * Algorithmic Stock Trader IV
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * You are given the following array with two elements:
     * 
     * [5, [61,96,199,100,5,183,16,143,52,93,99,139,160,169,145,48,158,103,110,2,193,171,32,81,94,131,115,87,151,150]]
     * 
     * The first element is an integer k. The second element is an array of stock prices (which are numbers) where the 
     * i-th element represents the stock price on day i.
     * 
     * Determine the maximum possible profit you can earn using at most k transactions. A transaction is defined as 
     * buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. 
     * In other words, you must sell the stock before you can buy it again.
     * 
     * If no profit can be made, then the answer should be 0.
     * 
     * @param {array} data 
     */
    function algStock4(data) {

    }
    
    /**
     * Generate IP Addresses
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * Given the following string containing only digits, return an array with all possible valid IP address combinations that 
     * can be created from the string:
     * 
     * <data>
     * 
     * Note that an octet cannot begin with a '0' unless the number itself is actually 0. For example, '192.168.010.1' is 
     * not a valid IP.
     * 
     * Examples:
     * 
     * 25525511135 -> [255.255.11.135, 255.255.111.35]
     * 1938718066 -> [193.87.180.66]
     * 
     * @param {string} data 
     */
    function generateIP(data) {

    }

    /**
     * Find Largest Prime Factor
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * A prime factor is a factor that is a prime number. What is the largest prime factor of <data>?
     * 
     * @param {number} data 
     */
    function largestPrimeFactor(data) {

    }

    /**
     * Total Ways to Sum II
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * How many different distinct ways can the number 126 be written as a sum of integers contained in the set:
     * 
     * [5,6,7,8,9,10,11,12,14]?
     * 
     * You may use each integer in the set zero or more times.
     * 
     * @param {*} data 
     */
    function waysSum2(data) {
        
    }

    /**
     * Find All Valid Math Expressions
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
     * 
     * 
     * You are given the following string which contains only digits between 0 and 9:
     * 
     * 5236
     * 
     * You are also given a target number of 52. Return all possible ways you can add the +(add), -(subtract), and *(multiply) 
     * operators to the string such that it evaluates to the target number. (Normal order of operations applies.)
     * 
     * The provided answer should be an array of strings containing the valid expressions. The data provided by this problem 
     * is an array with two elements. The first element is the string of digits, while the second element is the target number:
     * 
     * ["5236", 52]
     * 
     * NOTE: The order of evaluation expects script operator precedence NOTE: Numbers in the expression cannot have 
     * leading 0's. In other words, "1+01" is not a valid expression Examples:
     * 
     * Input: digits = "123", target = 6
     * Output: [1+2+3, 1*2*3]
     * 
     * Input: digits = "105", target = 5
     * Output: [1*0+5, 10-5]
     * 
     * @param {array} data 
     */
    function allValidMath(data) {

    }

    /**
     * HammingCodes: Encoded Binary to Integer
     * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the 
     * contract will self-destruct.
     * 
     * 
     * You are given the following encoded binary String:
     * '1111011111010001100111010111100001000011010100000010'
     * Treat it as a Hammingcode with 1 'possible' error on an random Index.
     * Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.
     * 
     * Note: The length of the binary string is dynamic, but it's encoding/decoding is following Hammings 'rule'
     * Note 2: Index 0 is an 'overall' parity bit. Watch the Hammingcode-video from 3Blue1Brown for more information
     * Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉
     * Extranote for automation: return the decimal value as a string
     * 
     * @param {string} data 
     */
    function hammingCodes(data) {

    }
}