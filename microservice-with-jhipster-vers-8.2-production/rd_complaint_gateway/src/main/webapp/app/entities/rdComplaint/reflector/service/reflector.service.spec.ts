import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IReflector } from '../reflector.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../reflector.test-samples';

import { ReflectorService, RestReflector } from './reflector.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const requireRestSample: RestReflector = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
};

describe('Reflector Service', () => {
  let service: ReflectorService;
  let httpMock: HttpTestingController;
  let expectedResult: IReflector | IReflector[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    expectedResult = null;
    service = TestBed.inject(ReflectorService);
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

    it('should create a Reflector', () => {
      const reflector = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reflector).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reflector', () => {
      const reflector = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reflector).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reflector', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reflector', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Reflector', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReflectorToCollectionIfMissing', () => {
      it('should add a Reflector to an empty array', () => {
        const reflector: IReflector = sampleWithRequiredData;
        expectedResult = service.addReflectorToCollectionIfMissing([], reflector);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reflector);
      });

      it('should not add a Reflector to an array that contains it', () => {
        const reflector: IReflector = sampleWithRequiredData;
        const reflectorCollection: IReflector[] = [
          {
            ...reflector,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReflectorToCollectionIfMissing(reflectorCollection, reflector);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reflector to an array that doesn't contain it", () => {
        const reflector: IReflector = sampleWithRequiredData;
        const reflectorCollection: IReflector[] = [sampleWithPartialData];
        expectedResult = service.addReflectorToCollectionIfMissing(reflectorCollection, reflector);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reflector);
      });

      it('should add only unique Reflector to an array', () => {
        const reflectorArray: IReflector[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reflectorCollection: IReflector[] = [sampleWithRequiredData];
        expectedResult = service.addReflectorToCollectionIfMissing(reflectorCollection, ...reflectorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reflector: IReflector = sampleWithRequiredData;
        const reflector2: IReflector = sampleWithPartialData;
        expectedResult = service.addReflectorToCollectionIfMissing([], reflector, reflector2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reflector);
        expect(expectedResult).toContain(reflector2);
      });

      it('should accept null and undefined values', () => {
        const reflector: IReflector = sampleWithRequiredData;
        expectedResult = service.addReflectorToCollectionIfMissing([], null, reflector, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reflector);
      });

      it('should return initial array if no Reflector is added', () => {
        const reflectorCollection: IReflector[] = [sampleWithRequiredData];
        expectedResult = service.addReflectorToCollectionIfMissing(reflectorCollection, undefined, null);
        expect(expectedResult).toEqual(reflectorCollection);
      });
    });

    describe('compareReflector', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReflector(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReflector(entity1, entity2);
        const compareResult2 = service.compareReflector(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReflector(entity1, entity2);
        const compareResult2 = service.compareReflector(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReflector(entity1, entity2);
        const compareResult2 = service.compareReflector(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
