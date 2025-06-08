import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from '../category/category.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...rest } = createProductDto;

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({
      ...rest,
      category,
    });

    return await this.productRepository.save(product);
  }

async findAll(query: FindProductsDto) {
  const {
    page = 1,
    limit = 10,
    search,
    inStock,
    minPrice,
    maxPrice,
    category,
  } = query;

  const qb = this.productRepository.createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category');

  if (search) {
    qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', { search: `%${search}%` });
  }

  if (inStock !== undefined) {
    if (inStock) {
      qb.andWhere('product.stock > 0');
    } else {
      qb.andWhere('product.stock = 0');
    }
  }

  if (minPrice !== undefined) {
    qb.andWhere('product.price >= :minPrice', { minPrice });
  }

  if (maxPrice !== undefined) {
    qb.andWhere('product.price <= :maxPrice', { maxPrice });
  }

  if (category) {
    qb.andWhere('product.categoryId = :category', { category });
  }

  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
  };
}


  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return await this.productRepository.remove(product);
  }
}
