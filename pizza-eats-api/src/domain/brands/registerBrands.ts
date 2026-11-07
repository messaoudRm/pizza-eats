import { BrandRegistry } from "../registries/BrandRegistry";
import { DaMichele } from "./DaMichele";
import { Rossopomodoro } from "./Rossopomodoro";
import { Pizzium } from "./Pizzium";
import { DominosPizza } from "./DominosPizza";
import { PizzaHut } from "./PizzaHut";

// us 1 : 3 enseignes : Da Michele, Rossopomodoro, Pizzium
BrandRegistry.register("da-michele", DaMichele);
BrandRegistry.register("rossopomodoro", Rossopomodoro);
BrandRegistry.register("pizzium", Pizzium);

// us 1 : Ajouter une enseigne = ajouter une classe
BrandRegistry.register("dominos-pizza", DominosPizza);
BrandRegistry.register("pizza-hut", PizzaHut);