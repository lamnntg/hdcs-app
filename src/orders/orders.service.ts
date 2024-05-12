import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { FilesMinioService } from 'src/minio/files.service';
import {
  OrderSchemaClass,
  OrderSchemaDocument,
} from 'src/entities/order.schema';
import {
  OrderDetailSchemaClass,
  OrderDetailSchemaDocument,
} from 'src/entities/order_detail.schema';

import {
  ProductSkuSchemaClass,
  ProductSkuSchemaDocument,
} from 'src/entities/product_sku.schema';
import { CreateOrderRequestDto } from './dtos/order.request.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderSchemaClass.name)
    private readonly orderModel: Model<OrderSchemaDocument>,
    @InjectModel(OrderDetailSchemaClass.name)
    private readonly orderDetailModel: Model<OrderDetailSchemaDocument>,
    @InjectModel(ProductSkuSchemaClass.name)
    private readonly productSkuModel: Model<ProductSkuSchemaDocument>,
    private fileService: FilesMinioService,
  ) {}

  async createCart(userId: string, params: CreateOrderRequestDto) {
    const skuIds = params.items.map(
      (item) => new mongoose.Types.ObjectId(item.sku_id),
    );

    const productSkus = await this.productSkuModel
      .find({ _id: { $in: skuIds } })
      .lean();

    if (productSkus.length != params.items.length) {
      throw new BadRequestException('Products is not valid');
    }

    const order = await this.orderModel.create({
      user: userId,
      name: params.name,
      shippingAddress: params.shipping_address,
      phone: params.phone,
      message: params.message,
    });

    for (const orderItem of params.items) {
      const sku = productSkus.find((sku) => {
        return sku._id.toString() == orderItem.sku_id;
      });

      await this.orderDetailModel.create({
        order: order._id,
        productSku: orderItem.sku_id,
        quantity: orderItem.quantity,
        unitPrice: sku?.price,
      });
    }

    return;
  }

  /**
   * get orders
   * @param userId
   */
  async getOrders(userId: string) {
    const orders = await this.orderModel
      .find({
        user: userId,
      })
      .lean();

    const results: any = [];
    for (const order of orders) {
      const orderDetail = await this.orderDetailModel.find({
        order: order._id,
      });

      const result = {
        _id: order._id.toString(),
        name: order.name,
        shipping_address: order.shippingAddress,
        message: order.message,
        status: order.status,
        create_at: order.createdAt,
        updated_at: order.updatedAt,
        items: orderDetail.map((item) => {
          return {
            sku_id: item.productSku.toString(),
            quantity: item.quantity,
            unit_price: item.unitPrice,
          };
        }),
      };

      results.push(result);
    }

    return results;
  }
}
