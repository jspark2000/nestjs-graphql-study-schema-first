import { Global, Module } from '@nestjs/common';
import { DateScalar } from './date.scalar';

@Global()
@Module({
  providers: [DateScalar],
  exports: [DateScalar],
})
export class CommonModule {}
