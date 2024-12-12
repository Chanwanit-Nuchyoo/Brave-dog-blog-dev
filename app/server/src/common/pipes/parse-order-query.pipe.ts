import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOrderQueryPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('Order query is required.');
    }

    const orderEntries = value.split(',').map((v) => {
      const [field, order] = v.split(':');

      // Validate field and order
      if (!field || !order || !['asc', 'desc'].includes(order.toLowerCase())) {
        throw new BadRequestException(
          `Invalid order format for "${v}". Expected format: field:asc|desc.`,
        );
      }

      return { [field]: order.toLowerCase() };
    });

    return orderEntries;
  }
}
