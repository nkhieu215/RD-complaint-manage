import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUnitOfUse } from '../unit-of-use.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../unit-of-use.test-samples';

import { UnitOfUseService, RestUnitOfUse } from './unit-of-use.service';

const requireRestSample: RestUnitOfUse = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
};

describe('UnitOfUse Service', () => {
  let service: UnitOfUseService;
  let httpMock: HttpTestingController;
  let expectedResult: IUnitOfUse | IUnitOfUse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UnitOfUseService);
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

    it('should create a UnitOfUse', () => {
      const unitOfUse = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(unitOfUse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UnitOfUse', () => {
      const unitOfUse = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(unitOfUse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UnitOfUse', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UnitOfUse', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UnitOfUse', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUnitOfUseToCollectionIfMissing', () => {
      it('should add a UnitOfUse to an empty array', () => {
        const unitOfUse: IUnitOfUse = sampleWithRequiredData;
        expectedResult = service.addUnitOfUseToCollectionIfMissing([], unitOfUse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unitOfUse);
      });

      it('should not add a UnitOfUse to an array that contains it', () => {
        const unitOfUse: IUnitOfUse = sampleWithRequiredData;
        const unitOfUseCollection: IUnitOfUse[] = [
          {
            ...unitOfUse,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUnitOfUseToCollectionIfMissing(unitOfUseCollection, unitOfUse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UnitOfUse to an array that doesn't contain it", () => {
        const unitOfUse: IUnitOfUse = sampleWithRequiredData;
        const unitOfUseCollection: IUnitOfUse[] = [sampleWithPartialData];
        expectedResult = service.addUnitOfUseToCollectionIfMissing(unitOfUseCollection, unitOfUse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unitOfUse);
      });

      it('should add only unique UnitOfUse to an array', () => {
        const unitOfUseArray: IUnitOfUse[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const unitOfUseCollection: IUnitOfUse[] = [sampleWithRequiredData];
        expectedResult = service.addUnitOfUseToCollectionIfMissing(unitOfUseCollection, ...unitOfUseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const unitOfUse: IUnitOfUse = sampleWithRequiredData;
        const unitOfUse2: IUnitOfUse = sampleWithPartialData;
        expectedResult = service.addUnitOfUseToCollectionIfMissing([], unitOfUse, unitOfUse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unitOfUse);
        expect(expectedResult).toContain(unitOfUse2);
      });

      it('should accept null and undefined values', () => {
        const unitOfUse: IUnitOfUse = sampleWithRequiredData;
        expectedResult = service.addUnitOfUseToCollectionIfMissing([], null, unitOfUse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unitOfUse);
      });

      it('should return initial array if no UnitOfUse is added', () => {
        const unitOfUseCollection: IUnitOfUse[] = [sampleWithRequiredData];
        expectedResult = service.addUnitOfUseToCollectionIfMissing(unitOfUseCollection, undefined, null);
        expect(expectedResult).toEqual(unitOfUseCollection);
      });
    });

    describe('compareUnitOfUse', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUnitOfUse(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUnitOfUse(entity1, entity2);
        const compareResult2 = service.compareUnitOfUse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUnitOfUse(entity1, entity2);
        const compareResult2 = service.compareUnitOfUse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUnitOfUse(entity1, entity2);
        const compareResult2 = service.compareUnitOfUse(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
