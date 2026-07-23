import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/jwt-payload.interface';
import { UserRole } from '../../../common/enums/user-role.enum';
import { CreateFamilyDto } from '../dto/create-family.dto';
import { FamilyResponseDto } from '../dto/family-response.dto';
import { UpdateFamilyDto } from '../dto/update-family.dto';
import { FamilyContextGuard } from '../guards/family-context.guard';
import { FamilyService } from '../services/family.service';

@ApiTags('Family')
@ApiBearerAuth()
@Controller('families')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  /** Deliberately NOT behind FamilyContextGuard - it creates the context. */
  @Post()
  @ApiOperation({ summary: 'Create the family workspace (one per user)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FamilyResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User already has a workspace' })
  createFamily(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFamilyDto,
  ): Promise<FamilyResponseDto> {
    return this.familyService.createFamily(user, dto);
  }

  @Get('me')
  @UseGuards(FamilyContextGuard)
  @ApiOperation({ summary: "The caller's family workspace" })
  @ApiResponse({ status: HttpStatus.OK, type: FamilyResponseDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No workspace yet' })
  getMyFamily(@CurrentUser() user: AuthenticatedUser): Promise<FamilyResponseDto> {
    return this.familyService.getMyFamily(user);
  }

  @Put('me')
  @UseGuards(FamilyContextGuard)
  @Roles(UserRole.FAMILY_OWNER)
  @ApiOperation({ summary: 'Update the family workspace (owner only)' })
  @ApiResponse({ status: HttpStatus.OK, type: FamilyResponseDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not the workspace owner' })
  updateMyFamily(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateFamilyDto,
  ): Promise<FamilyResponseDto> {
    return this.familyService.updateMyFamily(user, dto);
  }
}
