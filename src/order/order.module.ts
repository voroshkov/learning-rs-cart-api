import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { DatabaseModule } from '../database/database.module';
import { OrderController } from "../order/order.controller";

@Module({
  imports: [ DatabaseModule ],
  providers: [ OrderService ],
  exports: [ OrderService ],
  controllers: [ OrderController ]
})
export class OrderModule {}
