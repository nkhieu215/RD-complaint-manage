import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReason } from '../reason.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../reason.test-samples';

import { ReasonService, RestReason } from './reason.service';

const requireRestSample: RestReason = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
};

describe('Reason Service', () => {
  let service: ReasonService;
  let httpMock: HttpTestingController;
  let expectedResult: IReason | IReason[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReasonService);
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

    it('should create a Reason', () => {
      const reason = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reason).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reason', () => {
      const reason = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reason).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reason', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reason', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Reason', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReasonToCollectionIfMissing', () => {
      it('should add a Reason to an empty array', () => {
        const reason: IReason = sampleWithRequiredData;
        expectedResult = service.addReasonToCollectionIfMissing([], reason);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reason);
      });

      it('should not add a Reason to an array that contains it', () => {
        const reason: IReason = sampleWithRequiredData;
        const reasonCollection: IReason[] = [
          {
            ...reason,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReasonToCollectionIfMissing(reasonCollection, reason);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reason to an array that doesn't contain it", () => {
        const reason: IReason = sampleWithRequiredData;
        const reasonCollection: IReason[] = [sampleWithPartialData];
        expectedResult = service.addReasonToCollectionIfMissing(reasonCollection, reason);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reason);
      });

      it('should add only unique Reason to an array', () => {
        const reasonArray: IReason[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reasonCollection: IReason[] = [sampleWithRequiredData];
        expectedResult = service.addReasonToCollectionIfMissing(reasonCollection, ...reasonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reason: IReason = sampleWithRequiredData;
        const reason2: IReason = sampleWithPartialData;
        expectedResult = service.addReasonToCollectionIfMissing([], reason, reason2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reason);
        expect(expectedResult).toContain(reason2);
      });

      it('should accept null and undefined values', () => {
        const reason: IReason = sampleWithRequiredData;
        expectedResult = service.addReasonToCollectionIfMissing([], null, reason, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reason);
      });

      it('should return initial array if no Reason is added', () => {
        const reasonCollection: IReason[] = [sampleWithRequiredData];
        expectedResult = service.addReasonToCollectionIfMissing(reasonCollection, undefined, null);
        expect(expectedResult).toEqual(reasonCollection);
      });
    });

    describe('compareReason', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReason(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReason(entity1, entity2);
        const compareResult2 = service.compareReason(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReason(entity1, entity2);
        const compareResult2 = service.compareReason(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReason(entity1, entity2);
        const compareResult2 = service.compareReason(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
