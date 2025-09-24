import { CompensationHistory } from './domain/compensationHistory.entity';
import { CompensationHistoryRepository } from './domain/compenstaionHistory.repo';
import { CreateCompensationHistoryDto } from './dto/CreateCompensationHistory.dto';

export class CompensationHistoryService {
  constructor(private readonly repository: CompensationHistoryRepository) {}

  async create(
    data: CreateCompensationHistoryDto,
  ): Promise<CompensationHistory> {
    return this.repository.create(data);
  }
}
