import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async findAll() {
    console.log('get order', );
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findById(@Param() params: any) {
    const orderId = params.id;
    return await this.orderService.findById(orderId);
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async submitOrder(@Req() req: AppRequest, @Body() body) {
    // TODO: validate body payload...
    console.log('req', req);
    const data = {
      userId: getUserIdFromRequest(req),
      ...body,
    };
    return await this.orderService.create(data);
  }
  @Delete(':id')
  async deleteOrderById(@Param() params: any, @Req() req: AppRequest) {
    return await this.orderService.deleteById(params.id);
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param() params: any,
    @Req() req: AppRequest,
    @Body() body,
  ) {
    // TODO: validate body payload...
    const orderId = params.id;
    const { status, comment } = body;
    return await this.orderService.update(orderId, {
      status,
      comments: comment,
    });
  }
}
