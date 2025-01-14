import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ListOfErrorComponent } from './list/list-of-error.component';
import { ListOfErrorDetailComponent } from './detail/list-of-error-detail.component';
import { ListOfErrorUpdateComponent } from './update/list-of-error-update.component';
import ListOfErrorResolve from './route/list-of-error-routing-resolve.service';

const listOfErrorRoute: Routes = [
  {
    path: '',
    component: ListOfErrorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ListOfErrorDetailComponent,
    resolve: {
      listOfError: ListOfErrorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ListOfErrorUpdateComponent,
    resolve: {
      listOfError: ListOfErrorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ListOfErrorUpdateComponent,
    resolve: {
      listOfError: ListOfErrorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default listOfErrorRoute;
