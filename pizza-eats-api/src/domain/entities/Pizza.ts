export class Pizza {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly basePrice: number,
    public readonly stock: number,
  ) {}
}
