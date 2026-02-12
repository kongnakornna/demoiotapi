import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    create(createTeamDto: CreateTeamDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTeamDto: UpdateTeamDto): string;
    remove(id: string): string;
}
