import { Injectable } from '@nestjs/common';
import { Order as IOrder } from '../models';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '../../database/entities/order.entity';
import { Cart, CartStatus } from '../../database/entities/cart.entity';
import { User } from '../../database/entities/user.entity';
import { calculateCartTotal } from '../../cart/models-rules';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<IOrder[]> {
    return await this.orderRepository.find();
  }
  async findById(orderId: string): Promise<IOrder> {
    return await this.orderRepository.findOne(orderId);
  }

  async create(data: any): Promise<IOrder> {
    const {
      address: { address,  firstName, lastName },
      userId,
    } = data;

    const user = await this.userRepository.findOne(userId);

    user.firstName = firstName;
    user.lastName = lastName;

    const userCart = await this.cartRepository.findOne({
      where: { user: { id: userId }, status: CartStatus.OPEN },
    });

    userCart.status = CartStatus.ORDERED;

    const total = calculateCartTotal(userCart);

    const order = this.orderRepository.create({
      user: {
        id: data.userId,
      },
      cart: {
        id: userCart.id,
      },
      payment: { address: address },
      delivery: { address: address },
      comments: data.address.comment,
      status: OrderStatus.OPEN,
      total: total,
    });

    await this.entityManager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(user);
      await transactionalEntityManager.save(userCart);
      await transactionalEntityManager.save(order);
    });

    return order;
  }

  async update(orderId, data): Promise<IOrder> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orderRepository.merge(order, data);
    console.log('order', order);
    return await this.orderRepository.save(order);
  }

  async deleteById(orderId) {
    await this.orderRepository.delete(orderId);
  }
}
