import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CommonService } from "./common.service";

@Injectable()
export class CatsService {
  constructor(
    @Inject( CommonService)
    private commonService: CommonService,
  ) {}
}
