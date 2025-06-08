import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(dto: CreateCategoryDto) {
    return this.categoryRepository.save(dto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return this.categoryRepository.save({ ...category, ...dto });
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return this.categoryRepository.remove(category);
  }
}