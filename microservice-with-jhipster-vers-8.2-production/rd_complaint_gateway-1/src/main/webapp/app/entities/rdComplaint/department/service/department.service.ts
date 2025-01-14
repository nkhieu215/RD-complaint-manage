import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDepartment, NewDepartment } from '../department.model';

export type PartialUpdateDepartment = Partial<IDepartment> & Pick<IDepartment, 'id'>;

type RestOf<T extends IDepartment | NewDepartment> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestDepartment = RestOf<IDepartment>;

export type NewRestDepartment = RestOf<NewDepartment>;

export type PartialUpdateRestDepartment = RestOf<PartialUpdateDepartment>;

export type EntityResponseType = HttpResponse<IDepartment>;
export type EntityArrayResponseType = HttpResponse<IDepartment[]>;

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/departments', 'rdcomplaint');

  create(department: NewDepartment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(department);
    return this.http
      .post<RestDepartment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(department: IDepartment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(department);
    return this.http
      .put<RestDepartment>(`${this.resourceUrl}/${this.getDepartmentIdentifier(department)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(department: PartialUpdateDepartment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(department);
    return this.http
      .patch<RestDepartment>(`${this.resourceUrl}/${this.getDepartmentIdentifier(department)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDepartment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDepartment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDepartmentIdentifier(department: Pick<IDepartment, 'id'>): number {
    return department.id;
  }

  compareDepartment(o1: Pick<IDepartment, 'id'> | null, o2: Pick<IDepartment, 'id'> | null): boolean {
    return o1 && o2 ? this.getDepartmentIdentifier(o1) === this.getDepartmentIdentifier(o2) : o1 === o2;
  }

  addDepartmentToCollectionIfMissing<Type extends Pick<IDepartment, 'id'>>(
    departmentCollection: Type[],
    ...departmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const departments: Type[] = departmentsToCheck.filter(isPresent);
    if (departments.length > 0) {
      const departmentCollectionIdentifiers = departmentCollection.map(departmentItem => this.getDepartmentIdentifier(departmentItem));
      const departmentsToAdd = departments.filter(departmentItem => {
        const departmentIdentifier = this.getDepartmentIdentifier(departmentItem);
        if (departmentCollectionIdentifiers.includes(departmentIdentifier)) {
          return false;
        }
        departmentCollectionIdentifiers.push(departmentIdentifier);
        return true;
      });
      return [...departmentsToAdd, ...departmentCollection];
    }
    return departmentCollection;
  }

  protected convertDateFromClient<T extends IDepartment | NewDepartment | PartialUpdateDepartment>(department: T): RestOf<T> {
    return {
      ...department,
      created_at: department.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDepartment: RestDepartment): IDepartment {
    return {
      ...restDepartment,
      created_at: restDepartment.created_at ? dayjs(restDepartment.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDepartment>): HttpResponse<IDepartment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDepartment[]>): HttpResponse<IDepartment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
