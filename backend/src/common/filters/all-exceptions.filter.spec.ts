import { ArgumentsHost, BadRequestException, NotFoundException } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const mockHost = (url = '/api/v1/test'): ArgumentsHost => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    return {
      switchToHttp: () => ({
        getResponse: () => ({ status: statusMock }),
        getRequest: () => ({ url, method: 'GET' }),
      }),
    } as unknown as ArgumentsHost;
  };

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  it('preserves HttpException status and message', () => {
    filter.catch(new NotFoundException('Workspace not found'), mockHost());

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 404,
        message: 'Workspace not found',
      }),
    );
  });

  it('flattens ValidationPipe errors into the errors array', () => {
    const exception = new BadRequestException(['email must be an email', 'name is required']);

    filter.catch(exception, mockHost());

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: ['email must be an email', 'name is required'],
      }),
    );
  });

  it('masks unknown errors as a generic 500', () => {
    filter.catch(new Error('mongo connection string leaked'), mockHost());

    expect(statusMock).toHaveBeenCalledWith(500);
    const [[body]] = jsonMock.mock.calls as [[{ message: string }]];
    expect(body.message).toBe('Internal server error');
    expect(JSON.stringify(body)).not.toContain('mongo connection string');
  });
});
