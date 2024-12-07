import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IComplaintList } from '../complaint-list.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../complaint-list.test-samples';

import { ComplaintListService, RestComplaintList } from './complaint-list.service';

const requireRestSample: RestComplaintList = {
  ...sampleWithRequiredData,
  production_time: sampleWithRequiredData.production_time?.toJSON(),
  rectification_time: sampleWithRequiredData.rectification_time?.toJSON(),
  created_at: sampleWithRequiredData.created_at?.toJSON(),
  updated_at: sampleWithRequiredData.updated_at?.toJSON(),
};

describe('ComplaintList Service', () => {
  let service: ComplaintListService;
  let httpMock: HttpTestingController;
  let expectedResult: IComplaintList | IComplaintList[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ComplaintListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ComplaintList', () => {
      const complaintList = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(complaintList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ComplaintList', () => {
      const complaintList = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(complaintList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ComplaintList', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ComplaintList', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ComplaintList', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addComplaintListToCollectionIfMissing', () => {
      it('should add a ComplaintList to an empty array', () => {
        const complaintList: IComplaintList = sampleWithRequiredData;
        expectedResult = service.addComplaintListToCollectionIfMissing([], complaintList);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(complaintList);
      });

      it('should not add a ComplaintList to an array that contains it', () => {
        const complaintList: IComplaintList = sampleWithRequiredData;
        const complaintListCollection: IComplaintList[] = [
          {
            ...complaintList,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addComplaintListToCollectionIfMissing(complaintListCollection, complaintList);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ComplaintList to an array that doesn't contain it", () => {
        const complaintList: IComplaintList = sampleWithRequiredData;
        const complaintListCollection: IComplaintList[] = [sampleWithPartialData];
        expectedResult = service.addComplaintListToCollectionIfMissing(complaintListCollection, complaintList);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(complaintList);
      });

      it('should add only unique ComplaintList to an array', () => {
        const complaintListArray: IComplaintList[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const complaintListCollection: IComplaintList[] = [sampleWithRequiredData];
        expectedResult = service.addComplaintListToCollectionIfMissing(complaintListCollection, ...complaintListArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const complaintList: IComplaintList = sampleWithRequiredData;
        const complaintList2: IComplaintList = sampleWithPartialData;
        expectedResult = service.addComplaintListToCollectionIfMissing([], complaintList, complaintList2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(complaintList);
        expect(expectedResult).toContain(complaintList2);
      });

      it('should accept null and undefined values', () => {
        const complaintList: IComplaintList = sampleWithRequiredData;
        expectedResult = service.addComplaintListToCollectionIfMissing([], null, complaintList, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(complaintList);
      });

      it('should return initial array if no ComplaintList is added', () => {
        const complaintListCollection: IComplaintList[] = [sampleWithRequiredData];
        expectedResult = service.addComplaintListToCollectionIfMissing(complaintListCollection, undefined, null);
        expect(expectedResult).toEqual(complaintListCollection);
      });
    });

    describe('compareComplaintList', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareComplaintList(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareComplaintList(entity1, entity2);
        const compareResult2 = service.compareComplaintList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareComplaintList(entity1, entity2);
        const compareResult2 = service.compareComplaintList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareComplaintList(entity1, entity2);
        const compareResult2 = service.compareComplaintList(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
