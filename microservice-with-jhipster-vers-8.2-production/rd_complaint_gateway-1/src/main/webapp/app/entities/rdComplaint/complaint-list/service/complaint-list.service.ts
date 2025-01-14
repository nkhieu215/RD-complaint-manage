import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComplaintList, NewComplaintList } from '../complaint-list.model';

export type PartialUpdateComplaintList = Partial<IComplaintList> & Pick<IComplaintList, 'id'>;

type RestOf<T extends IComplaintList | NewComplaintList> = Omit<
  T,
  'production_time' | 'rectification_time' | 'created_at' | 'updated_at'
> & {
  production_time?: string | null;
  rectification_time?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type RestComplaintList = RestOf<IComplaintList>;

export type NewRestComplaintList = RestOf<NewComplaintList>;

export type PartialUpdateRestComplaintList = RestOf<PartialUpdateComplaintList>;

export type EntityResponseType = HttpResponse<IComplaintList>;
export type EntityArrayResponseType = HttpResponse<IComplaintList[]>;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" })
};
@Injectable({ providedIn: 'root' })
export class ComplaintListService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/complaint-lists', 'rdcomplaint');
  protected getAllUrl = this.applicationConfigService.getEndpointFor('api/complaint-lists/get-all', 'rdcomplaint');
  protected getGuideListInsertUrl = this.applicationConfigService.getEndpointFor('api/complaint-lists/get-guide-list-insert', 'rdcomplaint');
  protected insertUrl = this.applicationConfigService.getEndpointFor('api/complaint-lists/insert', 'rdcomplaint');
  protected updateUrl = this.applicationConfigService.getEndpointFor('api/complaint-lists/update', 'rdcomplaint');
  protected errorDetailtUrl = this.applicationConfigService.getEndpointFor('api/complaint-lists/error-detail', 'rdcomplaint');
  protected uploadImageUrl = this.applicationConfigService.getEndpointFor('api/complaint-lists/uploadImage', 'rdcomplaint');

  create(complaintList: NewComplaintList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaintList);
    return this.http
      .post<RestComplaintList>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(complaintList: IComplaintList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaintList);
    return this.http
      .put<RestComplaintList>(`${this.resourceUrl}/${this.getComplaintListIdentifier(complaintList)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(complaintList: PartialUpdateComplaintList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(complaintList);
    return this.http
      .patch<RestComplaintList>(`${this.resourceUrl}/${this.getComplaintListIdentifier(complaintList)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestComplaintList>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestComplaintList[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }
  //-------------------------------------------------------------------- new api ------------------------------------------------------------------------------
  getAll(): Observable<any> {
    return this.http.get<any>(this.getAllUrl);
  }
  getGuideListInsert(): Observable<any> {
    return this.http.get<any>(this.getGuideListInsertUrl);
  }
  insertComplaintInfo(body: any) {
    return this.http.post<any>(this.insertUrl, body);
  }
  getErrorDetail(id: number) {
    return this.http.get<any>(`${this.errorDetailtUrl}/${id}`);
  }
  updateComplaintInfo(body: any) {
    return this.http.post(this.updateUrl, body);
  }
  // getAllCategories(): any {
  //   return this.http.post("http://192.168.68.92/qms/categories/crud-error-code-2", {
  //     typeRequest: "BROWS_ALL",
  //   }, httpOptions);
  // }
  //--------------------------------------------------------------------------------------------------------------------------------------------------
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getComplaintListIdentifier(complaintList: Pick<IComplaintList, 'id'>): number {
    return complaintList.id;
  }

  compareComplaintList(o1: Pick<IComplaintList, 'id'> | null, o2: Pick<IComplaintList, 'id'> | null): boolean {
    return o1 && o2 ? this.getComplaintListIdentifier(o1) === this.getComplaintListIdentifier(o2) : o1 === o2;
  }
  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData;
    formData.append('file', file);
    const req = new HttpRequest('POST', this.uploadImageUrl, formData, { responseType: 'text' });
    return this.http.request(req);
  }
  addComplaintListToCollectionIfMissing<Type extends Pick<IComplaintList, 'id'>>(
    complaintListCollection: Type[],
    ...complaintListsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const complaintLists: Type[] = complaintListsToCheck.filter(isPresent);
    if (complaintLists.length > 0) {
      const complaintListCollectionIdentifiers = complaintListCollection.map(complaintListItem =>
        this.getComplaintListIdentifier(complaintListItem),
      );
      const complaintListsToAdd = complaintLists.filter(complaintListItem => {
        const complaintListIdentifier = this.getComplaintListIdentifier(complaintListItem);
        if (complaintListCollectionIdentifiers.includes(complaintListIdentifier)) {
          return false;
        }
        complaintListCollectionIdentifiers.push(complaintListIdentifier);
        return true;
      });
      return [...complaintListsToAdd, ...complaintListCollection];
    }
    return complaintListCollection;
  }

  protected convertDateFromClient<T extends IComplaintList | NewComplaintList | PartialUpdateComplaintList>(complaintList: T): RestOf<T> {
    return {
      ...complaintList,
      production_time: complaintList.production_time?.toJSON() ?? null,
      rectification_time: complaintList.rectification_time?.toJSON() ?? null,
      created_at: complaintList.created_at?.toJSON() ?? null,
      updated_at: complaintList.updated_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restComplaintList: RestComplaintList): IComplaintList {
    return {
      ...restComplaintList,
      production_time: restComplaintList.production_time ? dayjs(restComplaintList.production_time) : undefined,
      rectification_time: restComplaintList.rectification_time ? dayjs(restComplaintList.rectification_time) : undefined,
      created_at: restComplaintList.created_at ? dayjs(restComplaintList.created_at) : undefined,
      updated_at: restComplaintList.updated_at ? dayjs(restComplaintList.updated_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestComplaintList>): HttpResponse<IComplaintList> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestComplaintList[]>): HttpResponse<IComplaintList[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
