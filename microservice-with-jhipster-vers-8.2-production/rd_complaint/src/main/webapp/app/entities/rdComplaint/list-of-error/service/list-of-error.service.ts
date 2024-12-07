import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IListOfError, NewListOfError } from '../list-of-error.model';

export type PartialUpdateListOfError = Partial<IListOfError> & Pick<IListOfError, 'id'>;

type RestOf<T extends IListOfError | NewListOfError> = Omit<T, 'created_at' | 'updated_at' | 'check_time'> & {
  created_at?: string | null;
  updated_at?: string | null;
  check_time?: string | null;
};

export type RestListOfError = RestOf<IListOfError>;

export type NewRestListOfError = RestOf<NewListOfError>;

export type PartialUpdateRestListOfError = RestOf<PartialUpdateListOfError>;

export type EntityResponseType = HttpResponse<IListOfError>;
export type EntityArrayResponseType = HttpResponse<IListOfError[]>;

@Injectable({ providedIn: 'root' })
export class ListOfErrorService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/list-of-errors', 'rdcomplaint');

  create(listOfError: NewListOfError): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(listOfError);
    return this.http
      .post<RestListOfError>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(listOfError: IListOfError): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(listOfError);
    return this.http
      .put<RestListOfError>(`${this.resourceUrl}/${this.getListOfErrorIdentifier(listOfError)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(listOfError: PartialUpdateListOfError): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(listOfError);
    return this.http
      .patch<RestListOfError>(`${this.resourceUrl}/${this.getListOfErrorIdentifier(listOfError)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestListOfError>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestListOfError[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getListOfErrorIdentifier(listOfError: Pick<IListOfError, 'id'>): number {
    return listOfError.id;
  }

  compareListOfError(o1: Pick<IListOfError, 'id'> | null, o2: Pick<IListOfError, 'id'> | null): boolean {
    return o1 && o2 ? this.getListOfErrorIdentifier(o1) === this.getListOfErrorIdentifier(o2) : o1 === o2;
  }

  addListOfErrorToCollectionIfMissing<Type extends Pick<IListOfError, 'id'>>(
    listOfErrorCollection: Type[],
    ...listOfErrorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const listOfErrors: Type[] = listOfErrorsToCheck.filter(isPresent);
    if (listOfErrors.length > 0) {
      const listOfErrorCollectionIdentifiers = listOfErrorCollection.map(listOfErrorItem => this.getListOfErrorIdentifier(listOfErrorItem));
      const listOfErrorsToAdd = listOfErrors.filter(listOfErrorItem => {
        const listOfErrorIdentifier = this.getListOfErrorIdentifier(listOfErrorItem);
        if (listOfErrorCollectionIdentifiers.includes(listOfErrorIdentifier)) {
          return false;
        }
        listOfErrorCollectionIdentifiers.push(listOfErrorIdentifier);
        return true;
      });
      return [...listOfErrorsToAdd, ...listOfErrorCollection];
    }
    return listOfErrorCollection;
  }

  protected convertDateFromClient<T extends IListOfError | NewListOfError | PartialUpdateListOfError>(listOfError: T): RestOf<T> {
    return {
      ...listOfError,
      created_at: listOfError.created_at?.toJSON() ?? null,
      updated_at: listOfError.updated_at?.toJSON() ?? null,
      check_time: listOfError.check_time?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restListOfError: RestListOfError): IListOfError {
    return {
      ...restListOfError,
      created_at: restListOfError.created_at ? dayjs(restListOfError.created_at) : undefined,
      updated_at: restListOfError.updated_at ? dayjs(restListOfError.updated_at) : undefined,
      check_time: restListOfError.check_time ? dayjs(restListOfError.check_time) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestListOfError>): HttpResponse<IListOfError> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestListOfError[]>): HttpResponse<IListOfError[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
