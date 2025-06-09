import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { FindAllReviewQueryDto } from './dto/find-all-reviews.dto';
import { UserRepository } from '../user/user.repository';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository, 
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id: createReviewDto.userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${createReviewDto.userId} not found`);  
    }
    const product = await this.productRepository.findOne({ where: { id: createReviewDto.productId } });
    if (!product) {
      throw new NotFoundException(`Product with id ${createReviewDto.productId} not found`);
    }
    const review = this.reviewRepository.create(createReviewDto);
    review.user = user;
    review.product = product;
    return this.reviewRepository.save(review);
  }

  async findAll(query:FindAllReviewQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const qb = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product');
    if (search) {
      qb.andWhere(
        ` LOWER(review.title) LIKE LOWER(:search)
          OR LOWER(review.rating) LIKE LOWER(:search)
         `,
        { search: `%${search}%` },
      );
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

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id: id.toString() } });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}