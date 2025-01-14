import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IComplaintStatus } from '../complaint-status.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../complaint-status.test-samples';

import { ComplaintStatusService, RestComplaintStatus } from './complaint-status.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const requireRestSample: RestComplaintStatus = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
};

describe('ComplaintStatus Service', () => {
  let service: ComplaintStatusService;
  let httpMock: HttpTestingController;
  let expectedResult: IComplaintStatus | IComplaintStatus[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    expectedResult = null;
    service = TestBed.inject(ComplaintStatusService);
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

    it('should create a ComplaintStatus', () => {
      const complaintStatus = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(complaintStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ComplaintStatus', () => {
      const complaintStatus = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(complaintStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ComplaintStatus', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ComplaintStatus', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ComplaintStatus', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addComplaintStatusToCollectionIfMissing', () => {
      it('should add a ComplaintStatus to an empty array', () => {
        const complaintStatus: IComplaintStatus = sampleWithRequiredData;
        expectedResult = service.addComplaintStatusToCollectionIfMissing([], complaintStatus);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(complaintStatus);
      });

      it('should not add a ComplaintStatus to an array that contains it', () => {
        const complaintStatus: IComplaintStatus = sampleWithRequiredData;
        const complaintStatusCollection: IComplaintStatus[] = [
          {
            ...complaintStatus,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addComplaintStatusToCollectionIfMissing(complaintStatusCollection, complaintStatus);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ComplaintStatus to an array that doesn't contain it", () => {
        const complaintStatus: IComplaintStatus = sampleWithRequiredData;
        const complaintStatusCollection: IComplaintStatus[] = [sampleWithPartialData];
        expectedResult = service.addComplaintStatusToCollectionIfMissing(complaintStatusCollection, complaintStatus);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(complaintStatus);
      });

      it('should add only unique ComplaintStatus to an array', () => {
        const complaintStatusArray: IComplaintStatus[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const complaintStatusCollection: IComplaintStatus[] = [sampleWithRequiredData];
        expectedResult = service.addComplaintStatusToCollectionIfMissing(complaintStatusCollection, ...complaintStatusArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const complaintStatus: IComplaintStatus = sampleWithRequiredData;
        const complaintStatus2: IComplaintStatus = sampleWithPartialData;
        expectedResult = service.addComplaintStatusToCollectionIfMissing([], complaintStatus, complaintStatus2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(complaintStatus);
        expect(expectedResult).toContain(complaintStatus2);
      });

      it('should accept null and undefined values', () => {
        const complaintStatus: IComplaintStatus = sampleWithRequiredData;
        expectedResult = service.addComplaintStatusToCollectionIfMissing([], null, complaintStatus, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(complaintStatus);
      });

      it('should return initial array if no ComplaintStatus is added', () => {
        const complaintStatusCollection: IComplaintStatus[] = [sampleWithRequiredData];
        expectedResult = service.addComplaintStatusToCollectionIfMissing(complaintStatusCollection, undefined, null);
        expect(expectedResult).toEqual(complaintStatusCollection);
      });
    });

    describe('compareComplaintStatus', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareComplaintStatus(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareComplaintStatus(entity1, entity2);
        const compareResult2 = service.compareComplaintStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareComplaintStatus(entity1, entity2);
        const compareResult2 = service.compareComplaintStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareComplaintStatus(entity1, entity2);
        const compareResult2 = service.compareComplaintStatus(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
