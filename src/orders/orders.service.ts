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
import {
  CreateOrderRequestDto,
  OrderQueryRequestDto,
} from './dtos/order.request.dto';

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

  async createOrder(userId: string, params: CreateOrderRequestDto) {
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
  async getOrders(request: OrderQueryRequestDto) {
    const { per_page: perPage, page, user_id: userId } = request;

    console.log(
      '🚀 ~ file: orders.service.ts:79 ~ OrdersService ~ getOrders ~ request:',
      request,
    );

    let query: any = null;
    if (userId) {
      query = { user: userId };
    }

    const skip = (page - 1) * perPage;
    const totalCount = await this.orderModel.countDocuments(query);

    const orders = await this.orderModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(perPage)
      .lean();

    const results: any = [];
    for (const order of orders) {
      const orderDetail = await this.orderDetailModel.find({
        order: order._id,
      });
      const productSkus = orderDetail.map((item) => item.productSku);

      const skus = await this.productSkuModel.find({
        _id: { $in: productSkus },
      });

      const formattedItems = await Promise.all(
        orderDetail.map(async (item) => {
          const sku = skus.find(
            (productSku) =>
              productSku._id.toString() === item.productSku.toString(),
          );
          const images = await this.fileService.getMutilsPresignedUrl(
            sku?.images || [],
          );

          return {
            _id: item._id.toString(),
            name: sku?.name,
            images: images,
            sku_id: item.productSku.toString(),
            quantity: item.quantity,
            unit_price: item.unitPrice,
          };
        }),
      );
      // Construct the result object for the order
      const result = {
        _id: order._id.toString(),
        name: order.name,
        shipping_address: order.shippingAddress,
        message: order.message,
        status: order.status,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        items: formattedItems,
      };

      results.push(result);
    }

    return {
      total: Number(totalCount) as number,
      per_page: Number(perPage) as number,
      current_page: Number(page) as number,
      last_page: Math.ceil(totalCount / perPage),
      data: results,
    };
  }
}
