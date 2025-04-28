import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './cartItem.entity';

@Injectable()
export class CartService {
  protected logger = new Logger('CartService');

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async getCartByOwnId(id: number): Promise<Cart> {
    try {
      return await this.cartRepository.findOne({
        where: { id },
        relations: ['items'],
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error getting cart');
    }
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    try {
      return await this.cartRepository.findOne({
        where: { userId },
        relations: ['items'],
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error getting cart');
    }
  }

  async createCart(userId: number): Promise<Cart> {
    try {
      const cart = this.cartRepository.create({
        userId,
        items: [],
      });
      return await this.cartRepository.save(cart);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error creating cart');
    }
  }

  async addItemToCart(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    // 1) Check the cart exists
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    // 2) Try to increment an existing row
    const updateResult = await this.cartItemRepository
      .createQueryBuilder()
      .update(CartItem)
      .set({ quantity: () => `"quantity" + ${quantity}` })
      .where('cartId = :cartId AND productId = :productId', {
        cartId,
        productId,
      })
      .execute();

    if (updateResult.affected === 0) {
      // 3) No existing item → insert a new one
      const newItem = this.cartItemRepository.create({
        cart,
        product: { id: productId } as any,
        quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    // 4) Return the cart *with* its items populated
    return this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }

  async deleteItemFromCart(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    // 1) Check the cart exists
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    // 2) Try to decrement an existing row
    const updateResult = await this.cartItemRepository
      .createQueryBuilder()
      .update(CartItem)
      .set({ quantity: () => `"quantity" - ${quantity}` })
      .where('cartId = :cartId AND productId = :productId', {
        cartId,
        productId,
      })
      .execute();

    if (updateResult.affected === 0) {
      // 3) No existing item → throw an error
      throw new BadRequestException(
        `Cart ${cartId} does not contain item ${productId}`,
      );
    }

    // 4) Return the cart *with* its items populated
    return this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }

  async emptyCart(cartId: number): Promise<Cart> {
    // 1) Check the cart exists
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    // 2) Delete all items
    await this.cartItemRepository.delete({ cartId });

    // 3) Return the cart *with* its items populated
    return this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }
}
