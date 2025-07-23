/**
 * Bayesian Rating System for The RPG Vault
 * 
 * Prevents rating inflation from small vote counts and provides more accurate ratings
 * by incorporating global average ratings and minimum rating thresholds.
 */

export interface BayesianRatingConfig {
  globalAverageRating: number; // C - average rating across all items
  minimumRatingsThreshold: number; // m - minimum ratings to trust fully
}

/**
 * Calculate Bayesian adjusted rating for an RPG item
 * 
 * Formula: True Rating = (v / (v + m)) * R + (m / (v + m)) * C
 * 
 * @param itemRatingCount - Number of ratings for the item (v)
 * @param itemAverageRating - Average rating for the item (R)
 * @param config - Bayesian rating configuration
 * @returns Bayesian adjusted rating rounded to 2 decimal places
 */
export function calculateBayesianRating(
  itemRatingCount: number,
  itemAverageRating: number,
  config: BayesianRatingConfig
): number {
  const { globalAverageRating: C, minimumRatingsThreshold: m } = config;
  const v = itemRatingCount;
  const R = itemAverageRating;

  // If no ratings, return global average
  if (v === 0) return C;

  // Apply Bayesian formula
  const trueRating = (v / (v + m)) * R + (m / (v + m)) * C;
  
  return Math.round(trueRating * 100) / 100; // Round to 2 decimal places
}

/**
 * Get current Bayesian rating configuration
 * This will evolve as the site grows - start conservative for small communities
 */
export function getBayesianConfig(): BayesianRatingConfig {
  return {
    globalAverageRating: 7.0, // Starting assumption - can be calculated dynamically later
    minimumRatingsThreshold: 10, // Small community starting point
  };
}

/**
 * Calculate global average rating from all reviews
 * This should be called periodically to update the global average
 */
export async function calculateGlobalAverageRating(
  getAllReviews: () => Promise<Array<{ rating: number }>>
): Promise<number> {
  const allReviews = await getAllReviews();
  
  if (allReviews.length === 0) {
    return 7.0; // Default assumption
  }
  
  const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
  const average = totalRating / allReviews.length;
  
  return Math.round(average * 100) / 100;
}

/**
 * Example usage and testing function
 */
export function testBayesianRating() {
  const config = getBayesianConfig();
  
  // Test cases
  const testCases = [
    { ratings: [9, 8, 7, 10, 8], description: "5 ratings with 8.4 average" },
    { ratings: [10, 10], description: "2 perfect ratings (should be pulled down)" },
    { ratings: [1, 2], description: "2 low ratings (should be pulled up)" },
    { ratings: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8], description: "12 consistent ratings" },
  ];

  console.log("Bayesian Rating Test Results:");
  console.log(`Global Average: ${config.globalAverageRating}, Min Threshold: ${config.minimumRatingsThreshold}`);
  console.log("---");

  testCases.forEach(testCase => {
    const v = testCase.ratings.length;
    const R = testCase.ratings.reduce((a, b) => a + b, 0) / v;
    const bayesianRating = calculateBayesianRating(v, R, config);
    
    console.log(`${testCase.description}:`);
    console.log(`  Raw Average: ${R.toFixed(2)}`);
    console.log(`  Bayesian Rating: ${bayesianRating}`);
    console.log(`  Adjustment: ${(bayesianRating - R).toFixed(2)}`);
    console.log("");
  });
}