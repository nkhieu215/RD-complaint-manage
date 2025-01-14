import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ReflectorComponent } from './list/reflector.component';
import { ReflectorDetailComponent } from './detail/reflector-detail.component';
import { ReflectorUpdateComponent } from './update/reflector-update.component';
import ReflectorResolve from './route/reflector-routing-resolve.service';

const reflectorRoute: Routes = [
  {
    path: '',
    component: ReflectorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReflectorDetailComponent,
    resolve: {
      reflector: ReflectorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReflectorUpdateComponent,
    resolve: {
      reflector: ReflectorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReflectorUpdateComponent,
    resolve: {
      reflector: ReflectorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reflectorRoute;
