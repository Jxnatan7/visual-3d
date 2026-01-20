import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export abstract class BaseApiProvider {
  constructor(
    protected readonly httpService: HttpService,
    private readonly baseUrl: string,
  ) {}

  protected async request<T>(
    method: "get" | "post" | "delete",
    path: string,
    data?: any,
    config?: any,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await firstValueFrom(
      method === "get" || method === "delete"
        ? this.httpService[method](url, config)
        : this.httpService[method](url, data, config),
    );
    return response.data;
  }

  private handleError(error: any) {
    return error.response?.data || error.message;
  }
}
