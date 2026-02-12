import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(createTaskDto: CreateTaskDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTaskDto: UpdateTaskDto): string;
    remove(id: string): string;
}
