import { plainToInstance, ClassConstructor } from 'class-transformer';

export function transformToDto<T, V>(cls: ClassConstructor<T>, plain: V): T {
  return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}
