import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReflector, NewReflector } from '../reflector.model';

export type PartialUpdateReflector = Partial<IReflector> & Pick<IReflector, 'id'>;

type RestOf<T extends IReflector | NewReflector> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestReflector = RestOf<IReflector>;

export type NewRestReflector = RestOf<NewReflector>;

export type PartialUpdateRestReflector = RestOf<PartialUpdateReflector>;

export type EntityResponseType = HttpResponse<IReflector>;
export type EntityArrayResponseType = HttpResponse<IReflector[]>;

@Injectable({ providedIn: 'root' })
export class ReflectorService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reflectors', 'rdcomplaint');

  create(reflector: NewReflector): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reflector);
    return this.http
      .post<RestReflector>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reflector: IReflector): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reflector);
    return this.http
      .put<RestReflector>(`${this.resourceUrl}/${this.getReflectorIdentifier(reflector)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reflector: PartialUpdateReflector): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reflector);
    return this.http
      .patch<RestReflector>(`${this.resourceUrl}/${this.getReflectorIdentifier(reflector)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReflector>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReflector[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReflectorIdentifier(reflector: Pick<IReflector, 'id'>): number {
    return reflector.id;
  }

  compareReflector(o1: Pick<IReflector, 'id'> | null, o2: Pick<IReflector, 'id'> | null): boolean {
    return o1 && o2 ? this.getReflectorIdentifier(o1) === this.getReflectorIdentifier(o2) : o1 === o2;
  }

  addReflectorToCollectionIfMissing<Type extends Pick<IReflector, 'id'>>(
    reflectorCollection: Type[],
    ...reflectorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reflectors: Type[] = reflectorsToCheck.filter(isPresent);
    if (reflectors.length > 0) {
      const reflectorCollectionIdentifiers = reflectorCollection.map(reflectorItem => this.getReflectorIdentifier(reflectorItem));
      const reflectorsToAdd = reflectors.filter(reflectorItem => {
        const reflectorIdentifier = this.getReflectorIdentifier(reflectorItem);
        if (reflectorCollectionIdentifiers.includes(reflectorIdentifier)) {
          return false;
        }
        reflectorCollectionIdentifiers.push(reflectorIdentifier);
        return true;
      });
      return [...reflectorsToAdd, ...reflectorCollection];
    }
    return reflectorCollection;
  }

  protected convertDateFromClient<T extends IReflector | NewReflector | PartialUpdateReflector>(reflector: T): RestOf<T> {
    return {
      ...reflector,
      created_at: reflector.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReflector: RestReflector): IReflector {
    return {
      ...restReflector,
      created_at: restReflector.created_at ? dayjs(restReflector.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReflector>): HttpResponse<IReflector> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReflector[]>): HttpResponse<IReflector[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
