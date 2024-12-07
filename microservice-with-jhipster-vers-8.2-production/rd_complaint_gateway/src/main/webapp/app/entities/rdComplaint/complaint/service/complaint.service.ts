import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComplaint, NewComplaint } from '../complaint.model';

export type PartialUpdateComplaint = Partial<IComplaint> & Pick<IComplaint, 'id'>;

type RestOf<T extends IComplaint | NewComplaint> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestComplaint = RestOf<IComplaint>;

export type NewRestComplaint = RestOf<NewComplaint>;

export type PartialUpdateRestComplaint = RestOf<PartialUpdateComplaint>;

export type EntityResponseType = HttpResponse<IComplaint>;
export type EntityArrayResponseType = HttpResponse<IComplaint[]>;

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/complaints', 'rdcomplaint');

  create(complaint: NewComplaint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaint);
    return this.http
      .post<RestComplaint>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(complaint: IComplaint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaint);
    return this.http
      .put<RestComplaint>(`${this.resourceUrl}/${this.getComplaintIdentifier(complaint)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(complaint: PartialUpdateComplaint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaint);
    return this.http
      .patch<RestComplaint>(`${this.resourceUrl}/${this.getComplaintIdentifier(complaint)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestComplaint>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestComplaint[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getComplaintIdentifier(complaint: Pick<IComplaint, 'id'>): number {
    return complaint.id;
  }

  compareComplaint(o1: Pick<IComplaint, 'id'> | null, o2: Pick<IComplaint, 'id'> | null): boolean {
    return o1 && o2 ? this.getComplaintIdentifier(o1) === this.getComplaintIdentifier(o2) : o1 === o2;
  }

  addComplaintToCollectionIfMissing<Type extends Pick<IComplaint, 'id'>>(
    complaintCollection: Type[],
    ...complaintsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const complaints: Type[] = complaintsToCheck.filter(isPresent);
    if (complaints.length > 0) {
      const complaintCollectionIdentifiers = complaintCollection.map(complaintItem => this.getComplaintIdentifier(complaintItem));
      const complaintsToAdd = complaints.filter(complaintItem => {
        const complaintIdentifier = this.getComplaintIdentifier(complaintItem);
        if (complaintCollectionIdentifiers.includes(complaintIdentifier)) {
          return false;
        }
        complaintCollectionIdentifiers.push(complaintIdentifier);
        return true;
      });
      return [...complaintsToAdd, ...complaintCollection];
    }
    return complaintCollection;
  }

  protected convertDateFromClient<T extends IComplaint | NewComplaint | PartialUpdateComplaint>(complaint: T): RestOf<T> {
    return {
      ...complaint,
      created_at: complaint.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restComplaint: RestComplaint): IComplaint {
    return {
      ...restComplaint,
      created_at: restComplaint.created_at ? dayjs(restComplaint.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestComplaint>): HttpResponse<IComplaint> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestComplaint[]>): HttpResponse<IComplaint[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
