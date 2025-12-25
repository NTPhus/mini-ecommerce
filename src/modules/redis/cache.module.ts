import { Global, Module } from "@nestjs/common";
import { CacheProvider } from "./cache.provider";
import { CacheService } from "./cache.service";

@Global()
@Module({
    providers: [CacheProvider, CacheService],
    exports: [CacheProvider, CacheService]
})

export class CacheModule {}