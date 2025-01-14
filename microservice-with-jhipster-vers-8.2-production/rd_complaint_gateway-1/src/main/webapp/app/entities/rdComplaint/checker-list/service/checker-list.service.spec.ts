import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ICheckerList } from '../checker-list.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../checker-list.test-samples';

import { CheckerListService, RestCheckerList } from './checker-list.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const requireRestSample: RestCheckerList = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
};

describe('CheckerList Service', () => {
  let service: CheckerListService;
  let httpMock: HttpTestingController;
  let expectedResult: ICheckerList | ICheckerList[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    expectedResult = null;
    service = TestBed.inject(CheckerListService);
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

    it('should create a CheckerList', () => {
      const checkerList = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(checkerList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CheckerList', () => {
      const checkerList = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(checkerList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CheckerList', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CheckerList', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CheckerList', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCheckerListToCollectionIfMissing', () => {
      it('should add a CheckerList to an empty array', () => {
        const checkerList: ICheckerList = sampleWithRequiredData;
        expectedResult = service.addCheckerListToCollectionIfMissing([], checkerList);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkerList);
      });

      it('should not add a CheckerList to an array that contains it', () => {
        const checkerList: ICheckerList = sampleWithRequiredData;
        const checkerListCollection: ICheckerList[] = [
          {
            ...checkerList,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCheckerListToCollectionIfMissing(checkerListCollection, checkerList);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CheckerList to an array that doesn't contain it", () => {
        const checkerList: ICheckerList = sampleWithRequiredData;
        const checkerListCollection: ICheckerList[] = [sampleWithPartialData];
        expectedResult = service.addCheckerListToCollectionIfMissing(checkerListCollection, checkerList);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkerList);
      });

      it('should add only unique CheckerList to an array', () => {
        const checkerListArray: ICheckerList[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const checkerListCollection: ICheckerList[] = [sampleWithRequiredData];
        expectedResult = service.addCheckerListToCollectionIfMissing(checkerListCollection, ...checkerListArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const checkerList: ICheckerList = sampleWithRequiredData;
        const checkerList2: ICheckerList = sampleWithPartialData;
        expectedResult = service.addCheckerListToCollectionIfMissing([], checkerList, checkerList2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkerList);
        expect(expectedResult).toContain(checkerList2);
      });

      it('should accept null and undefined values', () => {
        const checkerList: ICheckerList = sampleWithRequiredData;
        expectedResult = service.addCheckerListToCollectionIfMissing([], null, checkerList, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkerList);
      });

      it('should return initial array if no CheckerList is added', () => {
        const checkerListCollection: ICheckerList[] = [sampleWithRequiredData];
        expectedResult = service.addCheckerListToCollectionIfMissing(checkerListCollection, undefined, null);
        expect(expectedResult).toEqual(checkerListCollection);
      });
    });

    describe('compareCheckerList', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCheckerList(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCheckerList(entity1, entity2);
        const compareResult2 = service.compareCheckerList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCheckerList(entity1, entity2);
        const compareResult2 = service.compareCheckerList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCheckerList(entity1, entity2);
        const compareResult2 = service.compareCheckerList(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
