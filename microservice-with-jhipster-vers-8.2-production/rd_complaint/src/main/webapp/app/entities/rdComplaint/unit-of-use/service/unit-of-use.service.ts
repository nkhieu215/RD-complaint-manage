import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUnitOfUse, NewUnitOfUse } from '../unit-of-use.model';

export type PartialUpdateUnitOfUse = Partial<IUnitOfUse> & Pick<IUnitOfUse, 'id'>;

type RestOf<T extends IUnitOfUse | NewUnitOfUse> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestUnitOfUse = RestOf<IUnitOfUse>;

export type NewRestUnitOfUse = RestOf<NewUnitOfUse>;

export type PartialUpdateRestUnitOfUse = RestOf<PartialUpdateUnitOfUse>;

export type EntityResponseType = HttpResponse<IUnitOfUse>;
export type EntityArrayResponseType = HttpResponse<IUnitOfUse[]>;

@Injectable({ providedIn: 'root' })
export class UnitOfUseService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/unit-of-uses', 'rdcomplaint');

  create(unitOfUse: NewUnitOfUse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(unitOfUse);
    return this.http
      .post<RestUnitOfUse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(unitOfUse: IUnitOfUse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(unitOfUse);
    return this.http
      .put<RestUnitOfUse>(`${this.resourceUrl}/${this.getUnitOfUseIdentifier(unitOfUse)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(unitOfUse: PartialUpdateUnitOfUse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(unitOfUse);
    return this.http
      .patch<RestUnitOfUse>(`${this.resourceUrl}/${this.getUnitOfUseIdentifier(unitOfUse)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUnitOfUse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUnitOfUse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUnitOfUseIdentifier(unitOfUse: Pick<IUnitOfUse, 'id'>): number {
    return unitOfUse.id;
  }

  compareUnitOfUse(o1: Pick<IUnitOfUse, 'id'> | null, o2: Pick<IUnitOfUse, 'id'> | null): boolean {
    return o1 && o2 ? this.getUnitOfUseIdentifier(o1) === this.getUnitOfUseIdentifier(o2) : o1 === o2;
  }

  addUnitOfUseToCollectionIfMissing<Type extends Pick<IUnitOfUse, 'id'>>(
    unitOfUseCollection: Type[],
    ...unitOfUsesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const unitOfUses: Type[] = unitOfUsesToCheck.filter(isPresent);
    if (unitOfUses.length > 0) {
      const unitOfUseCollectionIdentifiers = unitOfUseCollection.map(unitOfUseItem => this.getUnitOfUseIdentifier(unitOfUseItem));
      const unitOfUsesToAdd = unitOfUses.filter(unitOfUseItem => {
        const unitOfUseIdentifier = this.getUnitOfUseIdentifier(unitOfUseItem);
        if (unitOfUseCollectionIdentifiers.includes(unitOfUseIdentifier)) {
          return false;
        }
        unitOfUseCollectionIdentifiers.push(unitOfUseIdentifier);
        return true;
      });
      return [...unitOfUsesToAdd, ...unitOfUseCollection];
    }
    return unitOfUseCollection;
  }

  protected convertDateFromClient<T extends IUnitOfUse | NewUnitOfUse | PartialUpdateUnitOfUse>(unitOfUse: T): RestOf<T> {
    return {
      ...unitOfUse,
      created_at: unitOfUse.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUnitOfUse: RestUnitOfUse): IUnitOfUse {
    return {
      ...restUnitOfUse,
      created_at: restUnitOfUse.created_at ? dayjs(restUnitOfUse.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUnitOfUse>): HttpResponse<IUnitOfUse> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUnitOfUse[]>): HttpResponse<IUnitOfUse[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
