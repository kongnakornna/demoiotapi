import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateProjectDto: UpdateProjectDto): string;
    remove(id: string): string;
}
