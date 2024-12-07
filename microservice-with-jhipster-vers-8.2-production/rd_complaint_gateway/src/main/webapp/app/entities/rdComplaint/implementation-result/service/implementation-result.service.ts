import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IImplementationResult, NewImplementationResult } from '../implementation-result.model';

export type PartialUpdateImplementationResult = Partial<IImplementationResult> & Pick<IImplementationResult, 'id'>;

type RestOf<T extends IImplementationResult | NewImplementationResult> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

export type RestImplementationResult = RestOf<IImplementationResult>;

export type NewRestImplementationResult = RestOf<NewImplementationResult>;

export type PartialUpdateRestImplementationResult = RestOf<PartialUpdateImplementationResult>;

export type EntityResponseType = HttpResponse<IImplementationResult>;
export type EntityArrayResponseType = HttpResponse<IImplementationResult[]>;

@Injectable({ providedIn: 'root' })
export class ImplementationResultService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/implementation-results', 'rdcomplaint');

  create(implementationResult: NewImplementationResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(implementationResult);
    return this.http
      .post<RestImplementationResult>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(implementationResult: IImplementationResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(implementationResult);
    return this.http
      .put<RestImplementationResult>(`${this.resourceUrl}/${this.getImplementationResultIdentifier(implementationResult)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(implementationResult: PartialUpdateImplementationResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(implementationResult);
    return this.http
      .patch<RestImplementationResult>(`${this.resourceUrl}/${this.getImplementationResultIdentifier(implementationResult)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestImplementationResult>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestImplementationResult[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getImplementationResultIdentifier(implementationResult: Pick<IImplementationResult, 'id'>): number {
    return implementationResult.id;
  }

  compareImplementationResult(o1: Pick<IImplementationResult, 'id'> | null, o2: Pick<IImplementationResult, 'id'> | null): boolean {
    return o1 && o2 ? this.getImplementationResultIdentifier(o1) === this.getImplementationResultIdentifier(o2) : o1 === o2;
  }

  addImplementationResultToCollectionIfMissing<Type extends Pick<IImplementationResult, 'id'>>(
    implementationResultCollection: Type[],
    ...implementationResultsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const implementationResults: Type[] = implementationResultsToCheck.filter(isPresent);
    if (implementationResults.length > 0) {
      const implementationResultCollectionIdentifiers = implementationResultCollection.map(implementationResultItem =>
        this.getImplementationResultIdentifier(implementationResultItem),
      );
      const implementationResultsToAdd = implementationResults.filter(implementationResultItem => {
        const implementationResultIdentifier = this.getImplementationResultIdentifier(implementationResultItem);
        if (implementationResultCollectionIdentifiers.includes(implementationResultIdentifier)) {
          return false;
        }
        implementationResultCollectionIdentifiers.push(implementationResultIdentifier);
        return true;
      });
      return [...implementationResultsToAdd, ...implementationResultCollection];
    }
    return implementationResultCollection;
  }

  protected convertDateFromClient<T extends IImplementationResult | NewImplementationResult | PartialUpdateImplementationResult>(
    implementationResult: T,
  ): RestOf<T> {
    return {
      ...implementationResult,
      created_at: implementationResult.created_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restImplementationResult: RestImplementationResult): IImplementationResult {
    return {
      ...restImplementationResult,
      created_at: restImplementationResult.created_at ? dayjs(restImplementationResult.created_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestImplementationResult>): HttpResponse<IImplementationResult> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestImplementationResult[]>): HttpResponse<IImplementationResult[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
