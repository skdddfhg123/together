import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, from } from 'rxjs';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
    private jwtGuard = new (AuthGuard('jwt'))();
    private kakaoGuard = new (AuthGuard('kakao'))();

    canActivate(context: ExecutionContext): Promise<boolean> {
        const guards = [this.jwtGuard, this.kakaoGuard];

        return guards.reduce(async (resultPromise, guard) => {
            const result = await resultPromise;
            if (!result) {
                return false;  // If one guard returns false, short-circuit and return false
            }
            const canActivateResult = guard.canActivate(context);
            // Convert Observable<boolean> to Promise<boolean> if necessary
            if (canActivateResult instanceof Observable) {
                return from(canActivateResult).toPromise();
            }
            return canActivateResult;
        }, Promise.resolve(true));
    }
}
