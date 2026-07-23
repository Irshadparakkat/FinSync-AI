import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponseDto } from '../../../common/dto/message-response.dto';
import { PaginatedResult } from '../../../common/dto/paginated-result.dto';
import { UserRole } from '../../../common/enums/user-role.enum';
import { ParseObjectIdPipe } from '../../../common/pipes/parse-object-id.pipe';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/jwt-payload.interface';
import { FamilyContextGuard } from '../../family/guards/family-context.guard';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberQueryDto } from '../dto/member-query.dto';
import { MemberResponseDto } from '../dto/member-response.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { MembersService } from '../services/members.service';

/**
 * All routes are tenant-scoped: FamilyContextGuard guarantees a familyId
 * on the principal, and the service scopes every query with it. Reads
 * are open to all family roles; writes are owner-only.
 */
@ApiTags('Members')
@ApiBearerAuth()
@UseGuards(FamilyContextGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'List family members (paginated, filterable)' })
  @ApiResponse({ status: HttpStatus.OK, type: [MemberResponseDto] })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: MemberQueryDto,
  ): Promise<PaginatedResult<MemberResponseDto>> {
    return this.membersService.findMembers(user.familyId as string, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Member details (age derived from dateOfBirth)' })
  @ApiParam({ name: 'id', description: 'Member id' })
  @ApiResponse({ status: HttpStatus.OK, type: MemberResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found in this family' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<MemberResponseDto> {
    return this.membersService.findMemberById(user.familyId as string, id);
  }

  @Post()
  @Roles(UserRole.FAMILY_OWNER)
  @ApiOperation({ summary: 'Add a family member (owner only)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: MemberResponseDto })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMemberDto,
  ): Promise<MemberResponseDto> {
    return this.membersService.createMember(user.familyId as string, dto);
  }

  @Put(':id')
  @Roles(UserRole.FAMILY_OWNER)
  @ApiOperation({ summary: 'Update a family member (owner only)' })
  @ApiParam({ name: 'id', description: 'Member id' })
  @ApiResponse({ status: HttpStatus.OK, type: MemberResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found in this family' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    return this.membersService.updateMember(user.familyId as string, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.FAMILY_OWNER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a family member (owner only)' })
  @ApiParam({ name: 'id', description: 'Member id' })
  @ApiResponse({ status: HttpStatus.OK, type: MessageResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found in this family' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<MessageResponseDto> {
    await this.membersService.deleteMember(user.familyId as string, id);
    return new MessageResponseDto('Member removed successfully');
  }
}
