import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICheckerList, NewCheckerList } from '../checker-list.model';

export type PartialUpdateCheckerList = Partial<ICheckerList> & Pick<ICheckerList, 'id'>;

type RestOf<T extends ICheckerList | NewCheckerList> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestCheckerList = RestOf<ICheckerList>;

export type NewRestCheckerList = RestOf<NewCheckerList>;

export type PartialUpdateRestCheckerList = RestOf<PartialUpdateCheckerList>;

export type EntityResponseType = HttpResponse<ICheckerList>;
export type EntityArrayResponseType = HttpResponse<ICheckerList[]>;

@Injectable({ providedIn: 'root' })
export class CheckerListService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/checker-lists', 'rdcomplaint');

  create(checkerList: NewCheckerList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkerList);
    return this.http
      .post<RestCheckerList>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(checkerList: ICheckerList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkerList);
    return this.http
      .put<RestCheckerList>(`${this.resourceUrl}/${this.getCheckerListIdentifier(checkerList)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(checkerList: PartialUpdateCheckerList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkerList);
    return this.http
      .patch<RestCheckerList>(`${this.resourceUrl}/${this.getCheckerListIdentifier(checkerList)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCheckerList>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCheckerList[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCheckerListIdentifier(checkerList: Pick<ICheckerList, 'id'>): number {
    return checkerList.id;
  }

  compareCheckerList(o1: Pick<ICheckerList, 'id'> | null, o2: Pick<ICheckerList, 'id'> | null): boolean {
    return o1 && o2 ? this.getCheckerListIdentifier(o1) === this.getCheckerListIdentifier(o2) : o1 === o2;
  }

  addCheckerListToCollectionIfMissing<Type extends Pick<ICheckerList, 'id'>>(
    checkerListCollection: Type[],
    ...checkerListsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const checkerLists: Type[] = checkerListsToCheck.filter(isPresent);
    if (checkerLists.length > 0) {
      const checkerListCollectionIdentifiers = checkerListCollection.map(checkerListItem => this.getCheckerListIdentifier(checkerListItem));
      const checkerListsToAdd = checkerLists.filter(checkerListItem => {
        const checkerListIdentifier = this.getCheckerListIdentifier(checkerListItem);
        if (checkerListCollectionIdentifiers.includes(checkerListIdentifier)) {
          return false;
        }
        checkerListCollectionIdentifiers.push(checkerListIdentifier);
        return true;
      });
      return [...checkerListsToAdd, ...checkerListCollection];
    }
    return checkerListCollection;
  }

  protected convertDateFromClient<T extends ICheckerList | NewCheckerList | PartialUpdateCheckerList>(checkerList: T): RestOf<T> {
    return {
      ...checkerList,
      created_at: checkerList.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCheckerList: RestCheckerList): ICheckerList {
    return {
      ...restCheckerList,
      created_at: restCheckerList.created_at ? dayjs(restCheckerList.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCheckerList>): HttpResponse<ICheckerList> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCheckerList[]>): HttpResponse<ICheckerList[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
