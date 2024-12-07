import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'checker-list',
    data: { pageTitle: 'CheckerLists' },
    loadChildren: () => import('./rdComplaint/checker-list/checker-list.routes'),
  },
  {
    path: 'unit-of-use',
    data: { pageTitle: 'UnitOfUses' },
    loadChildren: () => import('./rdComplaint/unit-of-use/unit-of-use.routes'),
  },
  {
    path: 'list-of-error',
    data: { pageTitle: 'ListOfErrors' },
    loadChildren: () => import('./rdComplaint/list-of-error/list-of-error.routes'),
  },
  {
    path: 'complaint-list',
    data: { pageTitle: 'ComplaintLists' },
    loadChildren: () => import('./rdComplaint/complaint-list/complaint-list.routes'),
  },
  {
    path: 'complaint-status',
    data: { pageTitle: 'ComplaintStatuses' },
    loadChildren: () => import('./rdComplaint/complaint-status/complaint-status.routes'),
  },
  {
    path: 'reflector',
    data: { pageTitle: 'Reflectors' },
    loadChildren: () => import('./rdComplaint/reflector/reflector.routes'),
  },
  {
    path: 'reason',
    data: { pageTitle: 'Reasons' },
    loadChildren: () => import('./rdComplaint/reason/reason.routes'),
  },
  {
    path: 'implementation-result',
    data: { pageTitle: 'ImplementationResults' },
    loadChildren: () => import('./rdComplaint/implementation-result/implementation-result.routes'),
  },
  {
    path: 'department',
    data: { pageTitle: 'Departments' },
    loadChildren: () => import('./rdComplaint/department/department.routes'),
  },
  {
    path: 'complaint',
    data: { pageTitle: 'Complaints' },
    loadChildren: () => import('./rdComplaint/complaint/complaint.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
