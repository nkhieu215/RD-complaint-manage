import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReason, NewReason } from '../reason.model';

export type PartialUpdateReason = Partial<IReason> & Pick<IReason, 'id'>;

type RestOf<T extends IReason | NewReason> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestReason = RestOf<IReason>;

export type NewRestReason = RestOf<NewReason>;

export type PartialUpdateRestReason = RestOf<PartialUpdateReason>;

export type EntityResponseType = HttpResponse<IReason>;
export type EntityArrayResponseType = HttpResponse<IReason[]>;

@Injectable({ providedIn: 'root' })
export class ReasonService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reasons', 'rdcomplaint');

  create(reason: NewReason): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reason);
    return this.http
      .post<RestReason>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reason: IReason): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reason);
    return this.http
      .put<RestReason>(`${this.resourceUrl}/${this.getReasonIdentifier(reason)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reason: PartialUpdateReason): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reason);
    return this.http
      .patch<RestReason>(`${this.resourceUrl}/${this.getReasonIdentifier(reason)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReason>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReason[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReasonIdentifier(reason: Pick<IReason, 'id'>): number {
    return reason.id;
  }

  compareReason(o1: Pick<IReason, 'id'> | null, o2: Pick<IReason, 'id'> | null): boolean {
    return o1 && o2 ? this.getReasonIdentifier(o1) === this.getReasonIdentifier(o2) : o1 === o2;
  }

  addReasonToCollectionIfMissing<Type extends Pick<IReason, 'id'>>(
    reasonCollection: Type[],
    ...reasonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reasons: Type[] = reasonsToCheck.filter(isPresent);
    if (reasons.length > 0) {
      const reasonCollectionIdentifiers = reasonCollection.map(reasonItem => this.getReasonIdentifier(reasonItem));
      const reasonsToAdd = reasons.filter(reasonItem => {
        const reasonIdentifier = this.getReasonIdentifier(reasonItem);
        if (reasonCollectionIdentifiers.includes(reasonIdentifier)) {
          return false;
        }
        reasonCollectionIdentifiers.push(reasonIdentifier);
        return true;
      });
      return [...reasonsToAdd, ...reasonCollection];
    }
    return reasonCollection;
  }

  protected convertDateFromClient<T extends IReason | NewReason | PartialUpdateReason>(reason: T): RestOf<T> {
    return {
      ...reason,
      created_at: reason.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReason: RestReason): IReason {
    return {
      ...restReason,
      created_at: restReason.created_at ? dayjs(restReason.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReason>): HttpResponse<IReason> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReason[]>): HttpResponse<IReason[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
