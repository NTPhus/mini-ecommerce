import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshTokens {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    revoked: boolean;

    @Column({
        type: 'timestamp',
        default: '(CURRENT_TIMESTAMP + INTERVAL 7 DAY)'
    })
    exprired_at: Date;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    user: User;
}