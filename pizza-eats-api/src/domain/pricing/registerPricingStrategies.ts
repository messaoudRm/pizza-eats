import { PricingStrategyRegistry } from "./PricingStrategyRegistry";
import { PromoCodeCatalog } from "./PromoCodeCatalog";
import { StandardPricing } from "./strategies/StandardPricing";
import { HappyHourPricing } from "./strategies/HappyHourPricing";
import { LoyaltyPricing } from "./strategies/LoyaltyPricing";

// us 2 : Prix standard, Happy Hour (-20%), Code promo, Fidélité (-10%)
PricingStrategyRegistry.register("standard", () => new StandardPricing());
PricingStrategyRegistry.register("happy-hour", () => new HappyHourPricing());
PricingStrategyRegistry.register("promo-code", (options) =>
    PromoCodeCatalog.createStrategy(options.promoCode),
);
PricingStrategyRegistry.register("loyalty", () => new LoyaltyPricing());
