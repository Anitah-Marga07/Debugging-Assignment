function cleanDatabase(recordIds) {
// Requirement: Remove all odd numbers from the array
for (let i = 0; i < recordIds.length; i++) {
if (recordIds[i] % 2 !== 0) {
recordIds.splice(i, 1);
}
}
return recordIds;
}
// Test Case
const data = [1, 3, 4, 6, 7, 9, 10];
const cleaned = cleanDatabase(data);
console.log(cleaned)



/**
 * 
 * When iterating forward and removing an odd number,
 * the next element shifts into the current index, but the loop increments i,
 * causing the shifted element to be skipped.
 * 
 * 
 * 
 * 1. The Observation:
 *    At index 1 (value 3), when removed, the array becomes [1, 4, 6, 7, 9, 10].
 *    The loop increments i to 2, skipping the element that shifted to index 1 (value 4).
 *    The value 4 (an even number) is kept but the next odd number 7 at original index 3
 *    would have similar issues. The first skip happened at index 1 after removing 3.
 * 
 * 2. The "Why":
 *    When you remove an item from a list while moving forward, all following items shift
 *    left by one index to fill the gap. However, (i) still increments to the
 *    next index, therefore skipping the element that just shifted into the current position.
 *    This creates a "drift" where the pointer becomes blind to the element that moved into
 *    the deleted element's position, causing it to be skipped entirely from checking.
 * 
 * 
 */

// FIX 1: Reverse iteration
function cleanDatabaseReverse(recordIds) {
    // Iterate from end to beginning
    for (let i = recordIds.length - 1; i >= 0; i--) {
        if (recordIds[i] % 2 !== 0) { // Remove odd numbers
            recordIds.splice(i, 1);
        }
    }
    return recordIds;
}

const data1 = [1, 3, 4, 6, 7, 9, 10];
const cleaned1 = cleanDatabaseReverse(data1);
console.log("Final array (Reverse iteration):", cleaned1);
// EXPECTED: [4, 6, 10]
// ACTUAL: [4, 6, 10] 



// FIX 2: Immutable approach - Create new array
function cleanDatabaseImmutable(recordIds) {
  return recordIds.reduce((acc, id) => {
    if (id % 2 === 0) {
      acc.push(id); 
    }
    return acc;
  }, []);
}

// Test Case
const data2 = [1, 3, 4, 6, 7, 9, 10];
const cleaned2 = cleanDatabaseImmutable(data);

console.log("Final array (Immutable approach):", cleaned2); // [4, 6, 10]
// console.log(data2);    // [1, 3, 4, 6, 7, 9, 10] (unchanged)



/**
 * How the debugger helped find the "drift":
 * 
 * 1. Set a breakpoint inside the for loop at line 4 (original code)
 * 2. Watched the values of i, recordIds[i], and the entire array
 * 3. At i=0: array=[1,3,4,6,7,9,10], recordIds[0]=1 (odd) -> removed
 *    Array becomes [3,4,6,7,9,10]
 * 4. i increments to 1: array=[3,4,6,7,9,10], recordIds[1]=4 (even) -> kept
 *    The value 3 at index 0 was NEVER checked!
 * 5. At i=2: array=[3,4,6,7,9,10], recordIds[2]=6 (even) -> kept
 * 6. At i=3: recordIds[3]=7 (odd) -> removed, array becomes [3,4,6,9,10]
 * 7. This pattern continues, causing the drift where odd numbers
 *    shift left and get skipped by the incrementing index
 */