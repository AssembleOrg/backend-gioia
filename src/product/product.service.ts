import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { addSlug } from 'src/helpers/product.helper';

@Injectable()
export class ProductoService {
  protected logger = new Logger('ProductoService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    // const products = await this.productRepository.find();
    // for (const p of products) {
    //   const name = p.name;
    //   const slug = name.replace(/ /g, '-');

    //   await this.productRepository.update(p.id, {
    //     slug: slug,
    //   });
    // }

    return await this.productRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getFilteredProducts(filters: Partial<Product>): Promise<Product[]> {
    const qb = this.productRepository.createQueryBuilder('product');

    try {
      Object.entries(filters).forEach(([key, value]) => {
        if (!value) {
          return;
        }

        if (!this.productRepository.metadata.hasColumnWithPropertyPath(key)) {
          throw new BadRequestException(
            `El nombre de la columna no existe: ${key}`,
          );
        }
        const paramName = `filter_${key}`;

        if (key === 'category') {
          const categories = Array.isArray(value) ? value : [value];
          qb.andWhere(`product.category && ARRAY[:...${paramName}]::text[]`, {
            [paramName]: categories,
          });
        } else {
          qb.andWhere(`product.${key} LIKE :${paramName}`, {
            [paramName]: `%${value}%`,
          });
        }
      });

      return await qb.getMany();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error Obtaining Products');
    }
  }

  async getProduct(id: number): Promise<Product> {
    try {
      return this.productRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error Obtaining Product');
    }
  }

  async editProduct(id: number, body: Partial<Product>): Promise<Product> {
    try {
      const hasNameChange = body.name !== undefined;

      const finalBody = hasNameChange ? addSlug(body) : body;

      const product = await this.productRepository.preload({
        id,
        ...finalBody,
      });

      if (!product) {
        throw new BadRequestException(`Product with id: ${id} not found`);
      }

      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error Editing a Product');
    }
  }

  async createProduct(body: Partial<Product>): Promise<Product> {
    try {
      const product = this.productRepository.create(addSlug(body));

      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error Creating a Product');
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id,
        },
      });

      if (!product) {
        throw new BadRequestException(`Product with id: ${id} not found`);
      }

      return await this.productRepository.remove(product);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error Deleting a Product');
    }
  }
}
