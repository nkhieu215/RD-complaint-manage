import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComplaintStatus, NewComplaintStatus } from '../complaint-status.model';

export type PartialUpdateComplaintStatus = Partial<IComplaintStatus> & Pick<IComplaintStatus, 'id'>;

type RestOf<T extends IComplaintStatus | NewComplaintStatus> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestComplaintStatus = RestOf<IComplaintStatus>;

export type NewRestComplaintStatus = RestOf<NewComplaintStatus>;

export type PartialUpdateRestComplaintStatus = RestOf<PartialUpdateComplaintStatus>;

export type EntityResponseType = HttpResponse<IComplaintStatus>;
export type EntityArrayResponseType = HttpResponse<IComplaintStatus[]>;

@Injectable({ providedIn: 'root' })
export class ComplaintStatusService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/complaint-statuses', 'rdcomplaint');

  create(complaintStatus: NewComplaintStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaintStatus);
    return this.http
      .post<RestComplaintStatus>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(complaintStatus: IComplaintStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaintStatus);
    return this.http
      .put<RestComplaintStatus>(`${this.resourceUrl}/${this.getComplaintStatusIdentifier(complaintStatus)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(complaintStatus: PartialUpdateComplaintStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaintStatus);
    return this.http
      .patch<RestComplaintStatus>(`${this.resourceUrl}/${this.getComplaintStatusIdentifier(complaintStatus)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestComplaintStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestComplaintStatus[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getComplaintStatusIdentifier(complaintStatus: Pick<IComplaintStatus, 'id'>): number {
    return complaintStatus.id;
  }

  compareComplaintStatus(o1: Pick<IComplaintStatus, 'id'> | null, o2: Pick<IComplaintStatus, 'id'> | null): boolean {
    return o1 && o2 ? this.getComplaintStatusIdentifier(o1) === this.getComplaintStatusIdentifier(o2) : o1 === o2;
  }

  addComplaintStatusToCollectionIfMissing<Type extends Pick<IComplaintStatus, 'id'>>(
    complaintStatusCollection: Type[],
    ...complaintStatusesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const complaintStatuses: Type[] = complaintStatusesToCheck.filter(isPresent);
    if (complaintStatuses.length > 0) {
      const complaintStatusCollectionIdentifiers = complaintStatusCollection.map(complaintStatusItem =>
        this.getComplaintStatusIdentifier(complaintStatusItem),
      );
      const complaintStatusesToAdd = complaintStatuses.filter(complaintStatusItem => {
        const complaintStatusIdentifier = this.getComplaintStatusIdentifier(complaintStatusItem);
        if (complaintStatusCollectionIdentifiers.includes(complaintStatusIdentifier)) {
          return false;
        }
        complaintStatusCollectionIdentifiers.push(complaintStatusIdentifier);
        return true;
      });
      return [...complaintStatusesToAdd, ...complaintStatusCollection];
    }
    return complaintStatusCollection;
  }

  protected convertDateFromClient<T extends IComplaintStatus | NewComplaintStatus | PartialUpdateComplaintStatus>(
    complaintStatus: T,
  ): RestOf<T> {
    return {
      ...complaintStatus,
      created_at: complaintStatus.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restComplaintStatus: RestComplaintStatus): IComplaintStatus {
    return {
      ...restComplaintStatus,
      created_at: restComplaintStatus.created_at ? dayjs(restComplaintStatus.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestComplaintStatus>): HttpResponse<IComplaintStatus> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestComplaintStatus[]>): HttpResponse<IComplaintStatus[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
