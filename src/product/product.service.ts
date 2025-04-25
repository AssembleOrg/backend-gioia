import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoService {
  protected logger = new Logger('ProductoService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getFilteredProducts(
    filters: Partial<Record<keyof Product, string>>,
  ): Promise<Product[]> {
    const qb = this.productRepository.createQueryBuilder('product');

    try {
      Object.entries(filters).forEach(([key, value]) => {
        if (!value) {
          return;
        }

        if (!this.productRepository.metadata.hasColumnWithPropertyPath(key)) {
          throw new BadRequestException('El nombre de la columna no existe');
        }
        const paramName = `filter_${key}`;

        if (key === 'category') {
          qb.andWhere(
            `
               EXISTS (
                 SELECT 1
                 FROM unnest(product.category) AS element
                 WHERE LOWER(element) LIKE LOWER(:${paramName})
               )
               `,
            { [paramName]: `%${value.trim()}%` },
          );
        } else {
          qb.andWhere(`product.${key} LIKE :${paramName}`, {
            [paramName]: `%${value}%`,
          });
        }
      });

      return await qb.getMany();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
