import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IImplementationResult } from '../implementation-result.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../implementation-result.test-samples';

import { ImplementationResultService, RestImplementationResult } from './implementation-result.service';

const requireRestSample: RestImplementationResult = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
};

describe('ImplementationResult Service', () => {
  let service: ImplementationResultService;
  let httpMock: HttpTestingController;
  let expectedResult: IImplementationResult | IImplementationResult[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ImplementationResultService);
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

    it('should create a ImplementationResult', () => {
      const implementationResult = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(implementationResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ImplementationResult', () => {
      const implementationResult = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(implementationResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ImplementationResult', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ImplementationResult', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ImplementationResult', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addImplementationResultToCollectionIfMissing', () => {
      it('should add a ImplementationResult to an empty array', () => {
        const implementationResult: IImplementationResult = sampleWithRequiredData;
        expectedResult = service.addImplementationResultToCollectionIfMissing([], implementationResult);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(implementationResult);
      });

      it('should not add a ImplementationResult to an array that contains it', () => {
        const implementationResult: IImplementationResult = sampleWithRequiredData;
        const implementationResultCollection: IImplementationResult[] = [
          {
            ...implementationResult,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addImplementationResultToCollectionIfMissing(implementationResultCollection, implementationResult);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ImplementationResult to an array that doesn't contain it", () => {
        const implementationResult: IImplementationResult = sampleWithRequiredData;
        const implementationResultCollection: IImplementationResult[] = [sampleWithPartialData];
        expectedResult = service.addImplementationResultToCollectionIfMissing(implementationResultCollection, implementationResult);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(implementationResult);
      });

      it('should add only unique ImplementationResult to an array', () => {
        const implementationResultArray: IImplementationResult[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const implementationResultCollection: IImplementationResult[] = [sampleWithRequiredData];
        expectedResult = service.addImplementationResultToCollectionIfMissing(implementationResultCollection, ...implementationResultArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const implementationResult: IImplementationResult = sampleWithRequiredData;
        const implementationResult2: IImplementationResult = sampleWithPartialData;
        expectedResult = service.addImplementationResultToCollectionIfMissing([], implementationResult, implementationResult2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(implementationResult);
        expect(expectedResult).toContain(implementationResult2);
      });

      it('should accept null and undefined values', () => {
        const implementationResult: IImplementationResult = sampleWithRequiredData;
        expectedResult = service.addImplementationResultToCollectionIfMissing([], null, implementationResult, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(implementationResult);
      });

      it('should return initial array if no ImplementationResult is added', () => {
        const implementationResultCollection: IImplementationResult[] = [sampleWithRequiredData];
        expectedResult = service.addImplementationResultToCollectionIfMissing(implementationResultCollection, undefined, null);
        expect(expectedResult).toEqual(implementationResultCollection);
      });
    });

    describe('compareImplementationResult', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareImplementationResult(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareImplementationResult(entity1, entity2);
        const compareResult2 = service.compareImplementationResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareImplementationResult(entity1, entity2);
        const compareResult2 = service.compareImplementationResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareImplementationResult(entity1, entity2);
        const compareResult2 = service.compareImplementationResult(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
