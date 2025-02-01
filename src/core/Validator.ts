
const dihedralGroup = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const permutation = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/**
 * Validate the AADHAR number or Virtual ID
 * @param aadhar AADHAR number or Virtual ID
 * @returns Whether the AADHAR number or Virtual ID is valid
 * @example
 * ```ts
 * const isValid = Validator.validate("378282210921577");
 * console.log(isValid); // true
 * ```
 */
export function validate(aadhar: string): boolean {
    if (aadhar.length !== 12 && aadhar.length !== 16) {
        return false;
    }
    if (!/^\d+$/.test(aadhar)) {
        return false;
    }
    if (aadhar[0] === "0" || aadhar[0] === "1") {
        return false;
    }
    const aadharNumber = aadhar.split("").map(Number).reverse();
    let checkSum = 0;
    for (let i = 0; i < aadharNumber.length; i++) {
        checkSum = dihedralGroup[checkSum][permutation[i % 8][aadharNumber[i]]];
    }
    return checkSum === 0;
}
