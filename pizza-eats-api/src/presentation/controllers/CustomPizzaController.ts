import {
    CustomPizzaService,
    CustomPizzaRequest,
} from "../../application/services/CustomPizzaService";

export class CustomPizzaController {
    constructor(private readonly service: CustomPizzaService) {}

    customizePizza(request: CustomPizzaRequest) {
        return this.service.customize(request);
    }
}
