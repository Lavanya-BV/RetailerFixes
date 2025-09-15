import { calculateRewardPoints } from "./rewardCalculation";

describe("Reward Calculation Tests", () => {
  test("Calculates points for a $120 transaction", () => {
    expect(calculateRewardPoints(120)).toBe(90); // 2x$20 + 1x$50 = 90 points
  });

  test("Calculates points for a $60 transaction", () => {
    expect(calculateRewardPoints(60)).toBe(10); // 1x$50 + 1x$10 = 10 points
  });

  test("Calculates points for a $150 transaction", () => {
    expect(calculateRewardPoints(150)).toBe(150); // 2x$50 + 1x$50 = 150 points
  });

  test("Calculates points for a $49 transaction (no points)", () => {
    expect(calculateRewardPoints(49)).toBe(0); // No reward points
  });
});

describe("Reward Calculation Tests for fractions", () => {
  test("Calculates points for a $50.75 transaction (fractional)", () => {
    expect(calculateRewardPoints(50.75)).toBe(0.75); // Only amount above $50 earns points
  });

  test("Calculates points for a $99.99 transaction (fractional)", () => {
    expect(calculateRewardPoints(99.99)).toBeCloseTo(49.99, 2); // $49.99 above $50
  });

  test("Calculates points for a $120.5 transaction (fractional)", () => {
    expect(calculateRewardPoints(120.5)).toBeCloseTo(91, 2); // $20.5 above $100, $50 above $50
  });
});
