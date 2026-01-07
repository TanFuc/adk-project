import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TrackClickDto {
  @ApiProperty({ example: "register_partnership", description: "Tên button được click" })
  @IsString()
  buttonName: string;

  @ApiPropertyOptional({ example: "https://example.com/page", description: "URL trang hiện tại" })
  @IsOptional()
  @IsString()
  pageUrl?: string;

  @ApiPropertyOptional({ description: "Referrer URL" })
  @IsOptional()
  @IsString()
  referrer?: string;
}
