import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshTokens {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({ default: false })
    revoked: boolean;

    @Column({ name: 'expired_at' })
    expired_at: Date;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    user: User;

    @BeforeInsert()
    setExpiration() {
        const now = new Date();
        now.setDate(now.getDate() + 7);
        this.expired_at = now;
    }
}